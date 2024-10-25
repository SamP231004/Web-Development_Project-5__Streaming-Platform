import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteVideo, getAllVideos,  getVideoById, getMyVideo, updateVideo, publishAVideo, togglePublishStatus, getVideoViews, incrementViews} from "../controllers/video.controller.js";

const router = Router();

router
    .route("/")
    .get(getAllVideos)
    .post(
        verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),
        publishAVideo
    );

router
    .route('/my-videos')
    .get(verifyJWT, getMyVideo); 

router
    .route("/video/:videoId")
    .get(verifyJWT, getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

router.get("/:videoId/views", getVideoViews);

router.post('/:videoId/increment-views', incrementViews);

export default router;