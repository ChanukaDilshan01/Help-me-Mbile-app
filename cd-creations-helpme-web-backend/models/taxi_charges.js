const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaxiCharge = sequelize.define('TaxiCharge', {
    charge_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    per_km_charges: {
        type: DataTypes.DECIMAL(10, 2)
    },
    initial_charges: {
        type: DataTypes.DECIMAL(10, 2)
    },
    created_at: {
        type: DataTypes.DATEONLY
    }
}, {
    tableName: 'taxi_charges', // Specify the table name explicitly to match your existing table
    timestamps: false // If timestamps are not needed
});

module.exports = TaxiCharge;
