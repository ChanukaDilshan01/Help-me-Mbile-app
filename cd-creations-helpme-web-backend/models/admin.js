// models/admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile_pic: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'admin', // Specify the table name explicitly to match your existing table
  timestamps: false // Disable timestamps since you may not have timestamp columns
});

module.exports = Admin;
