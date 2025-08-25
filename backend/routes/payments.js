const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const Payment = require('../models/Payment');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Public
router.post('/create-order', asyncHandler(async (req, res) => {
  const { amount = 500, currency = 'USD', customerName, customerEmail, message } = req.body;

  // Validate required fields
  if (!customerName || !customerEmail) {
    return res.status(400).json({
      success: false,
      message: 'Customer name and email are required'
    });
  }

  // Create Razorpay order
  const options = {
    amount: amount, // amount in cents
    currency: currency,
    receipt: `coffee_${Date.now()}`,
    notes: {
      customerName,
      customerEmail,
      message: message || 'Buy me a coffee! ☕'
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
}));

// @desc    Verify payment and save to database
// @route   POST /api/payments/verify
// @access  Public
router.post('/verify', asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, customerName, customerEmail, message } = req.body;

  // Verify payment signature
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment signature'
    });
  }

  // Check if payment already exists
  const existingPayment = await Payment.findOne({ razorpayPaymentId });
  if (existingPayment) {
    return res.status(400).json({
      success: false,
      message: 'Payment already processed'
    });
  }

  // Save payment to database
  const payment = await Payment.create({
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    amount: 500, // $5.00
    currency: 'USD',
    status: 'completed',
    customerName,
    customerEmail,
    message: message || 'Buy me a coffee! ☕',
    metadata: {
      source: 'website',
      type: 'coffee_purchase'
    }
  });

  res.status(200).json({
    success: true,
    message: 'Payment verified and saved successfully',
    payment: {
      id: payment._id,
      amount: payment.formattedAmount,
      status: payment.status,
      customerName: payment.customerName
    }
  });
}));

// @desc    Get all payments (for admin dashboard)
// @route   GET /api/payments
// @access  Private (Admin only)
router.get('/', asyncHandler(async (req, res) => {
  const payments = await Payment.find({})
    .sort({ createdAt: -1 })
    .select('-razorpaySignature');

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCoffee = payments.filter(p => p.status === 'completed').length;

  res.status(200).json({
    success: true,
    count: payments.length,
    totalAmount: `$${(totalAmount / 100).toFixed(2)}`,
    totalCoffee,
    payments
  });
}));

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Public
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Payment.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalPayments: { $sum: 1 },
        completedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ]);

  const result = stats[0] || { totalAmount: 0, totalPayments: 0, completedPayments: 0 };

  res.status(200).json({
    success: true,
    stats: {
      totalAmount: `$${(result.totalAmount / 100).toFixed(2)}`,
      totalPayments: result.totalPayments,
      completedPayments: result.completedPayments,
      totalCoffee: result.completedPayments
    }
  });
}));

module.exports = router;
