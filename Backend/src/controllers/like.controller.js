import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
// Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id // assuming user is added to req in auth middleware

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    // Check if like already exists
    const existingLike = await Like.findOne({ user: userId, video: videoId })

    if (existingLike) {
        await existingLike.deleteOne()
        return res.json(new ApiResponse(200, { liked: false }, "Video unliked"))
    } else {
        await Like.create({ user: userId, video: videoId })
        return res.json(new ApiResponse(200, { liked: true }, "Video liked"))
    }
})

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId")
    }

    const existingLike = await Like.findOne({ user: userId, comment: commentId })

    if (existingLike) {
        await existingLike.deleteOne()
        return res.json(new ApiResponse(200, { liked: false }, "Comment unliked"))
    } else {
        await Like.create({ user: userId, comment: commentId })
        return res.json(new ApiResponse(200, { liked: true }, "Comment liked"))
    }
})

// Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId")
    }

    const existingLike = await Like.findOne({ user: userId, tweet: tweetId })

    if (existingLike) {
        await existingLike.deleteOne()
        return res.json(new ApiResponse(200, { liked: false }, "Tweet unliked"))
    } else {
        await Like.create({ user: userId, tweet: tweetId })
        return res.json(new ApiResponse(200, { liked: true }, "Tweet liked"))
    }
})

// Get all videos liked by the logged-in user
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    // Find all likes for videos by this user
    const likes = await Like.find({ user: userId, video: { $exists: true, $ne: null } }).populate("video")

    const videos = likes.map(like => like.video)
    res.json(new ApiResponse(200, videos, "Liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}