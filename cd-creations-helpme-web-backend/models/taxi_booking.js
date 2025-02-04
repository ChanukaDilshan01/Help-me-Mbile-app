const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaxiBooking = sequelize.define('TaxiBooking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        index: true
    },
    pick_longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    pick_latitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    pick_location: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        index: true
    },
    driver_longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    driver_latitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    payment_type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    payment_status: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    create_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    complete_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    driver_gender: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    cancelled_by: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    charge_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cancel_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    drop_longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    drop_latitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    drop_location: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'taxi_booking',
    timestamps: false
});

module.exports = TaxiBooking;
