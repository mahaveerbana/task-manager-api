const User = require('../models/User'); // Your User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'User already exists'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '24d' });

    return res.status(201).json({
      status: 'SUCCESS',
      message: 'User registered successfully',
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 'FAILED',
      errorMessage: 'Someting went wrong.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: 'FAILED',
        errorMessage: 'User not found. Kindly signup.'
      });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 'FAILED',
        errorMessage: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24d' });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Login successful',
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 'FAILED',
      errorMessage: 'Someting went wrong.'
    });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const { email, name, id } = req.user;

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        name,
        googleId: id, 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24d' });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Login successful',
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 'FAILED',
      errorMessage: 'Someting went wrong.'
    });
  }
};
