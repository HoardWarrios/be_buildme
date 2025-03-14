import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Plan from "../models/plan.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";

// create a payment intent for an order
export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);//  Stripe key

  // find the plan and related gig using the plan ID from request parameters
  const plan = await Plan.findById(req.params.id);//Get plan info from id in params
  const gig = await Gig.findById(plan.gigId);//Get gig info from gigid in plan
  const user = await User.findById(plan.userId);//Get user info from userId in plan
  const builder = await User.findById(gig.userId);//Get user info from userId in gig

  // createStripe payment with the gig price
  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  //Create new order
  const newOrder = new Order({
    gigId: gig._id,
    img: plan.cover,
    title: plan.title,
    buyerId: req.userId,
    buyerName: user.username,
    sellerId: gig.userId,
    sellerName: builder.username,
    price: gig.price,
    planId:plan._id,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();
// return the Stripe client secret so the frontend can proceed with payment
  res.status(200).send({
    clientSecret: paymentIntent.client_secret,//sending payment intent client secret
  });
};

// FUNCTION TO GET ORDERS
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      // If request seller give seller id : else give buyer id
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,// Only return completed orders
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

// FUNCTION FOR SUCCESSFUL PAYMENT
export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,// find order by payment intent
      },
      {
        $set: {
          isCompleted: true,// send confirmation response
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

export const deleteAll = async (req, res) => {
  try {
    const orders = await Order.deleteMany({});

      res.status(200).send("All orders deleted successfully");
    

  } catch (err) {
    next(err);
  }
};