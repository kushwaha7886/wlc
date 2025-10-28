import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/apiError.js';
import { user } from '../models/user.model.js';


export const verifyjwt = asyncHandler(async (req, _, next) => {
 try {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer","")[1];
       if (!token) {
           throw new ApiError(401, 'Access token is missing');
       }
       try {
           const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
           req.user = decoded;
           next();
       } catch (error) {
           throw new ApiError(401, 'Invalid or expired access token');
       } 
   
       
      const decodedToken = (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
       
       const user = await user.findbyId(decodedToken?._id).select('-password -refreshToken') ;
       
       if (!user) {throw new ApiError(404, 'User not found');}
       
       req.user = user;
       next();
 } catch (error) {
    throw new ApiError(500, 'Authentication failed');
    
 }
});

