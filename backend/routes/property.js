const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/add', async (req, res) => {
    const {
        userId,
        title,
        description,
        city,
        address,
        price,
        bedrooms,
        bathrooms,
        area,
        propertyType,
        images
    } = req.body;

    if (
        !userId || !title || !price || !city || !bedrooms ||
        !bathrooms || !area || !images || images.length === 0
    ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const location = `${city}, ${address || ''}`;

    try {
        const result = await pool.query(
            `INSERT INTO properties
             (user_id, title, description, price, location, image_urls, bedrooms, bathrooms, area, property_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
                userId,
                title,
                description || '',
                price,
                location,
                images,
                bedrooms,
                bathrooms,
                area,
                propertyType || ''
            ]
        );

        const dbProp = result.rows[0];

        const property = {
            ...dbProp,
            images: Array.isArray(dbProp.image_urls)
                ? dbProp.image_urls
                : dbProp.image_urls?.replace(/^{|}$/g, '').split(',').map(url => url.trim()) || [],
            city: dbProp.location?.split(',')[0] || ''
        };

        res.status(201).json({
            message: 'Property added successfully',
            property
        });

    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).json({ error: 'Failed to add property' });
    }
});

router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM properties WHERE user_id = $1 ORDER BY created_at DESC',
            [id]
        );

        const properties = result.rows.map(row => ({
            ...row,
            images: Array.isArray(row.image_urls)
                ? row.image_urls
                : row.image_urls?.replace(/^{|}$/g, '').split(',').map(url => url.trim()) || [],
            city: row.location?.split(',')[0] || ''
        }));

        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.* FROM properties p
            JOIN landlords l ON p.user_id = l.id
            WHERE l.blocked = false
            ORDER BY p.created_at DESC
        `);

        const properties = result.rows.map(row => ({
            ...row,
            images: Array.isArray(row.image_urls)
                ? row.image_urls
                : row.image_urls?.replace(/^{|}$/g, '').split(',').map(url => url.trim()) || [],
            city: row.location?.split(',')[0] || ''
        }));

        res.json(properties);
    } catch (error) {
        console.error('Error fetching all properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid UUID format for property_id' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM properties WHERE property_id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Property not found or already deleted' });
        }

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
