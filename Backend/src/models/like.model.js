import mongoose ,{ Schema } from 'mongoose';

const likeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    video: {
        type:Schema.types.ObjectId,
        ref:'Video'
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:'Tweet'
    },
    likedby:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
},{ timestamps: true }
);
const Like = mongoose.model('Like', likeSchema);

export default Like;

