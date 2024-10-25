import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { Comment } from "../models/comment.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likes.models.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  
  const pipeline = [];
  if (query) {
    pipeline.push({
      $search: {
        index: "search-videos",
        text: { query, path: ["title", "description"] }
      }
    });
  }
  if (userId) {
    if (!isValidObjectId(userId)) throw new apiError(400, "Invalid userId");
    pipeline.push({ $match: { owner: new mongoose.Types.ObjectId(userId) } });
  }

  pipeline.push({ $match: { isPublished: true } });
  pipeline.push({
    $sort: sortBy && sortType ? { [sortBy]: sortType === "asc" ? 1 : -1 } : { createdAt: -1 }
  });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "ownerDetails",
      pipeline: [{ $project: { username: 1, "avatar.url": 1 } }]
    }
  }, { $unwind: "$ownerDetails" });

  const videoAggregate = Video.aggregate(pipeline);
  const options = { page: parseInt(page, 10), limit: parseInt(limit, 10) };
  const video = await Video.aggregatePaginate(videoAggregate, options);

  res.status(200).json(new apiResponse(200, video, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Validate required fields
  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json(new apiError(400, "All fields are required"));
  }

  let videoFileLocalPath, thumbnailLocalPath;

  // Ensure video file is provided
  if (
    req.files &&
    req.files.videoFile &&
    Array.isArray(req.files.videoFile) &&
    req.files.videoFile.length > 0
  ) {
    videoFileLocalPath = req.files.videoFile[0].path;
  } else {
    return res.status(400).json(new apiError(400, "Video file is required"));
  }

  // Ensure thumbnail file is provided
  if (
    req.files &&
    req.files.thumbnail &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  } else {
    return res.status(400).json(new apiError(400, "Thumbnail file is required"));
  }

  // Upload video and thumbnail to Cloudinary
  let videoFile, thumbnail;
  try {
    // Upload video file
    videoFile = await uploadOnCloudinary(videoFileLocalPath);
    if (!videoFile) {
      throw new apiError(400, "Video upload failed.");
    }

    // Upload thumbnail file
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
      throw new apiError(400, "Thumbnail upload failed.");
    }
  } catch (error) {
    return res.status(500).json(new apiError(500, "File upload failed: " + error.message));
  }

  // Create video entry in the database
  const video = await Video.create({
      title,
      description,
      duration: videoFile.duration, // Ensure 'duration' exists from Cloudinary response
      videoFile: videoFile.url, // Only the URL string
      thumbnail: thumbnail.url, // Only the URL string
      owner: req.user?._id,
      isPublished: true,
  });


  // Log video details after successful upload
  console.log("Video uploaded successfully with the following details:");
  console.log({
    title: video.title,
    description: video.description,
    videoFileUrl: video.videoFile.url,
    thumbnailUrl: video.thumbnail.url,
    ownerId: video.owner,
  });

  // Respond to the client
  res.status(200).json(new apiResponse(200, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId) || !isValidObjectId(req.user?._id)) throw new apiError(400, "Invalid ID");

  const video = await Video.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
    { $lookup: { from: "likes", localField: "_id", foreignField: "video", as: "likes" } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers"
            }
          },
          {
            $addFields: {
              subscribersCount: { $size: "$subscribers" },
              isSubscribed: { $cond: { if: { $in: [req.user?._id, "$subscribers.subscriber"] }, then: true, else: false } }
            }
          },
          { $project: { username: 1, "avatar.url": 1, subscribersCount: 1, isSubscribed: 1 } }
        ]
      }
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        owner: { $first: "$owner" },
        isLiked: { $cond: { if: { $in: [req.user?._id, "$likes.likedBy"] }, then: true, else: false } }
      }
    },
    { $project: { "videoFile.url": 1, title: 1, description: 1, views: 1, createdAt: 1, duration: 1, comments: 1, owner: 1, likesCount: 1, isLiked: 1 } }
  ]);

  if (!video) throw new apiError(500, "Failed to fetch video");

  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
  await User.findByIdAndUpdate(req.user?._id, { $addToSet: { watchHistory: videoId } });

  res.status(200).json(new apiResponse(200, video[0], "Video details fetched successfully"));
});

const getMyVideo = asyncHandler(async (req, res) => {
  try {
      const ownerId = req.user.id; // Assuming `req.user.id` contains the authenticated user's ID from JWT
      const videos = await Video.find({ owner: ownerId });

      if (!videos || videos.length === 0) {
          return res.status(404).json({
              success: false,
              message: 'No videos found for this user.'
          });
      }

      return res.status(200).json({
          success: true,
          data: videos,
          message: 'Videos fetched successfully'
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message
      });
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { videoId } = req.params;
  if (!isValidObjectId(videoId) || !(title && description)) throw new apiError(400, "Invalid data");

  const video = await Video.findById(videoId);
  if (!video || video.owner.toString() !== req.user?._id.toString()) throw new apiError(400, "Unauthorized");

  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) throw new apiError(400, "Thumbnail is required");

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) throw new apiError(400, "Thumbnail upload failed");

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { title, description, thumbnail: { public_id: thumbnail.public_id, url: thumbnail.url } },
    { new: true }
  );

  res.status(200).json(new apiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new apiError(400, "Invalid videoId");

  const video = await Video.findById(videoId);
  if (!video || video.owner.toString() !== req.user?._id.toString()) throw new apiError(400, "Unauthorized");

  await Video.findByIdAndDelete(videoId);
  await Like.deleteMany({ video: videoId });
  await Comment.deleteMany({ video: videoId });

  res.status(200).json(new apiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new apiError(400, "Invalid videoId");

  const video = await Video.findById(videoId);
  if (!video || video.owner.toString() !== req.user?._id.toString()) throw new apiError(400, "Unauthorized");

  const toggledVideoPublish = await Video.findByIdAndUpdate(
    videoId,
    { isPublished: !video.isPublished },
    { new: true }
  );

  res.status(200).json(new apiResponse(200, { isPublished: toggledVideoPublish.isPublished }, "Publish status toggled successfully"));
});

const getVideoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Validate the video ID
  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid videoId");
  }

  // Find the video by ID
  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  // Respond with the view count
  res.status(200).json(new apiResponse(200, { views: video.views }, "Video views fetched successfully"));
});

const incrementViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Validate the video ID
  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid videoId");
  }

  // Find the video by ID and increment the views
  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } }, // Increment the views by 1
    { new: true } // Return the updated document
  );

  if (!video) {
    throw new apiError(404, "Video not found");
  }

  // Respond with the updated video details
  res.status(200).json(new apiResponse(200, video, "Video views incremented successfully"));
});

export { publishAVideo, updateVideo, deleteVideo, getMyVideo, getAllVideos, getVideoById, togglePublishStatus, getVideoViews, incrementViews };