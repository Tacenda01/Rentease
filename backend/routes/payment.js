const express = require("express");
const Stripe = require("stripe");
const pool = require("../db");
const { getAllPaymentsWithBookingsByTenantId } = require("../models/user");
require("dotenv").config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
    const { tenantId, propertyId, amount, moveInDate, duration } = req.body;

    if (!tenantId || !propertyId || !amount || !moveInDate || !duration) {
        return res.status(400).json({
            error: "Missing tenantId, propertyId, amount, moveInDate, or duration",
        });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "inr",
                    product_data: { name: `Booking for Property ID: ${propertyId}` },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }],
            success_url: `${process.env.FRONTEND_URL}/tenant/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/tenant/payment-failed`,
            metadata: {
                tenantId,
                propertyId,
                moveInDate,
                duration,
                amount,
            },
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error("Stripe session creation error:", err.message);
        res.status(500).json({ error: "Stripe error", details: err.message });
    }
});

router.get("/status/:sessionId", async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId || sessionId === "null") {
        return res.status(400).json({ error: "Invalid or missing session ID" });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const { tenantId, propertyId, moveInDate, duration, amount } = session.metadata;

            const existing = await pool.query(
                "SELECT * FROM payments WHERE transaction_id = $1",
                [sessionId]
            );

            if (existing.rows.length > 0) {
                const bookingId = existing.rows[0].booking_id;

                return res.json({
                    success: true,
                    code: "PAYMENT_SUCCESS",
                    tenantId,
                    propertyId,
                    bookingId,
                    amount
                });
            }

            const bookingResult = await pool.query(
                `INSERT INTO bookings (tenant_id, property_id, move_in_date, duration)
                 VALUES ($1, $2, $3, $4)
                 RETURNING booking_id`,
                [tenantId, propertyId, moveInDate, duration]
            );

            const bookingId = bookingResult.rows[0].booking_id;

            await pool.query(
                `INSERT INTO payments (tenant_id, booking_id, transaction_id, amount, status)
                 VALUES ($1, $2, $3, $4, 'SUCCESS')`,
                [tenantId, bookingId, sessionId, amount]
            );

            return res.json({
                success: true,
                code: "PAYMENT_SUCCESS",
                tenantId,
                propertyId,
                bookingId,
                amount
            });
        }

        return res.json({ success: false, code: "PAYMENT_FAILED" });
    } catch (err) {
        console.error("Stripe status error:", err.message);
        res.status(500).json({ error: "Stripe status error", details: err.message });
    }
});


router.get("/tenant/:tenantId", async (req, res) => {
    const { tenantId } = req.params;

    try {
        const payments = await getAllPaymentsWithBookingsByTenantId(tenantId);
        res.json(payments);
    } catch (err) {
        console.error("Failed to fetch tenant payments:", err.message);
        res.status(500).json({ error: "Failed to fetch tenant payments" });
    }
});

router.get('/landlord/:landlordId', async (req, res) => {
    const { landlordId } = req.params;

    try {
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
      JOIN bookings b ON p.booking_id = b.booking_id
      JOIN properties pr ON b.property_id = pr.property_id
      WHERE pr.user_id = $1
      ORDER BY p.payment_date DESC;
    `, [landlordId]);

        const payments = result.rows.map(row => ({
            ...row,
            booking: {
                booking_id: row.booking_id,
                property_id: row.property_id,
                move_in_date: row.move_in_date,
                duration: row.duration
            }
        }));

        const total = payments.reduce((sum, p) => sum + parseInt(p.amount), 0);

        res.json({ payments, totalEarnings: total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch landlord payments." });
    }
});

router.get('/landlord/:landlordId/monthly-summary', async (req, res) => {
    const { landlordId } = req.params;

    try {
        const result = await pool.query(`
      SELECT 
        TO_CHAR(p.payment_date, 'YYYY-MM') AS month,
        SUM(p.amount) AS total
      FROM payments p
      JOIN bookings b ON p.booking_id = b.booking_id
      JOIN properties pr ON b.property_id = pr.property_id
      WHERE pr.user_id = $1
      GROUP BY month
      ORDER BY month DESC
    `, [landlordId]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch monthly summary' });
    }
});

router.get('/landlord/:landlordId/property/:propertyId', async (req, res) => {
    const { landlordId, propertyId } = req.params;

    try {
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
      JOIN bookings b ON p.booking_id = b.booking_id
      JOIN properties pr ON b.property_id = pr.property_id
      WHERE pr.user_id = $1 AND b.property_id = $2
      ORDER BY p.payment_date DESC;
    `, [landlordId, propertyId]);

        const payments = result.rows.map(row => ({
            ...row,
            booking: {
                booking_id: row.booking_id,
                property_id: row.property_id,
                move_in_date: row.move_in_date,
                duration: row.duration
            }
        }));

        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to filter payments." });
    }
});

router.get('/all', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        p.payment_id,
        p.transaction_id,
        p.amount,
        p.status,
        TO_CHAR(p.payment_date, 'YYYY-MM-DD') AS payment_date,
        t.first_name,
        t.last_name,
        t.phone,
        b.move_in_date,
        b.duration
      FROM payments p
      LEFT JOIN tenants t ON p.tenant_id = t.id
      LEFT JOIN bookings b ON p.booking_id = b.booking_id
      ORDER BY p.payment_date DESC;
    `);

        const payments = result.rows.map(row => ({
            ...row,
            tenant_name: `${row.first_name} ${row.last_name}`,
            tenant_phone: row.phone
        }));

        res.json(payments);
    } catch (err) {
        console.error("Error fetching payments:", err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});



module.exports = router;
