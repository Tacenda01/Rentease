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

module.exports = { createTenant, createLandlord, findUserByEmail };
