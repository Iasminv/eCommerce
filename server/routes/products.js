// Products API
import express from 'express'; // framework for web server
import { PrismaClient } from '@prisma/client'; // unify data to an API

// Create a new router
const router = express.Router();

// Initializing prisma
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Read

// Get all products
router.get('/all', async (req, res) => {
    const products = await prisma.product.findMany();

    res.json(products);
});


// Get products by ID
router.get('/get/:id', async (req, res) => {
    const id = req.params.id; // Get the products ID

    // Find the products
    const products = await prisma.product.findUnique({
        where: {
            product_id: parseInt(id),
        },
    });

    if (!products) {
        // If product is not found
        return res.status(404).json({ error: "Product not found" });
    }

    res.json(products);
});

export default router;
