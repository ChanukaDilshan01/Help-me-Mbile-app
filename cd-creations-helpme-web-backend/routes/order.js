const express = require('express');
const router = express.Router();
const { addCategory, loadCategories, addOrder, updateOrder, getOrderWithDelivery, getOrdersWithDeliveriesByDateRange,
  getTodayOrdersByCustomerId, cancelOrder,
  uploadOrderImage,
  getOrderImage, addOrderItem, editOrderItem, deleteOrderItem, getOrderItemsByOrderId
} = require('../controllers/orderController');
const multer = require('multer');
const upload = multer({ dest: 'public/images/orders' });

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add-category', addCategory);
router.post('/add', addOrder);
router.post('/update', updateOrder);
router.post('/cancel', cancelOrder);
router.get('/load-category', loadCategories);
router.get('/get-order/:order_id', getOrderWithDelivery);
router.get('/by-date-range', getOrdersWithDeliveriesByDateRange);
router.get('/customer_id/:customerId', getTodayOrdersByCustomerId);
router.post('/upload-image', upload.single('image'), uploadOrderImage); // <-- Corrected endpoint path
router.get('/get-image/:imageName', getOrderImage);
router.post('/order-item', addOrderItem);
router.put('/order-item/:id', editOrderItem);
router.delete('/order-item/:id', deleteOrderItem);
router.get('/order-items/:order_id', getOrderItemsByOrderId);

module.exports = router;
