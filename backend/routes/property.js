const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/add', async (req, res) => {
    const {
        landlordId,
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
        !landlordId || !title || !price || !city || !bedrooms ||
        !bathrooms || !area || !images || images.length === 0
    ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const location = `${city}, ${address || ''}`;

    try {
        const result = await pool.query(
            `INSERT INTO properties
             (landlord_id, title, description, price, location, image_urls, bedrooms, bathrooms, area, property_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
                landlordId,
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

        const property = result.rows[0];
        property.images = Array.isArray(property.image_urls)
            ? property.image_urls
            : property.image_urls
                ?.replace(/^{|}$/g, '')
                .split(',')
                .map((url) => url.trim()) || [];

        res.status(201).json({
            message: 'Property added successfully',
            property
        });
    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).json({ error: 'Failed to add property' });
    }
});

router.get('/landlord/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM properties WHERE landlord_id = $1 ORDER BY created_at DESC',
            [id]
        );

        const properties = result.rows.map((row) => ({
            ...row,
            images: Array.isArray(row.image_urls)
                ? row.image_urls
                : row.image_urls
                    ?.replace(/^{|}$/g, '')
                    .split(',')
                    .map((url) => url.trim()) || [],
            city: row.location?.split(',')[0] || ''
        }));

        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

module.exports = router;
