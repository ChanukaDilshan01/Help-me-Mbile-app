var express = require('express');
var router = express.Router();
const { registerUser, sendOTPByEmail, verifyOTP, loginUser, getUserByToken, updateUser, getAllUsers, addAdmin, adminLogin,
  sendOTPByPhone
} = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/all', getAllUsers);
router.post('/register', registerUser);
router.post('/sendEmailOtp', sendOTPByEmail);
router.post('/sendPhoneOtp', sendOTPByPhone);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/user-by-token', getUserByToken);
router.post('/add-admin', addAdmin);
router.post('/admin-login', adminLogin);
router.put('/update-user', updateUser);

module.exports = router;
