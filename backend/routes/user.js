const express = require('express');
const bcrypt = require('bcryptjs');
const {
    getTenantByEmail,
    getLandlordByEmail,
    updateTenantProfile,
    updateLandlordProfile,
    updateTenantPassword,
    updateLandlordPassword,
    deleteTenantAccount,
    deleteLandlordAccount
} = require('../models/user');
const pool = require('../db');

const router = express.Router();

router.get('/profile', async (req, res) => {
    const { email, role } = req.query;

    if (!email || !role) {
        return res.status(400).json({ error: 'Email and role are required' });
    }

    try {
        const user =
            role === 'tenant'
                ? await getTenantByEmail(email)
                : await getLandlordByEmail(email);

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone || ''
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.put('/profile', async (req, res) => {
    const { email, role, firstName, lastName, phone } = req.body;

    if (!email || !role || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedUser =
            role === 'tenant'
                ? await updateTenantProfile(email, firstName, lastName, phone)
                : await updateLandlordProfile(email, firstName, lastName, phone);

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Profile update failed' });
    }
});

router.put('/password', async (req, res) => {
    const { email, role, currentPassword, newPassword } = req.body;

    if (!email || !role || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'All password fields are required' });
    }

    try {
        const user =
            role === 'tenant'
                ? await getTenantByEmail(email)
                : await getLandlordByEmail(email);

        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (role === 'tenant') {
            await updateTenantPassword(email, hashedPassword);
        } else {
            await updateLandlordPassword(email, hashedPassword);
        }

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ error: 'Password update failed' });
    }
});

router.delete('/account', async (req, res) => {
    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ error: 'Email and role are required' });
    }

    try {
        if (role === 'tenant') {
            await deleteTenantAccount(email);
        } else {
            await deleteLandlordAccount(email);
        }

        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ error: 'Account deletion failed' });
    }
});

router.get('/tenants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tenants');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/landlords', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM landlords');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.patch("/block", async (req, res) => {
    const { email, role, blocked } = req.body;

    if (!email || !role || typeof blocked !== "boolean") {
        return res.status(400).json({ message: "Missing or invalid fields" });
    }

    try {
        if (role === "tenant") {
            await pool.query(
                "UPDATE tenants SET blocked = $1 WHERE email = $2",
                [blocked, email]
            );
        } else if (role === "landlord") {
            await pool.query(
                "UPDATE landlords SET blocked = $1 WHERE email = $2",
                [blocked, email]
            );

        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        res.status(200).json({ message: `User ${blocked ? "blocked" : "unblocked"} successfully` });
    } catch (err) {
        console.error("Error blocking user:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/user-stats', async (req, res) => {
    try {
        const landlordRes = await pool.query('SELECT COUNT(*) FROM landlords WHERE blocked = false');
        const tenantRes = await pool.query('SELECT COUNT(*) FROM tenants WHERE blocked = false');

        res.json({
            landlords: parseInt(landlordRes.rows[0].count, 10),
            tenants: parseInt(tenantRes.rows[0].count, 10),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

router.get('/property-stats', async (req, res) => {
    try {
        const totalRes = await pool.query(`
            SELECT COUNT(*) 
            FROM properties p
            JOIN landlords l ON p.user_id = l.id
            WHERE l.blocked = false 
        `);

        const typeRes = await pool.query(`
            SELECT p.property_type, COUNT(*) 
            FROM properties p
            JOIN landlords l ON p.user_id = l.id
            WHERE l.blocked = false 
            GROUP BY p.property_type
        `);

        const types = {
            apartment: 0,
            house: 0,
            studio: 0,
            villa: 0
        };

        typeRes.rows.forEach(row => {
            const key = row.property_type?.toLowerCase();
            if (types.hasOwnProperty(key)) {
                types[key] = parseInt(row.count, 10);
            }
        });

        res.json({
            total: parseInt(totalRes.rows[0].count, 10),
            types
        });
    } catch (err) {
        console.error('Error fetching property stats:', err);
        res.status(500).json({ error: 'Failed to fetch property stats' });
    }
});

module.exports = router;
