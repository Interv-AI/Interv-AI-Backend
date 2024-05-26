import mongoose from "mongoose";

interface IFeedback {
    id: string,
    domain: string,
    question: string,
    question_id: number,
    user_answer: string,
    feedback: string,
    target_answer: string,
    createdAt: string;
    updatedAt: string;
}

interface ICreateFeedback extends Omit<IFeedback, "id" | "createdAt" | "updatedAt"> { }

const feedbackSchema = new mongoose.Schema<IFeedback>({
    domain: { type: String, required: true },
    question: { type: String, required: true },
    question_id: { type: Number, required: true },
    user_answer: { type: String, required: true },
    feedback: { type: String, required: true },
    target_answer: { type: String, required: true },
})

const feedbackModel = mongoose.model("feedback", feedbackSchema, "feedbackDB");

export { feedbackModel, ICreateFeedback };