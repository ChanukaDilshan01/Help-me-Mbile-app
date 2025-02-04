const User = require("../models/users");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const Admin = require('../models/admin');
const axios = require('axios');

// Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Random number between 100000 and 999999
}

// Controller function for user registration
async function registerUser(req, res, next) {
  try {
    // Extract user data from request body
    const { email, phone, name, password, type } = req.body;

    // Check if email or phone number already exists for the given user type
    const existingUser = await User.findOne({
      where: {
        type,
        [Sequelize.Op.or]: [{ email }, { phone }],
      },
    });

    // If email or phone number already exists, return an error
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or phone number already registered" });
    }

    // Generate token (you can use any method to generate tokens)
    const token = Math.random().toString(36).substring(2); // Example token generation using random string

    // Generate random 6-digit OTP
    const otp = generateOTP();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds of 10

    // Create a new user record in the database
    const user = await User.create({
      email,
      phone,
      name,
      password: hashedPassword, // Store hashed password in the database
      type,
      status: 1, // Set status to 1 by default
      token,
      otp,
    });

    // Send a success response
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

// Controller function for sending OTP code to user's email
async function sendRegOTPByEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info.helpmesl@gmail.com",
        pass: "dgcbywovljbkgxsn",
      },
    });

    const mailOptions = {
      from: "info.helpmesl@gmail.com",
      to: email,
      subject: "OTP Code for Verification",
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return "Email sent successfully";
  } catch (error) {
    throw error;
  }
}

// Controller function for sending OTP code to user's email
async function sendOTPByEmail(req, res, next) {
  try {
    const { email, otp } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info.helpmesl@gmail.com",
        pass: "dgcbywovljbkgxsn",
      },
    });

    // Email message configuration
    const mailOptions = {
      from: "info.helpmesl@gmail.com",
      to: email,
      subject: "OTP Code for Verification",
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP code sent to email successfully" });
  } catch (error) {
    next(error);
  }
}

// Controller function for verifying OTP code
async function verifyOTP(req, res, next) {
  try {
    const { identifier, otp } = req.body;

    // Find the user with the provided email or phone number and OTP code
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }],
        otp,
      },
    });

    // If user is not found or OTP code is incorrect, return an error
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // Generate a new OTP code
    const newOTP = generateOTP();

    // Update the OTP code in the database
    await user.update({ otp: newOTP });

    // Send the user's data in the response
    res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { identifier, password } = req.body;

    // Find the user with the provided email or phone number
    const user = await User.findOne({
      where: {
        // Use Sequelize's [Op.or] operator to search by email or phone number
        [Op.or]: [{ email: identifier }, { phone: identifier }],
      },
    });

    // If user is not found, return an error
    if (!user) {
      return res
        .status(400)
        .json({
          message:
            "Invalid email or phone number. Please check your credentials and try again.",
        });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid, return an error
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // If user and password are valid, return the user object
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function getUserByToken(req, res, next) {
  try {
    const { token } = req.body;

    // Find the user with the provided token
    const user = await User.findOne({
      where: {
        token,
      },
    });

    // If user is not found, return an error
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found for the provided token" });
    }

    // If user is found, return the user object
    res.status(200).json({ user });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id, newData } = req.body;

    // Find the current user by ID
    const currentUser = await User.findByPk(id);

    // If user is not found, return an error
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email or phone is provided and is different from the current values
    if ((newData.email && newData.email !== currentUser.email) || (newData.phone && newData.phone !== currentUser.phone)) {
      // Check if the provided email already exists for another user
      if (newData.email) {
        const existingEmailUser = await User.findOne({
          where: {
            email: newData.email
          }
        });
        if (existingEmailUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }
      }

      // Check if the provided phone number already exists for another user
      if (newData.phone) {
        const existingPhoneUser = await User.findOne({
          where: {
            phone: newData.phone
          }
        });
        if (existingPhoneUser) {
          return res.status(400).json({ message: 'Phone number already exists' });
        }
      }
    }

    // If password is provided, encrypt it
    if (newData.password && newData.password !== '') {
      const hashedPassword = await bcrypt.hash(newData.password, 10); // Hash password with salt rounds of 10
      newData.password = hashedPassword;
    }

    // Update user information
    await currentUser.update(newData);

    // Fetch the updated user record
    const updatedUser = await User.findByPk(id);

    // Return the updated user object
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    // Fetch all users from the database
    const allUsers = await User.findAll();

    // Return the array of user objects
    res.status(200).json({ users: allUsers });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function addAdmin(req, res, next) {
  try {
    // Extract admin data from request body
    const { name, type, status, password, profile_pic } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds of 10

    // Create a new admin record in the database
    const newAdmin = await Admin.create({
      name,
      type,
      status,
      password: hashedPassword, // Store hashed password in the database
      profile_pic
    });

    // Return the newly created admin object
    res.status(201).json({ message: 'Admin added successfully', admin: newAdmin });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function adminLogin(req, res, next) {
  try {
    // Extract name and password from request body
    const { name, password } = req.body;

    // Find the admin by name
    const admin = await Admin.findOne({ where: { name } });

    // If admin is not found, return an error
    if (!admin) {
      return res.status(401).json({ message: 'Invalid name or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    // If passwords do not match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid name or password' });
    }

    // Return the admin data
    res.status(200).json({ message: 'Login successful', admin });
  } catch (error) {
    // If an error occurs, pass it to the error handler middleware
    next(error);
  }
}

async function sendOTPByPhone(req, res, next) {
  try {
    const { phone, otp } = req.body;

    // Step 1: Get the token from the login endpoint
    const loginResponse = await axios.post('https://e-sms.dialog.lk/api/v1/login', {
      username: "helpmeslTrans",
      password: "Helpmesl20241@"
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (loginResponse.status !== 200) {
      return res.status(loginResponse.status).json({ message: "Failed to login to SMS API", details: loginResponse.data });
    }

    const token = loginResponse.data.token;

    // Step 2: Generate a unique transaction ID
    const transactionId = Date.now();

    // Step 3: Construct the payload
    const payload = {
      msisdn: [{ mobile: phone }],
      sourceAddress: "Helpmesl",
      message: `Your OTP code is: ${otp}`,
      transaction_id: transactionId,
      payment_method: 0
    };

    // Step 4: Send the OTP request using the token
    const response = await axios.post('https://e-sms.dialog.lk/api/v2/sms', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      res.status(200).json({ message: "OTP code sent to phone successfully" });
    } else {
      res.status(response.status).json({ message: "Failed to send OTP code", details: response.data });
    }
  } catch (error) {
    next(error);
  }
}



module.exports = {
  registerUser,
  sendOTPByEmail,
  verifyOTP,
  loginUser,
  getUserByToken,
  updateUser,
  getAllUsers,
  addAdmin,
  adminLogin,
  sendOTPByPhone
};
