// models/route.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  route_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  start_loc_name: {
    type: DataTypes.STRING,
  },
  destination_loc_name: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.DATE,
  }
}, {
  tableName: 'route', // Specify the table name explicitly to match your existing table
  timestamps: false // If timestamps are not needed
});

module.exports = Route;
