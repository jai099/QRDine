const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes); 
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Restaurant backend running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
