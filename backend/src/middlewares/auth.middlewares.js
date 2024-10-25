import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    // Extracting token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // Check if the token is present
    if (!token) {
        return next(new apiError(401, "Unauthorized request: Access token not found"));
    }

    try {
        // Verify the token using the secret
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user in the database
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Check if user exists
        if (!user) {
            return next(new apiError(401, "Invalid Access Token: User not found"));
        }

        // Attach user info to request
        req.user = user;
        next();  // Proceed to the next middleware or route handler
    } 
    catch (error) {
        // Handle any errors during token verification or user lookup
        return next(new apiError(401, error?.message || "Invalid access token"));
    }
});
