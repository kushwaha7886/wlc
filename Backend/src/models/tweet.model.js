import mongoose ,{ Schema } from 'mongoose';

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 280
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    retweets: [{   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }]
}, { timestamps: true });
const Tweet = mongoose.model('Tweet', tweetSchema);

export default Tweet;

