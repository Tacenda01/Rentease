const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    createTenant,
    createLandlord,
    findUserByEmail,
    findAdminByEmail
} = require('../models/user');
const pool = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '2h';

const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

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
            return res.status(400).json({ error: 'Invalid role.' });
        }

        res.status(201).json({ message: 'Registered successfully', userId: user.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'User already exists or registration failed.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await findUserByEmail(email, role);
        if (!user) return res.status(400).json({ error: 'User not found' });

        if (user.blocked === true) {
            return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect credentials' });

        const token = generateToken({ id: user.id, role, email: user.email });

        res.status(200).json({
            message: 'Login successful',
            token,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            id: user.id,
            role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/login-admin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await findAdminByEmail(email);
        if (!admin) return res.status(400).json({ error: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect credentials' });

        const token = generateToken({ email: admin.email, role: 'admin' });

        res.status(200).json({
            message: 'Admin login successful',
            name: admin.name,
            email: admin.email,
            role: 'admin',
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Admin login failed' });
    }
});

router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.user });
});

module.exports = router;
