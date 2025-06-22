import { Router } from "express";
import Stripe from "stripe";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

router.post("/create-checkout-session", verifyJWT, async (req, res) => {
  const { channelId } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Channel Membership",
            description: `Join channel ${channelId}`,
          },
          unit_amount: 10000, // Rs 100 in paise
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${FRONTEND_URL}/payment-success?channelId=${channelId}`,
    cancel_url: `${FRONTEND_URL}/payment-cancel`,
    metadata: {
      userId: String(req.user._id),
      channelId: String(channelId),
    },
  });
  res.json({ url: session.url });
});
export default router;