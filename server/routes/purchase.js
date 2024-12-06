import express from 'express'; 
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

router.post('/purchase', async (req, res) => {
    if (!req.session || !req.session.customer_id) {
        return res.status(401).send('User is not logged in');
    }

    const { street, city, province, country, postal_code, credit_card, credit_expire, credit_cvv, cart } = req.body;

    if (!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart) {
        return res.status(400).send('Missing required fields');
    }

    try {
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
                order_date: new Date(),
            },
        });

        const productIds = cart.split(',').map(id => parseInt(id.trim(), 10));
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

        res.status(201).json({
            message: 'Purchase completed successfully',
            purchase_id: purchase.purchase_id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while completing the purchase');
    }
});

export default router;
