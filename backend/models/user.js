const pool = require('../db');

async function initializeTables() {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        blocked BOOLEAN DEFAULT FALSE
    );`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS landlords (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        blocked BOOLEAN DEFAULT FALSE
    );`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS properties (
        property_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES landlords(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        location TEXT NOT NULL,
        image_urls TEXT[],
        bedrooms INTEGER,
        bathrooms INTEGER,
        area INTEGER,
        property_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
        booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        property_id UUID REFERENCES properties(property_id) ON DELETE CASCADE,
        move_in_date DATE NOT NULL,
        duration INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_form_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tenant_id UUID NOT NULL,
        landlord_id UUID NOT NULL,
        property_id UUID NOT NULL,
        message TEXT NOT NULL,
        sender_id UUID NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
    );`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
        payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        booking_id UUID REFERENCES bookings(booking_id) ON DELETE SET NULL,
        transaction_id VARCHAR(100) NOT NULL UNIQUE,
        amount INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    console.log("All tables initialized with UUID support.");
}


async function createTenant({ firstName, lastName, email, password, phone }) {
    const result = await pool.query(
        'INSERT INTO tenants (first_name, last_name, email, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [firstName, lastName, email, password, phone]
    );
    return result.rows[0];
}

async function createLandlord({ firstName, lastName, email, password, phone }) {
    const result = await pool.query(
        'INSERT INTO landlords (first_name, last_name, email, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [firstName, lastName, email, password, phone]
    );
    return result.rows[0];
}

async function findUserByEmail(email, role) {
    const table = role === 'tenant' ? 'tenants' : 'landlords';
    const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);
    return result.rows[0];
}

async function findAdminByEmail(email) {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    return result.rows[0];
}

async function getTenantByEmail(email) {
    const result = await pool.query('SELECT * FROM tenants WHERE email = $1', [email]);
    return result.rows[0];
}

async function getLandlordByEmail(email) {
    const result = await pool.query('SELECT * FROM landlords WHERE email = $1', [email]);
    return result.rows[0];
}

async function updateTenantProfile(email, firstName, lastName, phone) {
    const result = await pool.query(
        'UPDATE tenants SET first_name = $1, last_name = $2, phone = $3 WHERE email = $4 RETURNING *',
        [firstName, lastName, phone, email]
    );
    return result.rows[0];
}

async function updateLandlordProfile(email, firstName, lastName, phone) {
    const result = await pool.query(
        'UPDATE landlords SET first_name = $1, last_name = $2, phone = $3 WHERE email = $4 RETURNING *',
        [firstName, lastName, phone, email]
    );
    return result.rows[0];
}

async function updateTenantPassword(email, password) {
    await pool.query('UPDATE tenants SET password = $1 WHERE email = $2', [password, email]);
}

async function updateLandlordPassword(email, password) {
    await pool.query('UPDATE landlords SET password = $1 WHERE email = $2', [password, email]);
}

async function deleteTenantAccount(email) {
    await pool.query('DELETE FROM tenants WHERE email = $1', [email]);
}

async function deleteLandlordAccount(email) {
    await pool.query('DELETE FROM landlords WHERE email = $1', [email]);
}


async function savePayment({ tenantId, transactionId, amount, status, bookingId }) {
    const existing = await pool.query(
        'SELECT * FROM payments WHERE transaction_id = $1',
        [transactionId]
    );

    if (existing.rows.length > 0) {
        console.log("Duplicate transaction, skipping insert:", transactionId);
        return existing.rows[0];
    }

    const result = await pool.query(
        `INSERT INTO payments (tenant_id, booking_id, transaction_id, amount, status)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [tenantId, bookingId, transactionId, amount, status]
    );

    return result.rows[0];
}

async function getPaymentsByTenantId(tenantId) {
    const result = await pool.query(
        'SELECT * FROM payments WHERE tenant_id = $1 ORDER BY payment_date DESC',
        [tenantId]
    );
    return result.rows;
}

async function getAllPaymentsWithBookingsByTenantId(tenantId) {
    const result = await pool.query(`
        SELECT 
            p.payment_id,
            p.transaction_id,
            p.amount,
            p.status,
            TO_CHAR(p.payment_date, 'YYYY-MM-DD') AS payment_date,
            b.booking_id,
            b.property_id,
            TO_CHAR(b.move_in_date, 'YYYY-MM-DD') AS move_in_date,
            b.duration
        FROM payments p
        LEFT JOIN bookings b ON p.booking_id = b.booking_id
        WHERE p.tenant_id = $1
        ORDER BY p.payment_date DESC;
    `, [tenantId]);

    return result.rows.map(row => ({
        ...row,
        payment_date: row.payment_date,
        booking: {
            booking_id: row.booking_id,
            property_id: row.property_id,
            move_in_date: row.move_in_date,
            duration: row.duration
        }
    }));
}


module.exports = {
    initializeTables,
    createTenant,
    createLandlord,
    findUserByEmail,
    findAdminByEmail,
    getTenantByEmail,
    getLandlordByEmail,
    updateTenantProfile,
    updateLandlordProfile,
    updateTenantPassword,
    updateLandlordPassword,
    deleteTenantAccount,
    deleteLandlordAccount,
    savePayment,
    getPaymentsByTenantId,
    getAllPaymentsWithBookingsByTenantId
};
