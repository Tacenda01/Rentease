const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    const { tenantId, propertyId, moveInDate, duration } = req.body;

    if (!tenantId || !propertyId || !moveInDate || !duration) {
        return res.status(400).json({ error: 'Missing booking data' });
    }

    try {
        const latestBookingResult = await pool.query(
            `
      SELECT move_in_date, duration
      FROM bookings
      WHERE property_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
            [propertyId]
        );

        if (latestBookingResult.rows.length > 0) {
            const { move_in_date, duration: lastDuration } = latestBookingResult.rows[0];

            const lastMoveInDate = new Date(move_in_date);
            const lastAvailableDate = new Date(lastMoveInDate);
            lastAvailableDate.setDate(lastAvailableDate.getDate() + (lastDuration * 30));

            const nextAvailableDate = new Date(lastAvailableDate);
            nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);

            const requestedMoveIn = new Date(moveInDate);

            if (requestedMoveIn < nextAvailableDate) {
                return res.status(400).json({
                    error: `This property is not available before ${nextAvailableDate.toLocaleDateString("en-IN")}`,
                });
            }
        }

        const result = await pool.query(
            `INSERT INTO bookings (tenant_id, property_id, move_in_date, duration)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [tenantId, propertyId, moveInDate, duration]
        );

        res.status(201).json({ booking_id: result.rows[0].booking_id });
    } catch (err) {
        console.error('Booking insert error:', err);
        res.status(500).json({ error: 'Server error while booking' });
    }
});
router.get('/tenant/:tenantId', async (req, res) => {
    const { tenantId } = req.params;

    try {
        const result = await pool.query(`
      SELECT 
        b.*, 
        p.title, 
        p.description, 
        p.location, 
        p.image_urls, 
        p.property_id
      FROM bookings b
      JOIN properties p ON b.property_id = p.property_id
      WHERE b.tenant_id = $1
      ORDER BY b.created_at DESC
    `, [tenantId]);

        const bookings = result.rows.map(row => ({
            ...row,
            images: Array.isArray(row.image_urls)
                ? row.image_urls
                : row.image_urls?.replace(/^{|}$/g, '').split(',').map(url => url.trim()) || [],
        }));

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/landlord/:landlordId', async (req, res) => {
    const { landlordId } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                b.*, 
                t.first_name, 
                t.last_name, 
                t.phone,
                p.property_id,
                p.title,
                p.description,
                p.location,
                p.image_urls
            FROM bookings b
            JOIN tenants t ON b.tenant_id = t.id
            JOIN properties p ON b.property_id = p.property_id
            WHERE p.user_id = $1
            ORDER BY b.created_at DESC
        `, [landlordId]);

        const bookings = result.rows.map(row => ({
            ...row,
            tenant_name: `${row.first_name} ${row.last_name}`,
            tenant_phone: row.phone,
            images: Array.isArray(row.image_urls)
                ? row.image_urls
                : (row.image_urls ? row.image_urls.replace(/^{|}$/g, '').split(',').map(url => url.trim()) : []),
        }));

        res.json(bookings);
    } catch (err) {
        console.error('Error fetching bookings for landlord:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        b.booking_id,
        b.move_in_date,
        b.duration,
        b.created_at,
        t.first_name AS tenant_first_name,
        t.last_name AS tenant_last_name,
        t.phone AS tenant_phone,
        p.title,
        p.location,
        p.image_urls
      FROM bookings b
      JOIN tenants t ON b.tenant_id = t.id
      JOIN properties p ON b.property_id = p.property_id
      ORDER BY b.created_at DESC;
    `);

        const bookings = result.rows.map(row => ({
            booking_id: row.booking_id,
            move_in_date: row.move_in_date,
            duration: row.duration,
            tenant_name: `${row.tenant_first_name} ${row.tenant_last_name}`,
            tenant_phone: row.tenant_phone,
            title: row.title,
            location: row.location,
            images: row.image_urls,
        }));

        res.json(bookings);
    } catch (err) {
        console.error("Error fetching all bookings:", err);
        res.status(500).json({ error: "Failed to fetch all bookings" });
    }
});

router.get('/availability/:propertyId', async (req, res) => {
    const { propertyId } = req.params;

    try {
        const result = await pool.query(`
      SELECT 
        MAX(move_in_date + (duration || ' month')::interval) AS booked_till
      FROM bookings
      WHERE property_id = $1
    `, [propertyId]);

        const bookedTill = result.rows[0].booked_till;
        let availableDate = new Date();

        if (bookedTill && new Date(bookedTill) > availableDate) {
            availableDate = new Date(bookedTill);
            availableDate.setDate(availableDate.getDate() + 1);
        }

        res.json({ availableDate: availableDate.toISOString().split('T')[0] });
    } catch (err) {
        console.error('Error fetching availability:', err);
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
});

module.exports = router;
