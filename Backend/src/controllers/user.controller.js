import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {user} from '../models/user.model.js';
import {uploadSingleImage} from '../utils/cloudinary.js';
import {apiresponse} from '../utils/apiResponse.js';
import {jwt} from 'jsonwebtoken';

const generateAccessandRefreshToken = async(userId) => {
    // Token generation logic here (e.g., using JWT)
    try {
        // Simulating token generation
        const user = await user.findById(userId);
        //  Check if user exists
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        const accessToken = user.genrateAccessToken();
        const refreshToken= user.genrateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
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

const existingUser = await user.findOne({ $or: [ { email }, { username } ] });
if (!existingUser) {
    throw new ApiError(401, 'Invalid username or email');
}

isPasswordValid = await existingUser.isPasswordCorrect(password);
if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
}
 apiresponse(res, 200, true, { message: 'User logged in successfully' }, null, 'Login successful');

 const {accessToken,refreshToken} = await generateAccessandRefreshToken(existingUser._id)
 .then(({ accessToken, refreshToken }) => {
    return apiresponse(res, 200, true, { accessToken, refreshToken }, null, 'Login successful');
})
.catch((error) => {
    throw new ApiError(500, 'Login failed');
});

const loginUser = await user.findById(existingUser._id).select('-password -__v -createdAt -updatedAt -watchHistory');

    const options = {
        http:true,
        secure:true
    }; 
    return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken',accessToken,options)
    .json( new ApiResponse(
            200, 
             {
                user:loginUser, accessToken, refreshToken
            },
        "Login successful" )
    ); 
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
    const incomingRefreshToken = req.cookies.refreshToken|| req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Refresh token is required');
    } 
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        
        const existingUser = await user.findById(decodedToken.userId);
        if (!existingUser || existingUser.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, 'Invalid refresh token');
        }
    options = {
        http:true,
        secure:true,
    };
    
       const {accessToken,newrefreshToken}=await generateAccessandRefreshToken(existingUser._id)
       
        return res
        .status(200)
        .cookie('refreshToken', newrefreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(
            new apiResponse
            ( 200,
            { accessToken, refreshToken:newrefreshToken },
             'Access token refreshed successfully' )
        );
    
        
    } catch (error) { 
    throw new ApiError(500, 'Could not refresh access token');
    }

    
});


    // Verify refresh token and generate new access token logic here
export {registerUser,loginUser,logoutUser,refreshAccessToken};








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