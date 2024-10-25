import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likes.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid videoId");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200, { isLiked: false }, "Video unliked successfully"));
    }

    await Like.create({
        video: videoId,
        likedBy: req.user?._id,
    });

    return res.status(200).json(new apiResponse(200, { isLiked: true }, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new apiError(400, "Invalid commentId");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200, { isLiked: false }, "Comment unliked successfully"));
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user?._id,
    });

    return res.status(200).json(new apiResponse(200, { isLiked: true }, "Comment liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    try {
        const likedVideosAggregate = await Like.aggregate([
            {
                $match: {
                    likedBy: new mongoose.Types.ObjectId(req.user?._id),
                },
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "likedVideo",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "ownerDetails",
                            },
                        },
                        {
                            $unwind: "$ownerDetails",
                        },
                    ],
                },
            },
            {
                $unwind: "$likedVideo",
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $project: {
                    _id: 0,
                    likedVideo: {
                        _id: 1,
                        "videoFile": 1,
                        "thumbnail": 1,
                        owner: 1,
                        title: 1,
                        description: 1,
                        views: 1,
                        duration: 1,
                        createdAt: 1,
                        isPublished: 1,
                        ownerDetails: {
                            username: 1,
                            fullName: 1,
                            "avatar": 1,
                        },
                    },
                },
            },
        ]);

        return res.status(200).json(
            new apiResponse(200, likedVideosAggregate, "Liked videos fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching liked videos:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Error fetching liked videos",
            success: false,
        });
    }
});

const getLikeCountForVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Find the number of likes for the specific video
        const likeCount = await Like.countDocuments({ video: videoId });

        res.status(200).json({
            statusCode: 200,
            data: { likeCount },
            message: "Success",
            success: true,
        });
    } catch (error) {
        console.error("Error fetching like count:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Error fetching like count",
            success: false,
        });
    }
};

const getUserLikedStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid videoId");
    }

    const existingLike = await Like.exists({
        video: videoId,
        likedBy: req.user?._id,
    });

    return res.status(200).json(new apiResponse(200, { isLiked: !!existingLike }));
});

export { toggleVideoLike, toggleCommentLike, getLikedVideos, getLikeCountForVideo, getUserLikedStatus };
