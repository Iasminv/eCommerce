// Purchase API
import express from 'express'; // framework for web server
import { PrismaClient } from '@prisma/client'; // unify data to an API

// Create a new router
const router = express.Router();

// Initializing prisma
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Purchase Route
router.post('/purchase', async (req, res) => {
    // Ensure the user is logged in
    if (!req.session || !req.session.customer_id) {
        return res.status(401).send('User is not logged in');
    }

    const {
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire,
        credit_cvv,
        cart,
        invoice_amt,
        invoice_tax,
        invoice_total,
    } = req.body;

    // Validate the input
    if (
        !street ||
        !city ||
        !province ||
        !country ||
        !postal_code ||
        !credit_card ||
        !credit_expire ||
        !credit_cvv ||
        !cart ||
        !invoice_amt ||
        !invoice_tax ||
        !invoice_total
    ) {
        return res.status(400).send('Missing required fields');
    }

    try {
        // Create the Purchase entry
        const purchase = await prisma.purchase.create({
            data: {
                customer_id: req.session.customer_id,
                street,
                city,
                province,
                country,
                postal_code,
                credit_card: parseInt(credit_card, 10),
                credit_expire: parseInt(credit_expire, 10),
                credit_cvv: parseInt(credit_cvv, 10),
                invoice_amt: parseFloat(invoice_amt),
                invoice_tax: parseFloat(invoice_tax),
                invoice_total: parseFloat(invoice_total),
                order_date: Math.floor(Date.now() / 1000), // UNIX timestamp
            },
        });

        // Cart string and create PurchaseItems
        const productIds = cart.split(',').map((id) => parseInt(id.trim(), 10));
        const productCounts = productIds.reduce((acc, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});

        const purchaseItems = Object.entries(productCounts).map(([productId, quantity]) => ({
            purchase_id: purchase.purchase_id,
            product_id: parseInt(productId, 10),
            quantity,
        }));

        await prisma.purchaseItem.createMany({
            data: purchaseItems,
        });

        // Success
        res.status(201).json({
            message: 'Purchase completed successfully',
            purchase_id: purchase.purchase_id,
        });
        // Error
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while completing the purchase');
    }
});

export default router;
