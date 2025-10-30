import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        index: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    }
    ,email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,  
    },
    updatedat: {
        type: Date,
        default: Date.now,
    },
    avtar: {
        type: String,/// cloudinary url
        required: true,  
    },
    refreshToken: {
        type: String,  
    }, 
    watchHistory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Video',
        default: [],
    }

    }
    ,{ timestamps: true });

// Hash password before saving  
userSchema.pre("save", async function (next) { 
if (!this.isModified('password')) return next(); 
this.password = await bcrypt.hash(this.password, 10)    
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.genrateAccessToken = function () {
    return jwt.sign(
        {
         _id: this._id,
         username: this.username,
         email: this.email,
         fullname: this.fullname
        }
         ,process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    );
}

userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, username: this.username },  
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}   

// Method to generate JWT
userSchema.methods.generateJWT = function () {
    return jwt.sign(    
        { id: this._id, username: this.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }  
    );
}



const User = mongoose.model('User', userSchema);
export default User;
export { User };

   