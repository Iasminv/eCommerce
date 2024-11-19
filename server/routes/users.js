import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js';
import PasswordValidator from 'password-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Create a schema
const schema = new PasswordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 2 digits

// Sign Up
router.post('/signup', async (req,res) => {
  // get user inputs
  const { email, password, firstName, lastName } = req.body;

  // validate the inputs (to-do: validate email, enforce password policy)
  if(!email || !password || !firstName || !lastName) {
    return res.status(400).send('Missing required fields');
  }

    // check if the password meets the policy
    const passwordValidationErrors = schema.validate(password, { list: true });
    if (passwordValidationErrors.length > 0) {
      return res.status(400).send({
        error: 'Password does not meet the required policy',
        issues: passwordValidationErrors, // List of failed rules
      });
    }

  // check for existing user
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email,
    }
  });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  // hash (encrypt) the password
  const hashedPassword = await hashPassword(password);

  // add user to database
  const user = await prisma.customer.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword
    },
  });

  // send a response
  res.json({'user' : email});
});

// Login Functionality
router.post('/login', async (req,res) => {
  // get user inputs
  const { email, password } = req.body;

  // validate the inputs
  if(!email || !password) {
    return res.status(400).send('Missing required fields');
  }

  // find user in database
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email,
    }
  });
  if (!existingUser) {
    return res.status(404).send('User not found');
  }

  // compare/verify the password entered
  const passwordMatch = await comparePassword(password, existingUser.password);
  if (!passwordMatch) {
    return res.status(401).send('Invalid password');
  }

  // setup user session data
  req.session.customer_id = existingUser.id;
  req.session.email = existingUser.email;
  req.session.first_name = existingUser.firstName;
  req.session.last_name = existingUser.lastName;
  console.log('logged in user: ' + req.session.email);

  // send response
  res.send('Login successful');
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    // Successful logout
    res.send('Successful logout');
  });
});



router.get('/session', (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.status(401).send('Not logged in');
  }

  res.json({
    user_id: req.session.user_id,
    email: req.session.email,
    first_name: req.session.first_name,
    last_name: req.session.last_name,
  });
});


export default router;