import { verifyjwt } from '../middlewares/auth.middleware.js';
import { Router } from 'express';
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, getcurrentUser, updateaccountdetails, forgotPassword, resetPassword, updateuseravtar, updatercoverimage } from '../controllers/user.controller.js';


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyjwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);



// router.route("/profile").get(getUserProfile);
// router.route("/profile").put(updateUserProfile);
// router.route("/change-password").post(changePassword);
// router.route("/forgot-password").post(forgotPassword);
// router.route("/reset-password/:token").post(resetPassword);



//secure routes can be added here with middleware for authentication


    

export default router;

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

