// models/dependent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dependent = sequelize.define('Dependent', {
  dependent_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  otp: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'dependent', 
  timestamps: false 
});

module.exports = Dependent;
