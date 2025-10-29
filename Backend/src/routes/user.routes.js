import { verifyjwt } from '../middlewares/auth.middleware.js';
import { Router } from 'express';
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, getcurrentUser, updateaccountdetails, forgotPassword, resetPassword, updateuseravtar, updatercoverimage, getUserProfile, getwatchhistory } from '../controllers/user.controller.js';
import { uploadImage } from '../utils/cloudinary.js';


const router = Router();

router.route("/register").post(upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]),registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyjwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyjwt,changePassword);
router.route("/current-user").get(verifyjwt,getcurrentUser);
router.route("/update-account").patch(verifyjwt,updateaccountdetails);
router.route("/update-user-avtar").patch(verifyjwt,uploadImage.single("avatar"),updateuseravtar);
router.route("/update-cover-image").put(verifyjwt,uploadImage.single(coverImage),updatercoverimage);
router.route("/c/:username").get(verifyjwt,getUserProfile);
router.route("/watch-history").get(verifyjwt,getwatchhistory);

export default router;

// router.route("/profile").put(updateUserProfile);
// router.route("/profile").get(getUserProfile);
// router.route("/forgot-password").post(forgotPassword);
// router.route("/reset-password/:token").post(resetPassword);



//secure routes can be added here with middleware for authentication


    


// import {router as expressRouter} from 'express';
// import {router as userRouter} from '../controllers/user.controller.js';
// import {registerUser, loginUser, getUserProfile, updateUserProfile} from '../controllers/user.controller.js';

// const userRouter = expressRouter(); 
// userRouter.post('/register', registerUser);
// userRouter.post('/login', loginUser);
// userRouter.get('/profile', getUserProfile);
// userRouter.put('/profile', updateUserProfile);
// export default userRouter;


// router.post('/register', (req, res) => {
//     // Registration logic here
//     res.status(201).json({  
//         success: true,

//         message: 'User registered successfully'
//     });
// });

// router.post('/login', (req, res) => {
//     // Login logic here
//     res.status(200).json({
//         success: true,
//         message: 'User logged in successfully'
//     });
// });
// router.get('/profile', (req, res) => {
//     // Get user profile logic here
//     res.status(200).json({   

