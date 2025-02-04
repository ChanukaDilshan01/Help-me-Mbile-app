const { Sequelize } = require("sequelize");
const Package = require("../models/package");
const Dependent = require('../models/dependent');
const Subscription = require('../models/subscription');

async function addPackage(req, res, next) {
  try {
    // Extract package data from the request body
    const { user_type, name, amount, duration, duration_unit, status } =
      req.body;

    // Create the package record in the database
    const package = await Package.create({
      user_type,
      name,
      amount,
      duration,
      duration_unit,
      status, 
    });

    // Return the newly created package
    res.status(201).json({ message: "Package added successfully", package });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function changePackageStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      // Find the package by ID
      const package = await Package.findByPk(id);
  
      // If package is not found, return an error
      if (!package) {
        return res.status(404).json({ message: 'Package not found' });
      }
  
      // Update the status of the package
      await package.update({ status });
  
      // Return the updated package
      res.status(200).json({ message: 'Package status updated successfully', package });
    } catch (error) {
      // If an error occurs, pass it to the error handler middleware
      next(error);
    }
  }

  // Controller function to add a dependent
async function addDependent(req, res, next) {
    try {
      // Extract dependent data from the request body
      const { otp, user_id, owner_id } = req.body;
  
      // Create the dependent record in the database
      const dependent = await Dependent.create({
        otp,
        user_id,
        owner_id
      });
  
      // Return the newly created dependent
      res.status(201).json({ message: 'Dependent added successfully', dependent });
    } catch (error) {
      // If an error occurs, pass it to the error handler middleware
      next(error);
    }
  }

  // Controller function to add a subscription
  async function addSubscription(req, res, next) {
    try {
      // Extract subscription data from the request body
      const { user_id, package_id, dependent_id } = req.body;
  
      // Check if the user has an active subscription with a future end date
      const existingSubscription = await Subscription.findOne({
        where: {
          user_id,
          status: 'pending',
          end_date: { [Sequelize.Op.gt]: new Date() }
        }
      });
  
      let start_date;
      let end_date;
  
      if (existingSubscription) {
        // Set the start date as the day after the existing subscription's end date
        start_date = new Date(existingSubscription.end_date);
        start_date.setDate(start_date.getDate() + 1);
      } else {
        // If no existing subscription, set start date as today
        start_date = new Date();
      }
  
      // Get package details to calculate end date
      const packageDetails = await Package.findByPk(package_id);
  
      if (!packageDetails) {
        return res.status(404).json({ message: 'Package not found' });
      }
  
      // Calculate end date based on package duration
      const duration = packageDetails.duration;
      const duration_unit = packageDetails.duration_unit;
  
      if (duration_unit === 'days') {
        end_date = new Date(start_date);
        end_date.setDate(end_date.getDate() + duration);
      } else if (duration_unit === 'months') {
        end_date = new Date(start_date);
        end_date.setMonth(end_date.getMonth() + duration);
      } else if (duration_unit === 'years') {
        end_date = new Date(start_date);
        end_date.setFullYear(end_date.getFullYear() + duration);
      }
  
      // Create the subscription record in the database
      const subscription = await Subscription.create({
        user_id,
        package_id,
        dependent_id,
        start_date,
        end_date,
        status: 'pending' // Assuming subscription is active by default
      });
  
      // Return the newly created subscription
      res.status(201).json({ message: 'Subscription added successfully', subscription });
    } catch (error) {
      // If an error occurs, pass it to the error handler middleware
      next(error);
    }
  }

  // Controller function to get subscriptions by user ID
async function getSubscriptionsByUserId(req, res, next) {
    try {
      // Extract user ID from request parameters
      const { userId } = req.params;
  
      // Find subscriptions associated with the user ID
      const subscriptions = await Subscription.findAll({
        where: { user_id: userId }
      });
  
      // If no subscriptions found, return a message
      if (!subscriptions || subscriptions.length === 0) {
        return res.status(404).json({ message: 'No subscriptions found for this user' });
      }
  
      // Return the subscriptions
      res.status(200).json({ subscriptions });
    } catch (error) {
      // If an error occurs, pass it to the error handler middleware
      next(error);
    }
  }

  async function updateSubscriptionStatus(req, res, next) {
    try {
      // Extract subscription ID and new status from request body
      const { subscriptionId, status } = req.body;
  
      // Find the subscription by ID
      const subscription = await Subscription.findByPk(subscriptionId);
  
      // If subscription is not found, return an error
      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }
  
      // Update subscription status
      subscription.status = status;
      await subscription.save();
  
      // Return the updated subscription
      res.status(200).json({ message: 'Subscription status updated successfully', subscription });
    } catch (error) {
      // If an error occurs, pass it to the error handler middleware
      next(error);
    }
  }

// Controller function to edit a package
async function editPackage(req, res, next) {
  try {
    const { id } = req.params;
    const { user_type, name, amount, duration, duration_unit, status } = req.body;

    // Find the package by ID
    let package = await Package.findByPk(id);

    // If package is not found, return an error
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Update the package
    package = await package.update({
      user_type,
      name,
      amount,
      duration,
      duration_unit,
      status
    });

    // Return the updated package
    res.status(200).json({ message: 'Package updated successfully', package });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

// Controller function to get all packages
async function getAllPackages(req, res, next) {
  try {
    // Retrieve all packages from the database
    const packages = await Package.findAll();

    // If no packages found, return a message
    if (!packages || packages.length === 0) {
      return res.status(404).json({ message: 'No packages found' });
    }

    // Return the packages
    res.status(200).json({ packages });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function getAllSubscriptions(req, res, next) {
  try {
    // Retrieve all subscriptions from the database
    const subscriptions = await Subscription.findAll();

    // If no subscriptions found, return a message
    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({ message: 'No subscriptions found' });
    }

    // Return the subscriptions
    res.status(200).json({ subscriptions });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

module.exports = {
  addPackage,
  changePackageStatus,
  addDependent,
  addSubscription,
  getSubscriptionsByUserId,
  updateSubscriptionStatus,
  editPackage,
  getAllPackages,
  getAllSubscriptions
};
