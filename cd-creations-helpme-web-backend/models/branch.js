// models/branch.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Branch = sequelize.define('Branch', {
  branch_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  branch_name: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6),
  }
}, {
  tableName: 'branches', // Specify the table name explicitly to match your existing table
  timestamps: false // If timestamps are not needed
});

module.exports = Branch;
