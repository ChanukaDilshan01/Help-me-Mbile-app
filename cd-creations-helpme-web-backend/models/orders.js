// models/orders.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Orders = sequelize.define('Orders', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
  },
  item_details: {
    type: DataTypes.TEXT,
  },
  input_type: {
    type: DataTypes.STRING,
  },
  category_id: {
    type: DataTypes.INTEGER,
  },
  customer_id: {
    type: DataTypes.INTEGER,
  },
  mobile_no: {
    type: DataTypes.STRING,
  },
  destination_address: {
    type: DataTypes.TEXT,
  },
  destination_longitude: {
    type: DataTypes.DECIMAL(11, 8),
  },
  destination_latitude: {
    type: DataTypes.DECIMAL(11, 8),
  },
  status: {
    type: DataTypes.STRING,
  },
  delivery_id: {
    type: DataTypes.INTEGER,
  },
  payment_type: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  payment_status: {
    type: DataTypes.STRING,
  },
  complete_time: {
    type: DataTypes.DATE,
  },
  details_pic: {
    type: DataTypes.TEXT,
  },
  customer_response: {
    type: DataTypes.STRING,
  },
  cancelled_by: {
    type: DataTypes.STRING,
  },
  cancel_reason: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'orders', // Specify the table name explicitly to match your existing table
  timestamps: false // If timestamps are not needed
});

module.exports = Orders;
