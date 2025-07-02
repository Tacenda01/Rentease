const pool = require("../db");

async function initializeTables() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS tenants (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT
        );
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS landlords (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT
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
        );
`);

  console.log("All tables initialized with UUID support.");
}

async function createTenant({ firstName, lastName, email, password }) {
  const result = await pool.query(
    "INSERT INTO tenants (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
    [firstName, lastName, email, password]
  );
  return result.rows[0];
}

async function createLandlord({ firstName, lastName, email, password }) {
  const result = await pool.query(
    "INSERT INTO landlords (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
    [firstName, lastName, email, password]
  );
  return result.rows[0];
}

async function findUserByEmail(email, role) {
  const table = role === "tenant" ? "tenants" : "landlords";
  const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
}

async function findAdminByEmail(email) {
  const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function getTenantByEmail(email) {
  const result = await pool.query("SELECT * FROM tenants WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function getLandlordByEmail(email) {
  const result = await pool.query("SELECT * FROM landlords WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function updateTenantProfile(email, firstName, lastName, phone) {
  const result = await pool.query(
    "UPDATE tenants SET first_name = $1, last_name = $2, phone = $3 WHERE email = $4 RETURNING *",
    [firstName, lastName, phone, email]
  );
  return result.rows[0];
}

async function updateLandlordProfile(email, firstName, lastName, phone) {
  const result = await pool.query(
    "UPDATE landlords SET first_name = $1, last_name = $2, phone = $3 WHERE email = $4 RETURNING *",
    [firstName, lastName, phone, email]
  );
  return result.rows[0];
}

async function updateTenantPassword(email, password) {
  await pool.query("UPDATE tenants SET password = $1 WHERE email = $2", [
    password,
    email,
  ]);
}

async function updateLandlordPassword(email, password) {
  await pool.query("UPDATE landlords SET password = $1 WHERE email = $2", [
    password,
    email,
  ]);
}

async function deleteTenantAccount(email) {
  await pool.query("DELETE FROM tenants WHERE email = $1", [email]);
}

async function deleteLandlordAccount(email) {
  await pool.query("DELETE FROM landlords WHERE email = $1", [email]);
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
};
