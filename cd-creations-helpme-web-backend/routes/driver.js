var express = require('express');
var router = express.Router();
const { addDriver, driverLogin, getDriverById, getAllDrivers, editDriver, getAllRoutes, editRoute, getRouteById, getDeliveryVehicleById} = require('../controllers/driverController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add', addDriver);
router.post('/login', driverLogin);
router.post('/edit', editDriver);
router.post('/routes/edit/:routeId', editRoute);
router.get('/id/:driverId', getDriverById);
router.get('/all', getAllDrivers);
router.get('/routes/all', getAllRoutes);
router.get('/routes/:routeId', getRouteById);

module.exports = router;
