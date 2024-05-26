import express from 'express';
import { getQuestion, checkAnswer } from '../controller/Questions/Question';
const router = express.Router();

router.get("/get-questions/:domain", getQuestion);
router.post("/check-answer", checkAnswer);
export { router as QuestionRouter };
