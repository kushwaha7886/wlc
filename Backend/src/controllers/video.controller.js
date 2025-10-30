import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// Get all videos with pagination, sorting, and search
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    // Building filter
    let filter = {}
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }
    if (userId && isValidObjectId(userId)) {
        filter.owner = userId
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1

    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit))

    const total = await Video.countDocuments(filter)

    return res.status(200).json(
        new ApiResponse(200, { videos, total, page: Number(page), limit: Number(limit) }, "Videos fetched successfully")
    )
})

// Publish a video (upload, create)
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const file = req.file

    if (!file) {
        throw new ApiError(400, "Video file is required")
    }

    const videoUpload = await uploadOnCloudinary(file.path, "video")
    if (!videoUpload || !videoUpload.url) {
        throw new ApiError(500, "Video upload failed")
    }

    const thumbnailUpload = req.body.thumbnail
        ? await uploadOnCloudinary(req.body.thumbnail, "image")
        : null

    const video = await Video.create({
        title,
        description,
        owner: req.user?._id,
        videoUrl: videoUpload.url,
        thumbnail: thumbnailUpload ? thumbnailUpload.url : "",
        isPublished: true,
    })

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    )
})

// Get video by id
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId).populate("owner", "name email")
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

// Update video details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (title) video.title = title
    if (description) video.description = description

    if (req.body.thumbnail) {
        const thumbnailUpload = await uploadOnCloudinary(req.body.thumbnail, "image")
        video.thumbnail = thumbnailUpload ? thumbnailUpload.url : video.thumbnail
    }

    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )
})

// Delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findByIdAndDelete(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Video deleted successfully")
    )
})

// Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"} successfully`)
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}