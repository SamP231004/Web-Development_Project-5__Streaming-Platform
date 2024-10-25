import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return{accessToken, refreshToken}
    }
    catch (error) {
        throw new apiError(500, "Something went wrong while generating refresh and access token.")
    }
}

const registerUser = asyncHandler( async (req,res) => {
    // ************************************************************************* //

    // Get user details from frontend
    // Validation - not empty
    // Check if user already exists - username, email
    // Check for images, check for avatar
    // Upload them to cloudinary, avatar
    // Create user object - create antry in Database
    // Remove password and refresh token field from response
    // Check for user creation
    // Return response

    // ************************************************************************* //

    // Get user details from frontend

    const {fullName, email, username, password } = req.body
    // console.log("Email : " , email);

    // ************************************************************************* //

    // Validation - not empty

    // if (fullName == "") {
    //     throw new apiError(400, "FullName is required")
    // }
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required.")
    }

    // ************************************************************************* //

    // Check if user already exists - username, email

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new apiError(409, "User with email or username already exists.")
    }

    // ************************************************************************* //

    // Check for images, check for avatar

    let avatarLocalPath;
    if (
        req.files &&
        req.files.avatar &&
        Array.isArray(req.files.avatar) &&
        req.files.avatar.length > 0
    ) {
        avatarLocalPath = req.files.avatar[0].path;
    } else {
        throw new apiError(400, "Avatar file is required");
    }

    // Ensure cover image file is provided (optional)
    let coverImageLocalPath = null;
    await (async () => {
        if (
            req.files &&
            Array.isArray(req.files.coverImage) &&
            req.files.coverImage.length > 0
        ) {
            coverImageLocalPath = req.files.coverImage[0].path;
        } else {
            coverImageLocalPath = null; // Handle cases where no file was uploaded
        }
    })();


    // ************************************************************************* //

    // Upload them to cloudinary, avatar

    let avatar, coverImage;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            throw new apiError(400, "Avatar upload failed.");
        }
        if (coverImageLocalPath) {
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
        }
    } 
    catch (error) {
        throw new apiError(500, "Image upload failed: " + error.message);
    }
    // ************************************************************************* //

    // Create user object - create antry in Database
    
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    if (!user) {
        throw new apiError(500, "Something went wrong while registering the user.");
    }
    console.log("User Created:", user); 

    // ************************************************************************* //
    
    // Remove password and refresh token field from response

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    console.log("Retrieved User:", createdUser);

    // ************************************************************************* //

    // Check for user creation

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user.")
    }

    // ************************************************************************* //

    // Return response

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully.")
    )

    // ************************************************************************* //
})

const loginUser = asyncHandler(async(req,res) => {
    // ************************************************************************* //

    // Extract Data from Request Body
    // Find User in Database
    // Verify Password
    // Generate Tokens: Access and Refresh Token
    // Send Cookie with Tokens

    // ************************************************************************* //

    // Extract Data from Request Body

    const {email, username, password} = req.body
    if (!(username || email)) {
        throw new apiError(400, "Username or Email is required.")
    }

    // ************************************************************************* //
    
    // Find User in Database
    
    const user = await User.findOne({
        $or: [{username},{email}]
    });
    if(!user) {
        throw new apiError(404, "User does not exist.")
    }

    // ************************************************************************* //

    // Verify Password

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) {
        throw new apiError(401, "Invalid user creditials.")
    }

    // ************************************************************************* //

    // Generate Tokens: Access and Refresh Token

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    // ************************************************************************* //

    // Send Cookie with Tokens

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure: process.env.NODE_ENV === "production", // Set to true in production (HTTPS)
        sameSite: "None",
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json( new apiResponse (200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully."))

    // ************************************************************************* //
})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate (
        req.user._id, {
            $unset: {
                refreshToken : 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully."))
})

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request")
    }

    try {
        const decodedToken =  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = User.findById(decodedToken?._id)
        if (!user) {
            throw new apiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json (new apiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed successfully"))
    }

    catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res) => {
    const { oldPassword, newPassword } = req.body
    
    const user = User.findById(req.user?._id)

    const isPasswordCorrect =  await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new apiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
        .status(200)
        .json(new apiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new apiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { fullName, email }},
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new apiResponse(200, user, "Account details updated successfully"));
})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url) {
        throw new apiError(400, "Error while uploading the avatar")
    }

    const user = await User.findByIdAndUpdate (
        req.user?._id,
        { $set: {avatar: avatar.url}},
        {new: true}
    ).select("-password")

    return res
        .status(200)
        .json(new apiResponse(200, user, "Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new apiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url) {
        throw new apiError(400, "Error while uploading the cover image")
    }

    const user = await User.findByIdAndUpdate (
        req.user?._id,
        { $set: {coverImage: coverImage.url}},
        {new: true}
    ).select("-password")

    return res
        .status(200)
        .json(new apiResponse(200, user, "Cover image updated successfully"))
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params
    if (!username?.trim()) {
        throw new apiError(400, "Username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "subscribers",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in:[ req.user?._id, "subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new apiError(404, "Channel does not exists")
    }

    return res
    .status(200)
    .json(new apiResponse(200, channel[0], "User channel fetched successfully"))
})

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(new apiResponse (200, user[0].watchHistory, "Watch history fetched successfully"))
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory }