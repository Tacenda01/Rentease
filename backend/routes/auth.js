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
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;
        if (role === 'tenant') {
            user = await createTenant({ firstName, lastName, email, password: hashedPassword });
        } else if (role === 'landlord') {
            user = await createLandlord({ firstName, lastName, email, password: hashedPassword });
        } else {
            return res.status(400).json({ error: 'Invalid role selected.' });
        }

        res.status(201).json({
            message: 'User registered successfully',
            userId: user.id
        });
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
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            id: user.id,
            role
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/register-admin', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const fullName = `${firstName} ${lastName}`.trim();

        const result = await pool.query(
            'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [fullName, email, hashedPassword]
        );

        res.status(201).json({ message: 'Admin registered successfully', admin: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Admin registration failed or already exists' });
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

module.exports = router;
