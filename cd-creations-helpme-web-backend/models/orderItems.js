const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your database configuration
const OrderItems = sequelize.define('OrderItems', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Allow null values if necessary
    },
    item_name: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: true
    }
}, {
    tableName: 'order_items', // Specify the table name explicitly to match your existing table
    timestamps: false // If timestamps are not needed
});

module.exports = OrderItems;