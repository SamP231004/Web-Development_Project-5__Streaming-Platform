import { Router } from "express";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJWT);

router
    .route("/channel/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

router.route("/user/:subscriberId").get(getSubscribedChannels);

export default router;