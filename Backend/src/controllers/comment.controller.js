import mongoose from 'mongoose';
import Comment from '../models/comment.model.js';
import apierrors from '../utils/api.errors.js';
import asyncHandler from '../utils/async.handler.js';

const getvideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const {page=1, limit=10} = req.query;
    const comments = await Comment.find({ videoId: mongoose.Types.ObjectId(videoId) })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: comments });
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { text } = req.body;
    if (!text) {
        throw new apierrors.BadRequestError('Comment text is required');
    }
    const newComment = new Comment({
        videoId: mongoose.Types.ObjectId(videoId),
        userId: req.user.id,
        text,
    });
    await newComment.save();
    res.status(201).json({ success: true, data: newComment });
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apierrors.NotFoundError('Comment not found');
    }   
    if (comment.userId.toString() !== req.user.id) {
        throw new apierrors.UnauthorizedError('You are not authorized to update this comment');
    }
    comment.text = text || comment.text;
    await comment.save();
    res.status(200).json({ success: true, data: comment });
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apierrors.NotFoundError('Comment not found');
    }   
    if (comment.userId.toString() !== req.user.id) {
        throw new apierrors.UnauthorizedError('You are not authorized to delete this comment');
    }
    await comment.remove();
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
});




export {updateComment,deleteComment, getvideoComments, addComment };