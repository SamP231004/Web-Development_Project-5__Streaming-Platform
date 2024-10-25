import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.use(verifyJWT, upload.none()); 

router.route("/:videoId").get(getVideoComments).post(addComment);

router.route("/channel/:commentId").delete(deleteComment).patch(updateComment);

export default router;