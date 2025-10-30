// Add at the top with other imports
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js"; // Make sure you have this util!
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js';
import {user} from '../models/user.model.js';
import {uploadSingleImage} from '../utils/cloudinary.js';
import {apiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateAccessandRefreshToken = async(userId) => {
    try {
        const userDoc = await user.findById(userId);
        if (!userDoc) {
            throw new ApiError(404, 'User not found');
        }
        const accessToken = userDoc.genrateAccessToken();
        const refreshToken = userDoc.genrateRefreshToken();
        userDoc.refreshToken = refreshToken;
        await userDoc.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Token generation failed');
    }
};

const registerUser = asyncHandler(async (req, res) => {});
    

const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, 'Username, email, and password are required');
    }

    const existingUser = await user.findOne({ $or: [{ email }, { username }] });
    if (!existingUser) {
        throw new ApiError(401, 'Invalid username or email');
    }

    const isPasswordValid = await existingUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid password');
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(existingUser._id);

    const loggedInUser = await user.findById(existingUser._id).select('-password -__v -createdAt -updatedAt -watchHistory');

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(new apiResponse(200, { user: loggedInUser, accessToken, refreshToken }, 'Login successful'));
});

const logoutUser = asyncHandler(async (req, res) => {
    await user.findByIdAndUpdate( req.user._id,
        {
        $set: {
             refreshToken: undefined 
            }
         },
         {
             new: true
     }
        )

        const options = {
            http:true,
            secure:true,
        };
    return res
    .status(200)
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(
    new apiResponse(200, 'User logged out successfully')
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Refresh token is required');
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const existingUser = await user.findById(decodedToken._id);
        if (!existingUser || existingUser.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const {accessToken, refreshToken: newRefreshToken} = await generateAccessandRefreshToken(existingUser._id);

        return res
            .status(200)
            .cookie('refreshToken', newRefreshToken, options)
            .cookie('accessToken', accessToken, options)
            .json(new apiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Access token refreshed successfully'));
    } catch (error) {
        throw new ApiError(500, 'Could not refresh access token');
    }
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldpassword, newpassword } = req.body;

    const userDoc = await user.findById(req.user._id);
    const isPasswordCorrect = await userDoc.isPasswordCorrect(oldpassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, 'Old password is incorrect');
    }

    userDoc.password = newpassword;
    await userDoc.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, 'Password changed successfully'));
});

const getcurrentUser = asyncHandler(async (req, res) => {
    const currentUser = await user.findById(req.user._id).select('-password -__v -createdAt -updatedAt -watchHistory');
    return res.status(200).json(new apiResponse(200, { user: currentUser }, 'Current user fetched successfully'));
});

const updateaccountdetails = asyncHandler(async (req, res) => {
    const {fullname,email} = req.body;
    if (!fullname && !email && !req.file) {
        throw new ApiError(400, 'At least one field (fullname, email, or avatar) is required to update');
    }
    const updatedUser = await user.findByIdAndUpdate(
        req.user?._id,
         {
        $set: {
         fullname: fullname,
            email: email,
            avtar: req.file ? (await uploadSingleImage(req.file)).url : undefined,
             }
         }, 
        { new: true, runValidators: true }).select('-password -__v -createdAt -updatedAt -watchHistory');
        return res.status(200)
              .json(
               new apiResponse(
                200,
                { user: updatedUser },
                'Account details updated successfully'
            )
        );
});

const updateuseravtar = asyncHandler(async (req, res) => {
    const avtarlocalpath = req.file?.path;
    if (!avtarlocalpath) {
        throw new ApiError(400, 'Avatar image file is required');
    }
    const avatar = await uploadSingleImage(avtarlocalpath);
    if (!avatar?.url) {
        throw new ApiError(500, 'Failed to upload avatar image');
    }
    const updatedUser = await user.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avtar: avatar.url,
            },
        },
        { new: true, runValidators: true }
    ).select('-password -__v -createdAt -updatedAt -watchHistory');

    return res.status(200).json(new apiResponse(200, { user: updatedUser }, 'Avatar updated successfully'));
});

const updatercoverimage = asyncHandler(async (req, res) => {
    const coverimagelocalpath = req.file?.path;
    if (!coverimagelocalpath) {
        throw new ApiError(400, 'Cover image file is required');
    }
    const coverimage = await uploadSingleImage(coverimagelocalpath);
    if (!coverimage?.url) {
        throw new ApiError(500, 'Failed to upload cover image');
    }
    const updatedUser = await user.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverimage: coverimage.url,
            },
        },
        { new: true, runValidators: true }
    ).select('-password -__v -createdAt -updatedAt -watchHistory');
    
    return res.status(200).json(new apiResponse(200, { user: updatedUser }, 'Cover image updated successfully'));
});



const getUserProfile = asyncHandler(async (req, res) => {
    
    const {username} = req.params;
    if (!username?.trim) {
        throw new ApiError(400, 'Username parameter is required');
    }
    const channel = await user.aggregate([
        { $match: { username: username?.tolowercase() } },
        { $lookup: { 
            from:"subscriptions"
            , localField: "_id",
            foreignField: "channel",
            as: "subscribers"
        } },
        { $lookup: { 
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribedto "
        }
    },
    { $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscribedtoCount: { $size: "$subscribedto" }
    }
},
{issubscribed:{
    $cond: { 
        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
        then: true,
        else: false 
    }}
},
{ $project: {fullname:1,
    username:1,
    email:1,
    coverimage:1,
    subscriptioncount:1,
    subscriberscount:1,
    issubscribed:1,
    avtar:1,
}}





]);
if (!channel || channel.length === 0) {
    throw new ApiError(404, 'User not found');
}
return res.status(200).json(new apiResponse(200, { channel: channel[0] }, 'User profile fetched successfully'));

})

const getwatchhistory = asyncHandler(async (req, res) => {
    const user = await user.aggregate([
        { $match: { _id:new mongoose.Types.ObjectId(req.user._id) } },
        {
            $lookup: {
                from: 'videos',
                localField: 'watchHistory.video',
                foreignField: '_id',
                as: 'watchHistory',
                pipeline: [{$lookup:{
                    from:'users',
                    localField:'uploadedBy',
                    foreignField:'_id',
                    as:'uploadedBy',
                    pipeline:[{
                        $project:{
                            fullname:1,
                            username:1,
                            avtar:1,
                        }
                    }]
                }
            },{
                $addFields:{
                    owner:{$first:'$uploadedBy'} 
                }
            }]
        }
    },
]);
return res.status(200).json(new apiResponse(200, { watchHistory: user[0].watchHistory }, 'Watch history fetched successfully'));
});

// Forgot Password Controller
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User with this email does not exist");
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token and expiry on user
    user.passwordResetToken = hash;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save({ validateBeforeSave: false });

    // Construct reset URL (adjust domain as needed)
    const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;

    // Send email
    try {
        await sendMail({
            to: user.email,
            subject: "Password Reset",
            text: `You requested a password reset. Click here: ${resetUrl}`,
            html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        });
    } catch (error) {
        // Clear token fields on fail
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ApiError(500, "Error sending password reset email");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset link sent to email")
    );
});

// Reset Password Controller
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params; // From URL
    const { password } = req.body;

    if (!token || !password) {
        throw new ApiError(400, "Token and new password are required");
    }

    const hash = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
        passwordResetToken: hash,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Token is invalid or expired");
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password has been reset successfully")
    );
});




export {forgotPassword,resetPassword,registerUser,loginUser,logoutUser,refreshAccessToken,getwatchhistory,changePassword,getcurrentUser,updateaccountdetails,forgotPassword,resetPassword,updateuseravtar,updatercoverimage,getUserProfile};










// export const loginUser = asyncHandler(async (req, res) => {
//     // Login logic here
//     res.status(200).json({
//         success: true,
//         message: 'User logged in successfully'
//     });
// });


// export const getUserProfile = asyncHandler(async (req, res) => {
//     const userId = req.user.id;
//     // Stub: const userProfile = await getUserProfileService(userId);
//     const userProfile = { id: userId, name: 'Stub User' }; // Stub data
//     res.status(200).json({
//         success: true,
//         data: userProfile
//     });
// });

// export const updateUserProfile = asyncHandler(async (req, res) => {
//     const userId = req.user.id;
//     const updateData = req.body;
//     // Stub: const updatedProfile = await updateUserProfileService(userId, updateData);
//     const updatedProfile = { id: userId, ...updateData }; // Stub data
//     res.status(200).json({
//         success: true,
//         data: updatedProfile
//     });
// });



// export const logoutUser = asyncHandler(async (req, res) => {
//     // Logout logic here
//     res.status(200).json({
//         success: true,
//         message: 'User logged out successfully'
//     });
// });

// export const changePassword = asyncHandler(async (req, res) => {
//     // Change password logic here
//     res.status(200).json({
//         success: true,
//         message: 'Password changed successfully'
//     });
// });

// export const forgotPassword = asyncHandler(async (req, res) => {
//     // Forgot password logic here
//     res.status(200).json({
//         success: true,
//         message: 'Password reset email sent'
//     });
// });

// export const resetPassword = asyncHandler(async (req, res) => {
//     // Reset password logic here
//     res.status(200).json({
//         success: true,
//         message: 'Password reset successfully'
//     });
// });

// // End of recent edits