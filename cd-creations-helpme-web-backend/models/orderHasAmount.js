// models/orderHasAmount.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderHasAmount = sequelize.define('order_has_amount', {
    order_order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    payment_type: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    add_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    complete_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
    tableName: 'order_has_amount' // Set custom table name if needed
});

module.exports = OrderHasAmount;
