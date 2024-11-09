const { Sequelize } = require('sequelize');

// Create a new Sequelize instance using the DATABASE_URL from the environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Use SSL connection
      rejectUnauthorized: false, // Disable SSL certificate validation
    },
  },
});

module.exports = sequelize;
