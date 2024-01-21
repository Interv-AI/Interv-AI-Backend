import express from 'express';
import { checkTokenValid } from '../middleware/Auth';
import { login, resetPassword, RegisterUser } from '../controller/Auth/Auth';

const router = express.Router();

router.post("/login", login);
router.post("/register", RegisterUser)
router.post("/reset-password", checkTokenValid, resetPassword);
export { router as authRouter };
