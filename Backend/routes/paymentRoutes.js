import express from 'express';
import { createOrder, verifyPayment,markAsPaid } from "../controllers/paymentController.js";
import { protect } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();
// 💳 Create Payment (Client)
paymentRouter.post('/create-order', protect, createOrder);
paymentRouter.post('/verify-payment', protect, verifyPayment);

paymentRouter.post('/mark-paid', protect, markAsPaid);


export default paymentRouter;