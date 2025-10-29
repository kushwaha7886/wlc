import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiError.js';
import { user } from '../models/User.model.js';


export const verifyjwt = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, 'Access token is missing');
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userDoc = await user.findById(decoded?._id).select('-password -refreshToken');
        if (!userDoc) {
            throw new ApiError(404, 'User not found');
        }
        req.user = userDoc;
        next();
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired access token');
    }
});

