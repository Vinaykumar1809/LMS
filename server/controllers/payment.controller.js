// payment.controller.js
import dotenv from 'dotenv';
dotenv.config();

import Stripe from "stripe";
import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getPaymentApikey = async (req, res, next) => {
  try {
    res.status(200).json({
      status: true,
      message: 'Stripe API key',
      key: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const buySubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role === "ADMIN") {
      return next(new AppError("Unauthorized or admin cannot subscribe", 403));
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        }
      ],
     success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,

    });

    res.status(200).json({
      success: true,
      message: 'Checkout session created successfully',
      sessionId: session.id,
    });

  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { session_id } = req.query; // 🔁 Changed from body to query

    if (!session_id) {
      return next(new AppError("Session ID missing", 400));
    }

    // 1. Get Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || !session.subscription) {
      return next(new AppError("Session or subscription not found", 404));
    }

    const subscription_id = session.subscription;

    // 2. Get user
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // 3. Get subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscription_id);

    if (subscription.status !== 'active') {
      return next(new AppError("Subscription not active", 400));
    }

    // 4. Save payment info
    await Payment.create({
      payment_id: subscription.latest_invoice,
      subscription_id: subscription.id,
      signature: "stripe-simulated", // still optional
    });

    // 5. Update user's subscription
    user.subscription.id = subscription.id;
    user.subscription.status = 'active';
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully!",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};


const cancelSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role === 'ADMIN') {
      return next(new AppError("Unauthorized", 403));
    }

    const subscriptionId = user.subscription.id;
    if (!subscriptionId) {
      return next(new AppError("No active subscription found", 400));
    }

    let deleted;
    try {
      deleted = await stripe.subscriptions.del(subscriptionId);
    } catch (err) {
      console.warn("Stripe subscription cancel error:", err.message);
    }

    const payment = await Payment.findOne({ subscription_id: subscriptionId });

    if (payment) {
      const refundPeriod = 14 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      const timeSinceSubscribed = now - new Date(payment.createdAt).getTime();

      if (timeSinceSubscribed <= refundPeriod && deleted?.latest_invoice) {
        try {
          const invoice = await stripe.invoices.retrieve(deleted.latest_invoice);
          if (invoice?.payment_intent) {
            await stripe.refunds.create({ payment_intent: invoice.payment_intent });
          }
        } catch (err) {
          console.warn("Refund failed or invoice retrieval failed:", err.message);
        }
      }

      await Payment.deleteOne({ _id: payment._id });
    }

    user.subscription = { id: null, status: null };
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled",
    });

  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};



const allPayments = async (req, res, next) => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
    });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const finalMonths = {
      January: 0, February: 0, March: 0, April: 0,
      May: 0, June: 0, July: 0, August: 0,
      September: 0, October: 0, November: 0, December: 0,
    };

    const monthlyWisePayments = subscriptions.data.map((subscription) => {
      const createdDate = new Date(subscription.created * 1000); // Unix to Date
      return monthNames[createdDate.getMonth()];
    });

    monthlyWisePayments.forEach((month) => {
      if (finalMonths[month] !== undefined) {
        finalMonths[month] += 1;
      }
    });

    const monthlySalesRecord = Object.values(finalMonths);

    res.status(200).json({
      success: true,
      message: "All payments (monthly summary)",
      allPayments: subscriptions.data,
      finalMonths,
      monthlySalesRecord,
    });
  } catch (e) {
    console.error("Error fetching Stripe payments:", e);
    return next(new AppError(e.message, 500));
  }
};

export {
   getPaymentApikey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  allPayments
};
