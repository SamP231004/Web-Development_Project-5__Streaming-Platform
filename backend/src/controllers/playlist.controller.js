import { Playlist } from "../models/playlists.models.js";
import { Video } from "../models/video.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new apiError(400, "Name and description both are required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
    });

    if (!playlist) {
        throw new apiError(500, "Failed to create playlist");
    }

    return res
        .status(201)
        .json(new apiResponse(201, playlist, "Playlist created successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const { playlistId } = req.params;

    if (!name || !description) {
        throw new apiError(400, "Name and description both are required");
    }

    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid PlaylistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Only owner can edit the playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $set: {
                name,
                description,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                "Playlist updated successfully"
            )
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid PlaylistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Only owner can delete the playlist");
    }

    await Playlist.findByIdAndDelete(playlist._id);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "Playlist deleted successfully"
            )
        );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid PlaylistId or videoId");
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }
    if (!video) {
        throw new apiError(404, "Video not found");
    }

    // Check ownership for both playlist and video
    if (
        playlist.owner.toString() !== req.user._id.toString()
        // video.owner.toString() !== req.user._id.toString()
    ) {
        throw new apiError(403, "Only owner can add video to their playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $addToSet: {
                videos: videoId,
            },
        },
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new apiError(
            400,
            "Failed to add video to playlist please try again"
        );
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                "Added video to playlist successfully"
            )
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid playlistId or videoId");
    }

    const playlist = await Playlist.findById(playlistId);
    const video = await Video.findById(videoId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }
    if (!video) {
        throw new apiError(404, "Video not found");
    }

    // Check ownership for both playlist and video
    if (
        playlist.owner.toString() !== req.user._id.toString() 
        // video.owner.toString() !== req.user._id.toString()
    ) {
        throw new apiError(
            403,
            "Only owner can remove video from their playlist"
        );
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId,
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                "Removed video from playlist successfully"
            )
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid PlaylistId");
    }

    const playlistVideos = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            },
        },
        {
            // Filter videos array to only published videos
            $addFields: {
                videos: {
                    $filter: {
                        input: "$videos",
                        as: "video",
                        cond: { $eq: ["$$video.isPublished", true] },
                    },
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $addFields: {
                totalVideos: { $size: "$videos" },
                totalViews: { $sum: "$videos.views" },
                owner: { $arrayElemAt: ["$owner", 0] },
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                totalVideos: 1,
                totalViews: 1,
                videos: {
                    $map: {
                        input: "$videos",
                        as: "video",
                        in: {
                            _id: "$$video._id",
                            videoFile: { url: "$$video.videoFile.url" },
                            thumbnail: { url: "$$video.thumbnail.url" },
                            title: "$$video.title",
                            description: "$$video.description",
                            duration: "$$video.duration",
                            createdAt: "$$video.createdAt",
                            views: "$$video.views",
                        },
                    },
                },
                owner: {
                    username: 1,
                    fullName: 1,
                    avatar: { url: 1 },
                },
            },
        },
    ]);

    if (!playlistVideos.length) {
        throw new apiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, playlistVideos[0], "Playlist fetched successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new apiError(400, "Invalid userId");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            },
        },
        {
            $addFields: {
                totalVideos: { $size: "$videos" },
                totalViews: { $sum: "$videos.views" },
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                updatedAt: 1,
                videos: {
                    _id: 1,
                    title: 1,
                    views: 1,
                    duration: 1,
                    thumbnail: 1,
                },
            },
        },
    ]);

    return res
        .status(200)
        .json(new apiResponse(200, playlists, "User playlists fetched successfully"));
});

export { createPlaylist, updatePlaylist, deletePlaylist, addVideoToPlaylist, removeVideoFromPlaylist, getPlaylistById, getUserPlaylists }; 