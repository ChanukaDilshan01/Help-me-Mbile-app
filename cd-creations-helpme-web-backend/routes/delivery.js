var express = require('express');
var router = express.Router();
const { addRoute, addBranch, addDeliveryVehicle, addDelivery, updateDelivery, updateDriverLocation,
  getDeliveryByOrderId, getDeliveriesByVehicleId
} = require('../controllers/deliveryController');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add-route', addRoute);
router.post('/add-branch', addBranch);
router.post('/add', addDelivery);
router.post('/update', updateDelivery);
router.get('/by-order-id/:orderId', getDeliveryByOrderId);
router.get('/by-vehicle-id/:vehicleId', getDeliveriesByVehicleId);
// Pass io instance to the updateDriverLocation controller function
router.post('/update-driver-location', (req, res, next) => updateDriverLocation(req, res, next));


module.exports = router;
