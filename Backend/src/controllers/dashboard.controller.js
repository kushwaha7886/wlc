import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user._id;

    // Aggregate stats
    const stats = await Video.aggregate([
        {
            $match: {
                uploadedBy: userId
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "uploadedBy",
                foreignField: "Channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }, // Assuming views field exists
                totalSubscribers: { $first: { $size: "$subscribers" } },
                totalLikes: { $sum: { $size: "$likes" } }
            }
        }
    ]);

    if (!stats.length) {
        return res.status(200).json(new ApiResponse(200, {
            totalVideos: 0,
            totalViews: 0,
            totalSubscribers: 0,
            totalLikes: 0
        }, "Channel stats fetched successfully"));
    }

    return res.status(200).json(new ApiResponse(200, stats[0], "Channel stats fetched successfully"));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // Get all the videos uploaded by the channel
    const userId = req.user._id;

    const videos = await Video.find({ uploadedBy: userId }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
})

export {
    getChannelStats, 
    getChannelVideos
    }

    