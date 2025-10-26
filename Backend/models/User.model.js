import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,},
    fullname: {
        type: String,
        required: true,}
    ,email: {
        type: String,
        required: true,
        unique: true,},
    password: {
        type: String,
        required: true,},
    createdAt: {
        type: Date,
        default: Date.now,  
    },
    updatedat: {
        type: Date,
        default: Date.now,
    },
    avtar: {
        type: String,
        default: '',  
    },refreshToken: {
        type: String,  
    },

    });

const User = mongoose.model('User', userSchema);    