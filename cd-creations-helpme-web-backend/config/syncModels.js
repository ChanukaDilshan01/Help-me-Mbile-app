// syncModels.js
const sequelize = require('./database'); // assuming your Sequelize instance is configured in a separate file
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

async function syncModels() {
  try {
    // Get a list of all model files in the models directory
    const modelFiles = fs.readdirSync(path.join(__dirname, '../models'));

    // Iterate over each model file
    for (const file of modelFiles) {
      // Import the model
      const model = require(path.join(__dirname, '../models', file));
      
      // Check if the model is defined
      if (typeof model === 'function' && model.name !== 'Sequelize') {
        // If it's a valid model, sync it with the database
        await model.sync();
        console.log(`${model.name} synchronized`);
      }
    }

    console.log('All models synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
}

async function adminLogin(req, res, next) {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;

    // Find the admin by username
    const admin = await Admin.findOne({ where: { username } });

    // If admin is not found, return an error
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    // If passwords do not match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token with expiration time of 3 days
    const token = jwt.sign({ admin_id: admin.admin_id }, process.env.JWT_SECRET, { expiresIn: '3d' });

    // Return the token
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

module.exports = syncModels;
