import { Request, Response } from "express";
import { IQuestion } from "../../../models/Questions";
import { ICreateFeedback } from "../../../models/Feedback/Feedback";
import QuestionService from "../../../service/Questions/Questions";
import FeedbackService from "../../../service/Feedback/Feedback";
import { logError } from "../../../logger/logger";
import dotenv from 'dotenv-flow'

dotenv.config()

const THRESHOLD: any = 0.85;
const PARTIAL_CORRECT_THRESHOLD: any = 0.4;


export const getQuestion = async (req: Request, res: Response) => {
    try {
        const domain = req.params.domain;
        if (typeof domain !== "string" || domain === "") {
            res.status(400).send({ code: "questions/invalid domain", message: "Invalid selected domain", status: "Error" });
            return;
        }
        const questionService = new QuestionService();
        const data: IQuestion[] = await questionService.getQuestionByDomain(domain);

        res.send({ status: "Success", data });

    } catch (error: any) {
        logError("An error occured in Question API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
}

export const checkAnswer = async (req: Request, res: Response) => {
    try {
        const userAnswer = req.body.userAnswer;
        const question_id = req.body.question_id;
        if (typeof userAnswer !== "string" || userAnswer === "") {
            res.status(400).send({ code: "questions/invalid-userAnswer", message: "Invalid user answer", status: "Error" });
            return;
        }

        if (!question_id) {
            res.status(400).send({ code: "questions/missing-question_id", message: "Question ID is required", status: "Error" });
            return;
        }

        const questionService = new QuestionService();
        const data: IQuestion[] | null = await questionService.getQuestionById(question_id);

        if (data === null) {
            res.status(404).send({ code: "questions/not-found", message: "Question not found", status: "Error" });
            return;
        }

        const quesss = data[0]?.question;

        const targetAnswer = data[0]?.target_answer;
        const payload = JSON.stringify({ actual_answer: userAnswer, targeted_answer: targetAnswer });
        const ress: any = fetch("http://localhost:5000/calculate_similarity", {
            method: "POST",
            body: payload,
            headers: { "Content-Type": "application/json" }
        })
        const result = ress.similarity_score;
        // const result: any = 0.6;  // Replace this cosine similarity score with the result from the ml model

        console.log(`User answer: ${userAnswer}, Target answer: ${targetAnswer}, Similarity score: ${result}`);

        if (result >= THRESHOLD) {
            await generateAndStoreFeedback(data[0], userAnswer, targetAnswer, "Mostly Correct Answer", res);
        } else if (result >= PARTIAL_CORRECT_THRESHOLD && result < THRESHOLD) {
            await generateAndStoreFeedback(data[0], userAnswer, targetAnswer, "Not completely correct answer", res);
        } else {
            await generateAndStoreFeedback(data[0], userAnswer, targetAnswer, "Incorrect Answer", res);
        }

    } catch (error: any) {
        logError("An error occurred in Question API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occurred" });
    }
}

const generateAndStoreFeedback = async (data: IQuestion, userAnswer: string, targetAnswer: string, status: string, res: Response) => {
    try {
        const feedbackService = new FeedbackService();
        const feedback = await feedbackService.generateFeedback(data.question, userAnswer, targetAnswer);

        const feedbackData: ICreateFeedback = {
            domain: data.domain,
            question:data.question,
            question_id: data.question_id,
            user_answer: userAnswer,
            feedback: feedback ?? "Test",
            target_answer: targetAnswer
        };

        const storedFeedback = await feedbackService.createFeedback(feedbackData);

        if (storedFeedback === null) {
            const errorMessage = "Failed to store feedback in the database";
            console.error(errorMessage);
            res.status(500).send({ code: "server/internal-error", message: errorMessage });
            return;
        }
        res.send({ status: "Success", data: status, feedback: storedFeedback });
    } catch (error) {
        console.error("Error generating and storing feedback:", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occurred" });
    }
}

