import express from 'express';
import { getQuestion, checkAnswer,getALlQuestions } from '../controller/Questions/Question';
const router = express.Router();

router.get("/get-questions/:domain", getQuestion);
router.get("/get-all-questions", getALlQuestions);
router.post("/check-answer", checkAnswer);
export { router as QuestionRouter };
