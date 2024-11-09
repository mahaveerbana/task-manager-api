const dotenv = require('dotenv');
dotenv.config();

// Now require the other modules
const express = require('express');
const { sequelize } = require('./models');
const passport = require('passport');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Passport configuration
// require('./config/passport')(passport);
// app.use(passport.initialize()); 

// Sequelize model sync
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database connected and synced successfully.');
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });

// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
