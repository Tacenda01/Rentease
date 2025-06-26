const express = require('express');
const bcrypt = require('bcryptjs');
const {
    createTenant,
    createLandlord,
    findUserByEmail,
    findAdminByEmail
} = require('../models/user');
const pool = require('../db');
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

        res.status(200).json({
            message: 'Login successful',
            name: user.name,
            email: user.email,
            role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/login-admin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await findAdminByEmail(email);
        if (!admin) return res.status(400).json({ error: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

        res.status(200).json({
            message: 'Admin login successful',
            name: admin.name,
            email: admin.email,
            role: 'admin'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Admin login failed' });
    }
});


router.post('/register-admin', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'Admin registered successfully', admin: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Admin registration failed or already exists' });
    }
});

module.exports = router;
