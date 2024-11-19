// Purchase API
import express from 'express'; // framework for web server
import { PrismaClient } from '@prisma/client'; // unify data to an API

// Create a new router
const router = express.Router();

// Initializing prisma
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

router.post('/purchase') 