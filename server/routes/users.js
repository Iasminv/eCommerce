import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js';
import PasswordValidator from 'password-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Password validator
const schema = new PasswordValidator();

// Secure Password Policy
schema
.is().min(8)                                    // Minimum length 8
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 number

// Sign Up
router.post('/signup', async (req,res) => {
  // Get user inputs
  const { email, password, firstName, lastName } = req.body;

  // Validate the inputs (to-do: validate email, enforce password policy)
  if(!email || !password || !firstName || !lastName) {
    return res.status(400).send('Missing required fields');
  }

    // Check if the password meets the policy
    const passwordValidationErrors = schema.validate(password, { list: true });
    if (passwordValidationErrors.length > 0) {
      return res.status(400).send({
        error: 'Password does not meet the required policy',
        issues: passwordValidationErrors, // List of failed rules
      });
    }

  // Check for existing user
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email,
    }
  });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  // Hash (encrypt) the password
  const hashedPassword = await hashPassword(password);

  // Add user to database
  const user = await prisma.customer.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword
    },
  });

  // Send a response
  res.json({'user' : email});
});

// Login Functionality
router.post('/login', async (req,res) => {
  // get user inputs
  const { email, password } = req.body;

  // Validate the inputs
  if(!email || !password) {
    return res.status(400).send('Missing required fields');
  }

  // Find user in database
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email,
    }
  });
  if (!existingUser) {
    return res.status(404).send('User not found');
  }

  // Verify the password entered
  const passwordMatch = await comparePassword(password, existingUser.password);
  if (!passwordMatch) {
    return res.status(401).send('Invalid password');
  }

  // Setup user session data
  req.session.customer_id = existingUser.customer_id;
  req.session.email = existingUser.email;
  req.session.first_name = existingUser.first_name;
  req.session.last_name = existingUser.last_name;
  req.session.save((err) => { 
    if (err) { 
      console.error('Failed to save session:', err);
      return res.status(500).send('Failed to save session'); 
    } 
    console.log('Session after login:', req.session); 
    res.status(201).json({message: 'Login successful', customer_id: req.session.customer_id}); 
  });
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    // Successful logout
    res.send('Successful logout');
  });
});

// Get Session Route
router.get('/getSession', (req, res) => {
  if (!req.session || !req.session.customer_id) {
    return res.status(401).send('Not logged in');
  }
  res.json({
    customer_id: req.session.customer_id,
    email: req.session.email,
    first_name: req.session.first_name,
    last_name: req.session.last_name,
  });
  console.log('logged in user: ' + req.session.customer_id);
});


export default router;