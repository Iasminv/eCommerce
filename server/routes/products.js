// Products API

import express from 'express'; // framework for web server
import { PrismaClient } from '@prisma/client'; // unify data to an API

// Create a new router
const router = express.Router();

// Initializing prisma
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Checks if the API is working
router.get('/', async (req, res) => {
    res.send('Products route');
});

// Read

// Get all productss
router.get('/all', async (req, res) => {
    const productss = await prisma.product.findMany();

    res.json(productss);
});


// Get products by ID
router.get('/get/:id', async (req, res) => {
    const id = req.params.id; // Get the products ID

    // Find the products
    const products = await prisma.product.findUnique({
        where: {
            id: parseInt(id),
        },
    });

    if (!products) {
        // products is not found
        return res.status(404).json({ error: "Product not found" });
    }

    res.json(products);
});

// Purchase router
router.post('/purchase', async (req, res) => {
    const { productId, customerId } = req.body;

    if (!productId || !customerId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Create a purchase record (assuming a Purchase model exists in the schema)
        const purchase = await prisma.purchase.create({
            data: {
                productId: parseInt(productId),
                customerId: parseInt(customerId),
                purchaseDate: new Date(),
            },
        });

        res.json({ success: true, purchase });
    } catch (error) {
        res.status(500).json({ error: "Error processing the purchase" });
    }
});



export default router;
