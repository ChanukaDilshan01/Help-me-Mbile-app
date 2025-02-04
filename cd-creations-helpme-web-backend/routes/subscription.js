var express = require('express');
var router = express.Router();
const { addPackage, editPackage, changePackageStatus, addDependent, addSubscription, getSubscriptionsByUserId, updateSubscriptionStatus, getAllPackages,
  getAllSubscriptions
} = require('../controllers/subscriptionController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/package-add', addPackage);
router.post('/package/:id/change-status', changePackageStatus);
router.post('/package/edit/:id', editPackage); // Route for editing a package
router.get('/packages', getAllPackages); // Route for getting all packages
router.post('/dependent-add', addDependent);
router.post('/add', addSubscription);
router.post('/status-update', updateSubscriptionStatus);
router.get('/user/:userId', getSubscriptionsByUserId);
router.get('/all', getAllSubscriptions);

module.exports = router;
