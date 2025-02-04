const { Sequelize } = require("sequelize");
const bcrypt = require('bcrypt');
const Driver = require('../models/driver');
const Route = require("../models/route");

async function addDriver(req, res, next) {
    try {
      // Extract driver data from request body
      const { bike_no, phone_no, name, password, profile_pic, gender, vehicle_type } = req.body;
  
      // Check if a driver with the provided phone number already exists
      const existingDriver = await Driver.findOne({ where: { phone_no } });
      if (existingDriver) {
        return res.status(400).json({ message: 'Driver with this phone number already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new driver record in the database
      const driver = await Driver.create({
        bike_no,
        phone_no,
        name,
        password: hashedPassword,
        profile_pic,
        gender,
        vehicle_type
      });
  
      // Return success response
      res.status(201).json({ message: 'Driver added successfully', driver });
    } catch (error) {
      // If an error occurs, pass it to the error handler middleware
      next(error);
    }
  }

  async function driverLogin(req, res, next) {
    try {
      const { phone_no, password } = req.body;
  
      // Find the driver by phone number
      const driver = await Driver.findOne({ where: { phone_no } });
  
      // If driver is not found, return an error
      if (!driver) {
        return res.status(401).json({ message: 'Invalid phone number or password' });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, driver.password);
  
      // If passwords do not match, return an error
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid phone number or password' });
      }
  
      // Return the driver details
      res.status(200).json({ message: 'Login successful', driver });
    } catch (error) {
      // If an error occurs, pass it to the error handler middleware
      next(error);
    }
  }

  async function editDriver(req, res, next) {
    try {
        const { driverId, newData } = req.body;

        // Find the driver by ID
        const driver = await Driver.findByPk(driverId);

        // If driver is not found, return an error
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Update driver information
        await driver.update(newData);

        // Fetch the updated driver record
        const updatedDriver = await Driver.findByPk(driverId);

        // Return the updated driver object
        res.status(200).json({ message: 'Driver updated successfully', driver: updatedDriver });
    } catch (error) {
        // If an error occurs, pass it to the error handler middleware
        next(error);
    }
}

  async function getDriverById(req, res, next) {
    try {
        const { driverId } = req.params;

        // Find the driver by ID
        const driver = await Driver.findByPk(driverId);

        // If driver is not found, return an error
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json({ driver });
    } catch (error) {
        next(error);
    }
}

async function getAllDrivers(req, res, next) {
  try {
      // Retrieve all drivers
      const drivers = await Driver.findAll();

      res.json({ drivers });
  } catch (error) {
      next(error);
  }
}


// Method to get a route by its ID
async function getRouteById(req, res, next) {
  try {
    const { routeId } = req.params;

    // Find the route by ID
    const route = await Route.findByPk(routeId);

    // If route is not found, return an error
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Return the route object
    res.status(200).json({ route });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

// Method to get all routes
async function getAllRoutes(req, res, next) {
  try {
    // Find all routes
    const routes = await Route.findAll();

    // Return the array of routes
    res.status(200).json({ routes });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

// Method to edit a route
async function editRoute(req, res, next) {
  try {
    const { routeId } = req.params;
    const newData = req.body;

    // Find the route by ID
    const route = await Route.findByPk(routeId);

    // If route is not found, return an error
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Update route information
    await route.update(newData);

    // Fetch the updated route record
    const updatedRoute = await Route.findByPk(routeId);

    // Return the updated route object
    res.status(200).json({ message: 'Route updated successfully', route: updatedRoute });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}


  
  module.exports = { addDriver, driverLogin, getDriverById, getAllDrivers, editDriver, getRouteById, getAllRoutes, editRoute };
