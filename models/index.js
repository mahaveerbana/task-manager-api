const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

// Associations
User.hasMany(Task);
Task.belongsTo(User);

module.exports = { sequelize, User, Task };
