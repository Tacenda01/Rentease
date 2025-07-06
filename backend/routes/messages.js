const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/send', async (req, res) => {
    const { tenantId, landlordId, propertyId, message, senderId } = req.body;

    if (!tenantId || !landlordId || !propertyId || !message || !senderId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO contact_messages (tenant_id, landlord_id, property_id, message, sender_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [tenantId, landlordId, propertyId, message, senderId]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('Error sending message:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/conversation/:tenantId/:landlordId/:propertyId', async (req, res) => {
    const { tenantId, landlordId, propertyId } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM contact_messages
             WHERE tenant_id = $1 AND landlord_id = $2 AND property_id = $3
             ORDER BY created_at ASC`,
            [tenantId, landlordId, propertyId]
        );

        res.json({ success: true, messages: result.rows });
    } catch (err) {
        console.error('Error fetching conversation:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/read/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            `UPDATE contact_messages SET is_read = TRUE WHERE id = $1`,
            [id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Error marking message as read:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/summary/:userId/:role', async (req, res) => {
    const { userId, role } = req.params;

    if (!userId || !['tenant', 'landlord'].includes(role)) {
        return res.status(400).json({ error: 'Invalid userId or role' });
    }

    const userColumn = role === 'tenant' ? 'tenant_id' : 'landlord_id';

    try {
        const result = await pool.query(
            `
            SELECT 
                cm.property_id,
                p.title,
                p.location,
                cm.tenant_id,
                cm.landlord_id,
                MAX(cm.created_at) AS latest_time,
                (ARRAY_AGG(cm.message ORDER BY cm.created_at DESC))[1] AS latest_message,
                BOOL_OR(cm.is_read = FALSE AND cm.sender_id != $1) AS has_unread
            FROM contact_messages cm
            JOIN properties p ON cm.property_id = p.property_id
            WHERE cm.${userColumn} = $1
            GROUP BY cm.property_id, p.title, p.location, cm.tenant_id, cm.landlord_id
            ORDER BY latest_time DESC
            `,
            [userId]
        );

        res.json({ success: true, conversations: result.rows });
    } catch (err) {
        console.error('Error fetching message summary:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/mark-read/:propertyId/:userId/:role', async (req, res) => {
    const { propertyId, userId, role } = req.params;

    const column = role === 'landlord' ? 'landlord_id' : 'tenant_id';

    try {
        await pool.query(
            `UPDATE contact_messages
             SET is_read = TRUE
             WHERE property_id = $1 AND ${column} = $2`,
            [propertyId, userId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Error marking messages as read:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
