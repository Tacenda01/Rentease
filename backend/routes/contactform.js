const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/notification', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(
            'INSERT INTO contact_form_messages (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );
        res.status(201).json({ message: 'Message submitted successfully' });
    } catch (err) {
        console.error('Error submitting message:', err);
        res.status(500).json({ error: 'Failed to submit message' });
    }
});

router.get('/notification-messages', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM contact_form_messages ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

router.patch('/notification/:id', async (req, res) => {
    const { id } = req.params;
    const { is_read } = req.body;

    try {
        await pool.query(
            'UPDATE contact_form_messages SET is_read = $1 WHERE id = $2',
            [is_read, id]
        );
        res.status(200).json({ message: 'Read status updated' });
    } catch (err) {
        console.error('Error updating is_read:', err);
        res.status(500).json({ error: 'Failed to update read status' });
    }
});

module.exports = router;
