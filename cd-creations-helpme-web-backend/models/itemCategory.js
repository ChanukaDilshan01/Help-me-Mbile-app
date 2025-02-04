// models/itemCategory.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemCategory = sequelize.define('ItemCategory', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cat_name: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'item_category', // Specify the table name explicitly to match your existing table
  timestamps: false // If timestamps are not needed
});

module.exports = ItemCategory;
