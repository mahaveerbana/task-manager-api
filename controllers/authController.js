const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

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
      password: hashedPassword,
      name: firstName ? firstName + " " + lastName : null
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

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body; 

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if the user already exists
    let user = await User.findOne({ where: { email } });
    if (!user) {
      // Create a new user if they don't exist
      user = await User.create({
        email,
        name,
        googleId,
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24d' });

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Login successful',
      token: jwtToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 'FAILED',
      errorMessage: 'Something went wrong.',
    });
  }
};
