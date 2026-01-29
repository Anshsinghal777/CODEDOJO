import express from 'express';
import { register, login ,logout , adminRegister} from '../controllers/userAuthent.js';

import userMiddleware from '../middleware/userMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const authRouter = express.Router();



// register


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout',userMiddleware, logout);
authRouter.post('/admin/register',adminMiddleware, adminRegister);
// authRouter.get('/getprofile', getProfile);
// login
// logout
// getProfile

export default authRouter;