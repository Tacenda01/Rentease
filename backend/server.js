const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const propertyRoutes = require('./routes/property');
const contactRoutes = require('./routes/contactform');
const messagesRoute = require('./routes/messages');
const bookingsRoute = require('./routes/bookings');
const paymentRoutes = require("./routes/payment");

const { initializeTables } = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/property', propertyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', contactRoutes);
app.use('/api/messages', messagesRoute);
app.use('/api/bookings', bookingsRoute);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await initializeTables();
        console.log(`Tables initialized`);
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to initialize tables:', error);
    }
});
