const pool = require('../db');

async function createTenant({ name, email, password }) {
    return await pool.query(
        'INSERT INTO tenants (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password]
    );
}

async function createLandlord({ name, email, password }) {
    return await pool.query(
        'INSERT INTO landlords (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password]
    );
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
async function initializeTables() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tenants (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS landlords (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS admins (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `);
    console.log("Tenant and Landlord tables are ready.");
}

module.exports = {
    createTenant,
    createLandlord,
    findUserByEmail,
    initializeTables,
    findAdminByEmail
};
