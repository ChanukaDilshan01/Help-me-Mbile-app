const Category = require('../models/itemCategory');
const Order = require('../models/orders');
const Delivery = require('../models/delivery');
const {Op} = require('sequelize');
const {col} = require("../config/database");
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const OrderItems = require('../models/orderItems');

const uploadDir = 'public/images/orders';

async function addCategory(req, res, next) {
    try {
        const {cat_name} = req.body;

        // Check if category name already exists
        const existingCategory = await Category.findOne({where: {cat_name}});
        if (existingCategory) {
            return res.status(400).json({message: 'Category already exists'});
        }

        // Create the category
        const category = await Category.create({cat_name});

        res.status(201).json({message: 'Category added successfully', category});
    } catch (error) {
        next(error);
    }
}

async function loadCategories(req, res, next) {
    try {
        // Fetch all categories
        const categories = await Category.findAll();

        res.status(200).json({categories});
    } catch (error) {
        next(error);
    }
}

async function addOrder(req, res, next) {
    try {
        const {
            date,
            item_details,
            input_type,
            category_id,
            customer_id,
            mobile_no,
            destination_address,
            destination_longitude,
            destination_latitude,
            status,
            delivery_id,
            payment_type,
            amount,
            payment_status,
            complete_time,
            details_pic
        } = req.body;

        // Create the order in the database
        const order = await Order.create({
            date,
            item_details,
            input_type,
            category_id,
            customer_id,
            mobile_no,
            destination_address,
            destination_longitude,
            destination_latitude,
            status,
            delivery_id,
            payment_type,
            amount,
            payment_status,
            complete_time,
            details_pic
        });

        // Emit event with the new order data
        const io = req.app.get('io');
        io.emit('new-order', order);

        res.status(201).json({message: 'Order added successfully', order});
    } catch (error) {
        next(error);
    }
}

async function updateOrder(req, res, next) {
    try {
        const { orderId, newData } = req.body;

        // Find the order by ID
        const order = await Order.findByPk(orderId);

        // If the order is not found, return an error
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order information
        await order.update(newData);

        // Fetch the updated order record
        const updatedOrder = await Order.findByPk(orderId);

        // Emit event with the updated order data
        const io = req.app.get('io');
        io.emit('updated-order', updatedOrder);

        // Return the updated order object
        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

async function getOrderWithDelivery(req, res, next) {
    try {
        const {order_id} = req.params; // Assuming the order ID is passed as a route parameter

        // Find the order by ID
        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        // Find the delivery associated with the order
        const delivery = await Delivery.findOne({where: {order_id}});

        // Return the order and its relevant delivery, or null if there's no delivery
        res.status(200).json({order, delivery: delivery || null});
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

async function getOrdersWithDeliveriesByDateRange(req, res, next) {
    try {
        const {startDate, endDate} = req.query;

        // Parse the start and end dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Query orders within the date range
        const orders = await Order.findAll({
            where: {
                date: {
                    [Op.between]: [start, end],
                },
            },
        });

        // Get order IDs
        const orderIds = orders.map(order => order.order_id);

        // Query deliveries based on the order IDs within the date range
        const deliveries = await Delivery.findAll({
            where: {
                order_id: {
                    [Op.in]: orderIds,
                },
            },
        });

        res.json({orders, deliveries});
    } catch (error) {
        next(error);
    }
}

async function getTodayOrdersByCustomerId(req, res, next) {
    try {
        const {customerId} = req.params;

        // Get today's date
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Query orders for the given customer ID and within today's date range
        const orders = await Order.findAll({
            where: {
                customer_id: customerId,
                date: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
        });

        res.json({orders});
    } catch (error) {
        next(error);
    }
}

async function cancelOrder(req, res, next) {
    try {
        const { orderId } = req.params;
        const { cancelledBy, cancelReason } = req.body;

        // Find the order by ID
        const order = await Order.findByPk(orderId);

        // If order is not found, return a 404 error
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order status to 'cancelled' and set cancel details
        order.status = 'cancelled';
        order.cancelled_by = cancelledBy;
        order.cancel_reason = cancelReason;

        // Save the changes to the order record
        await order.save();

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        next(error);
    }
}

// Controller method to handle order image upload
async function uploadOrderImage(req, res, next) {
    try {
        // Check if there's an uploaded image file
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Extract file information
        const uploadedFile = req.file;
        const originalFileName = uploadedFile.originalname;
        const extension = path.extname(originalFileName);
        const newFileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + extension;

        // Construct new file path
        const oldPath = uploadedFile.path;
        const newPath = path.join(uploadDir, newFileName);

        // Rename the file
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error('Error renaming uploaded file:', err);
                return res.status(500).json({ message: 'Error renaming uploaded file', error: err.message });
            }

            // Construct the image URL
            const imageUrl = req.protocol + '://' + req.get('host') + '/images/orders/' + newFileName;

            res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
}

async function addOrderItem(req, res, next) {
    try {
        const { order_id, item_name, price } = req.body;

        const orderItem = await OrderItems.create({
            order_id,
            item_name,
            price
        });

        res.status(201).json({ message: 'Order item added successfully', orderItem });
    } catch (error) {
        next(error);
    }
}

// Method to edit an order item
async function editOrderItem(req, res, next) {
    try {
        const { id } = req.params;
        const { order_id, item_name, price } = req.body;

        // Find the order item by ID
        const orderItem = await OrderItems.findByPk(id);

        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }

        // Update the order item with new data
        await orderItem.update({
            order_id,
            item_name,
            price
        });

        res.status(200).json({ message: 'Order item updated successfully', orderItem });
    } catch (error) {
        next(error);
    }
}

// Method to delete an order item
async function deleteOrderItem(req, res, next) {
    try {
        const { id } = req.params;

        // Find the order item by ID
        const orderItem = await OrderItems.findByPk(id);

        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }

        // Delete the order item
        await orderItem.destroy();

        res.status(200).json({ message: 'Order item deleted successfully' });
    } catch (error) {
        next(error);
    }
}

async function getOrderItemsByOrderId(req, res, next) {
    try {
        const { order_id } = req.params;

        // Find order items by order ID
        const orderItems = await OrderItems.findAll({ where: { order_id } });

        if (!orderItems) {
            return res.status(404).json({ message: 'Order items not found' });
        }

        res.status(200).json({ orderItems });
    } catch (error) {
        next(error);
    }
}

function getOrderImage(req, res, next) {
    try {
        const imageName = req.params.imageName;
        const imagePath = path.join(__dirname, '../public/images/orders/', imageName);

        // Check if the file exists
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Serve the image file
        res.sendFile(imagePath);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addCategory,
    loadCategories,
    addOrder,
    updateOrder,
    getOrderWithDelivery,
    getOrdersWithDeliveriesByDateRange,
    getTodayOrdersByCustomerId,
    cancelOrder,
    uploadOrderImage,
    getOrderImage,
    addOrderItem,
    editOrderItem,
    deleteOrderItem,
    getOrderItemsByOrderId
};
