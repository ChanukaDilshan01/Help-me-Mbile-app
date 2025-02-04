const Route = require('../models/route');
const Branch = require('../models/branch');
const Delivery = require('../models/delivery');
const Order = require('../models/orders');
const OrderHasAmount = require("../models/orderHasAmount");
const {Op} = require("sequelize");

async function addRoute(req, res, next) {
  try {
    const { start_loc_name, destination_loc_name, time } = req.body;

    // Create a new route record in the database
    const route = await Route.create({
      start_loc_name,
      destination_loc_name,
      time
    });

    // Return the newly created route
    res.status(201).json({ message: 'Route added successfully', route });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function addBranch(req, res, next) {
    try {
      const { branch_name, address, longitude, latitude } = req.body;
  
      // Create a new branch record in the database
      const branch = await Branch.create({
        branch_name,
        address,
        longitude,
        latitude
      });
  
      // Return the newly created branch
      res.status(201).json({ message: 'Branch added successfully', branch });
    } catch (error) {
      // If an error occurs, pass it to the error handler middleware
      next(error);
    }
  }

async function addDelivery(req, res, next) {
    try {
        const { route_id, driver_id, order_id } = req.body;

        // Fetch the order details including payment type and status using the order_id
        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const { amount, payment_type, status } = order;

        // Create a new delivery record in the database
        const delivery = await Delivery.create({
            route_id,
            driver_id,
            order_id,
            status: 'delivery added', // Set delivery status to 'delivery added'
            add_date: new Date() // Set the current date as the add date
        });

        // Update or create the corresponding record in the order_has_amount table
        let orderHasAmount = await OrderHasAmount.findOne({ where: { order_order_id: order_id } });

        if (!orderHasAmount) {
            // Create a new record if it doesn't exist
            orderHasAmount = await OrderHasAmount.create({
                order_order_id: order_id,
                amount,
                payment_type,
                status: 'delivery added', // Set order_has_amount status to 'delivery added'
                add_date: new Date(),
                complete_date: null // Assuming the complete date is initially null
            });
        } else {
            // Update the existing record
            orderHasAmount.amount = amount;
            orderHasAmount.payment_type = payment_type;
            orderHasAmount.status = 'delivery added'; // Set order_has_amount status to 'delivery added'
            orderHasAmount.add_date = new Date();
            await orderHasAmount.save();
        }

        // Update the status of the order to 'delivery added'
        order.status = 'delivery added';
        await order.save();

        const io = req.app.get('io');
        io.emit('new-delivery', delivery);
        io.emit('updated-order', updatedOrder);

        // Return the newly created delivery
        res.status(201).json({ message: 'Delivery added successfully', delivery });
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

async function updateDelivery(req, res, next) {
    try {
        const { delivery_id, status, complete_date, order_id, payment_type, payment_status } = req.body;

        // Find the delivery record by ID
        const delivery = await Delivery.findByPk(delivery_id);

        // If delivery is not found, return an error
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Update the delivery status and complete date
        delivery.status = status;
        delivery.complete_date = complete_date;

        // If order ID is provided, update order details
        if (order_id) {
            const order = await Order.findByPk(order_id);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Update order status, payment type, and payment status
            order.status = status;
            order.payment_type = payment_type;
            order.payment_status = payment_status;

            // Save the changes to the order record
            await order.save();

            // Emit event with the updated order data
            const io = req.app.get('io');
            io.emit('updated-order', order);
        }

        // Save the changes to the delivery record
        await delivery.save();

        // Emit event with the updated delivery data
        const io = req.app.get('io');
        io.emit('updated-delivery', delivery);

        // Return a success message
        res.status(200).json({ message: 'Delivery updated successfully', delivery });
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

async function updateDriverLocation(req, res, next) {
    try {
        const { delivery_id, longitude, latitude } = req.body;
        const io = req.app.get('io');

        // Find the delivery by ID
        const delivery = await Delivery.findByPk(delivery_id);

        // If delivery is not found, return an error
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Update the delivery's longitude and latitude
        delivery.driver_longitude = longitude;
        delivery.driver_latitude = latitude;

        // If the delivery status is not 'active', update it to 'active'
        if (delivery.status !== 'location-active') {
            delivery.status = 'location-active';
        }

        // Save the changes to the delivery record
        await delivery.save();

        // Emit the updated location to WebSocket clients subscribed to this delivery
        io.emit(`delivery-${delivery_id}-location-update`, { longitude, latitude });

        // Return a success message
        res.status(200).json({ message: 'Driver location updated successfully' });
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

async function getDeliveryByOrderId(req, res, next) {
    try {
        const { orderId } = req.params;

        // Query delivery using the provided order ID
        const delivery = await Delivery.findOne({
            where: { order_id: orderId }
        });

        // If no delivery is found, return a 404 error
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found for the provided order ID' });
        }

        res.json({ delivery });
    } catch (error) {
        next(error);
    }
}

async function getDeliveriesByVehicleId(req, res, next) {
    try {
        const { driverId } = req.params;

        // Get today's date
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Find deliveries for the given vehicle ID within today's date range
        const deliveries = await Delivery.findAll({
            where: {
                driver_id: driverId,
                add_date: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        res.json({ deliveries });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addRoute,
    addBranch,
    addDelivery,
    updateDriverLocation,
    updateDelivery,
    getDeliveryByOrderId,
    getDeliveriesByVehicleId
};
