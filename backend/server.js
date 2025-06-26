const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { initializeTables } = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

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
