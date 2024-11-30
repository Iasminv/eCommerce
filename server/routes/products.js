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
    const id = req.params.id;

    // Validate the ID
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        // Convert the ID to an integer and query
        const product = await prisma.product.findUnique({
            where: {
                product_id: parseInt(id, 10),
            },
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
