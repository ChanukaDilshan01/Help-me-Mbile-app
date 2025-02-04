const TaxiCharge = require('../models/taxi_charges');
const TaxiBooking = require('../models/taxi_booking');
const {Op} = require("sequelize");

async function addTaxiCharge(req, res, next) {
    try {
        const { per_km_charges, initial_charges } = req.body;

        // Create a new taxi charge record in the database
        const taxiCharge = await TaxiCharge.create({
            per_km_charges,
            initial_charges,
            created_at: new Date() // Set the current date as the created_at value
        });

        // Return the newly created taxi charge
        res.status(201).json({ message: 'Taxi charge added successfully', taxiCharge });
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

async function getLatestTaxiCharge(req, res, next) {
    try {
        // Find the latest row from the taxi charges table
        const latestTaxiCharge = await TaxiCharge.findOne({
            order: [['created_at', 'DESC']], // Order by created_at column in descending order
        });

        if (!latestTaxiCharge) {
            return res.status(404).json({ message: 'No taxi charges found' });
        }

        res.json({ latestTaxiCharge });
    } catch (error) {
        next(error);
    }
}

async function addTaxiBooking(req, res, next) {
    try {
        const {
            customer_id,
            pick_longitude,
            pick_latitude,
            pick_location,
            drop_longitude,
            drop_latitude,
            drop_location,
            amount,
            payment_type,
            payment_status,
            create_at,
            driver_gender,
            charge_id
        } = req.body;

        // Create a new taxi booking record in the database with status as "pending"
        const taxiBooking = await TaxiBooking.create({
            customer_id,
            pick_longitude,
            pick_latitude,
            pick_location,
            drop_longitude,
            drop_latitude,
            drop_location,
            amount,
            payment_type,
            payment_status,
            create_at,
            driver_gender,
            charge_id,
            status: "pending"
        });

        // Emit the new booking event to all connected clients
        const io = req.app.get('io');
        io.emit('new-taxi-booking', taxiBooking);

        // Return the newly created taxi booking
        res.status(201).json({ message: 'Taxi booking added successfully', taxiBooking });
    } catch (error) {
        // If an error occurs, emit an error event using Socket.IO
        const io = req.app.get('io');
        io.emit('booking-error', { message: 'Error adding taxi booking', error: error.message });

        // Pass the error to the error handler middleware
        next(error);
    }
}

async function updateTaxiBooking(req, res, next) {
    try {
        const { bookingId, newData } = req.body;

        // Find the taxi booking by ID
        let taxiBooking = await TaxiBooking.findByPk(bookingId);

        // If taxi booking is not found, return an error
        if (!taxiBooking) {
            return res.status(404).json({ message: 'Taxi booking not found' });
        }

        // Update taxi booking information
        await taxiBooking.update(newData);

        // Fetch the updated taxi booking record
        taxiBooking = await TaxiBooking.findByPk(bookingId);

        // Emit event with the updated taxi booking data
        const io = req.app.get('io');
        io.emit('updated-taxi-booking', taxiBooking);

        // Return the updated taxi booking object
        res.status(200).json({ message: 'Taxi booking updated successfully', taxiBooking });
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

async function updateTaxiDriverLocation(req, res, next) {
    try {
        const { bookingId, longitude, latitude } = req.body;
        const io = req.app.get('io');

        // Find the taxi booking by ID
        const taxiBooking = await TaxiBooking.findByPk(bookingId);

        // If taxi booking is not found, return an error
        if (!taxiBooking) {
            return res.status(404).json({ message: 'Taxi booking not found' });
        }

        // Update the driver's longitude and latitude
        taxiBooking.driver_longitude = longitude;
        taxiBooking.driver_latitude = latitude;

        // Save the changes to the taxi booking record
        await taxiBooking.save();

        // Emit the updated location to WebSocket clients subscribed to this taxi booking
        io.emit(`taxi-booking-${bookingId}-driver-location-update`, { longitude, latitude });

        // Return a success message
        res.status(200).json({ message: 'Driver location updated successfully' });
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

async function getTaxiBookingsForToday(req, res, next) {
    try {
        // Get the current date
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        // Find all taxi bookings for today
        const taxiBookings = await TaxiBooking.findAll({
            where: {
                create_at: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        res.json({ taxiBookings });
    } catch (error) {
        next(error);
    }
}

async function getTaxiBookingsByDriverId(req, res, next) {
    try {
        const { driver_id } = req.params;

        // Find all taxi bookings for the specified driver ID
        const taxiBookings = await TaxiBooking.findAll({
            where: {
                driver_id: driver_id
            }
        });

        if (!taxiBookings.length) {
            return res.status(404).json({ message: 'No taxi bookings found for this driver' });
        }

        res.json({ taxiBookings });
    } catch (error) {
        next(error);
    }
}

async function getTaxiBookingsByDateRange(req, res, next) {
    try {
        const { startDate, endDate } = req.query;

        // Validate the dates
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        // Find all taxi bookings within the date range
        const taxiBookings = await TaxiBooking.findAll({
            where: {
                create_at: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            }
        });

        if (taxiBookings.length === 0) {
            return res.status(404).json({ message: 'No taxi bookings found in the given date range' });
        }

        res.json({ taxiBookings });
    } catch (error) {
        next(error);
    }
}

async function getTaxiBookingById(req, res, next) {
    try {
        const { bookingId } = req.params;

        // Find the taxi booking by its booking ID
        const taxiBooking = await TaxiBooking.findByPk(bookingId);

        // If taxi booking is not found, return an error
        if (!taxiBooking) {
            return res.status(404).json({ message: 'Taxi booking not found' });
        }

        // Return the taxi booking details
        res.status(200).json({ taxiBooking });
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

module.exports = {
    addTaxiCharge,
    getLatestTaxiCharge,
    addTaxiBooking,
    updateTaxiBooking,
    updateTaxiDriverLocation,
    getTaxiBookingsForToday,
    getTaxiBookingsByDriverId,
    getTaxiBookingsByDateRange,
    getTaxiBookingById
};