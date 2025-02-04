var express = require('express');
const {addTaxiCharge, getLatestTaxiCharge, addTaxiBooking, updateTaxiBooking, updateTaxiDriverLocation,
    getTaxiBookingsForToday, getTaxiBookingsByDriverId, getTaxiBookingsByDateRange, getTaxiBookingById
} = require("../controllers/taxiController");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/add-charges', addTaxiCharge);
router.post('/add-booking', addTaxiBooking);
router.post('/update-booking', updateTaxiBooking);
router.post('/update-driver-location', updateTaxiDriverLocation);
router.get('/today-booking', getTaxiBookingsForToday);
router.get('/latest-charges', getLatestTaxiCharge);
router.get('/taxi-bookings-by-driver/:driver_id', getTaxiBookingsByDriverId);
router.get('/taxi-bookings-by-date-range', getTaxiBookingsByDateRange);
router.get('/taxi-booking/:bookingId', getTaxiBookingById);

module.exports = router;
