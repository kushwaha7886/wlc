import mongoose,{ Schema } from 'mongoose';

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    tracks: [{
        type: Schema.Types.ObjectId,
        ref: 'Track'
    }],
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },


}, {
    timestamps: true
});
const Playlist = mongoose.model('Playlist', PlaylistSchema);
export default Playlist;