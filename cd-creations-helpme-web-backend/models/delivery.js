const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Route = require('./route');

const Delivery = sequelize.define('Delivery', {
  delivery_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  route_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  driver_longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
  },
  driver_latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  add_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  complete_date: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'delivery', // Specify the table name explicitly to match your existing table
  timestamps: false // If timestamps are not needed
});

// Define associations
Delivery.belongsTo(Route, { foreignKey: 'route_id' });

module.exports = Delivery;
