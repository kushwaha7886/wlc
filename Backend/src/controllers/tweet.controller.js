import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Create a tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    const userId = req.user?._id

    if (!content) {
        throw new ApiError(400, "Tweet content is required")
    }
    if (!isValidObjectId(userId)) {
        throw new ApiError(401, "Invalid user ID")
    }

    const tweet = await Tweet.create({
        content,
        user: userId
    })

    return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"))
})

// Get all tweets of a user
const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const tweets = await Tweet.find({ user: userId }).sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "User tweets fetched successfully"))
})

// Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.id
    const userId = req.user?._id
    const { content } = req.body

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }
    if (!content) {
        throw new ApiError(400, "Tweet content is required")
    }

    const tweet = await Tweet.findOne({ _id: tweetId, user: userId })
    if (!tweet) {
        throw new ApiError(404, "Tweet not found or not authorized")
    }

    tweet.content = content
    await tweet.save()

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"))
})

// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.id
    const userId = req.user?._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    const tweet = await Tweet.findOneAndDelete({ _id: tweetId, user: userId })
    if (!tweet) {
        throw new ApiError(404, "Tweet not found or not authorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}