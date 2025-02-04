// models/driver.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  driver_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bike_no: {
    type: DataTypes.STRING,
  },
  phone_no: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  profile_pic: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.STRING,
  },
  vehicle_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  }
}, {
  tableName: 'driver', // Specify the table name explicitly to match your existing table
  timestamps: false // If timestamps are not needed
});

module.exports = Driver;
