import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { items, customer, total } = req.body;
    const order = new Order({ items, customer, total });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

export default router;