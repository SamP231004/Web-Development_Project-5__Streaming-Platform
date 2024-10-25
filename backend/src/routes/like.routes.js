import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleVideoLike, getLikeCountForVideo, getUserLikedStatus } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJWT);

router.route("/video/:videoId/like").post(toggleVideoLike);

router.route("/comment/:commentId/like").post(toggleCommentLike);

router.route("/liked-videos").get(getLikedVideos);

router.get('/video/:videoId/like-count', getLikeCountForVideo);

router.get("/video/:videoId/user-liked", getUserLikedStatus);

export default router;