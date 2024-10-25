import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const totalSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: null,
                subscribersCount: { $sum: 1 },
            },
        },
    ]);

    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $project: {
                totalLikes: { $size: "$likes" },
                totalViews: "$views",
                totalVideos: 1,
            },
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: "$totalLikes" },
                totalViews: { $sum: "$totalViews" },
                totalVideos: { $sum: 1 },
            },
        },
    ]);

    const channelStats = {
        totalSubscribers: totalSubscribers[0]?.subscribersCount || 0,
        totalLikes: videoStats[0]?.totalLikes || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalVideos: videoStats[0]?.totalVideos || 0,
    };

    return res
        .status(200)
        .json(new apiResponse(200, channelStats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                _id: 1,
                "videoFile.url": 1,
                "thumbnail.url": 1,
                title: 1,
                description: 1,
                createdAt: {
                    date: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    time: {
                        hour: { $hour: "$createdAt" },
                        minute: { $minute: "$createdAt" },
                        second: { $second: "$createdAt" },
                    },
                },
                isPublished: 1,
                likesCount: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(new apiResponse(200, videos, "Channel videos fetched successfully"));
});


export { getChannelStats, getChannelVideos };