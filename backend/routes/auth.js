const express = require('express');
const bcrypt = require('bcryptjs');
const {
    createTenant,
    createLandlord,
    findUserByEmail
} = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;
        if (role === 'tenant') {
            user = await createTenant({ name, email, password: hashedPassword });
        } else if (role === 'landlord') {
            user = await createLandlord({ name, email, password: hashedPassword });
        } else {
            return res.status(400).json({ error: 'Invalid role selected.' });
        }

        res.status(201).json({ message: 'User registered successfully', user: user.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'User already exists or registration failed.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await findUserByEmail(email, role);
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
