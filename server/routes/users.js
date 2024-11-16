import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js'

const router = express.Router();
const prisma = new PrismaClient();


router.post('/signup', async (req,res) => {
  // get user inputs
  const { email, password, firstName, lastName } = req.body;

  // validate the inputs (to-do: validate email, enforce password policy)
  if(!email || !password || !firstName || !lastName) {
    return res.status(400).send('Missing required fields');
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
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
      },
    });

  // send a response
  res.json({'user' : email});
});

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
  req.session.email = existingUser.email;
  req.session.user_id = existingUser.id;
  req.session.name = existingUser.firstName + ' ' + existingUser.lastName;
  console.log('logged in user: ' + req.session.email);

  // send response
  res.send('Login successful');
});

router.post('/logout', (req,res) => {
  req.session.destroy();
  res.send('Successful logout');
});

router.get('/session', (req,res) => {
  // return logged in user  
  res.json({ 'user' : req.session.email});
});

export default router;