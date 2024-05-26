import { feedbackModel, ICreateFeedback } from "../../models/Feedback/Feedback";
import OpenAI from 'openai';
import dotenv from 'dotenv-flow';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
});

class FeedbackService {
    async createFeedback(feedback: ICreateFeedback) {
        const res = await feedbackModel.create(feedback);
        return res;
    }
    async generateFeedback(question: string, userAnswer: string, targetAnswer: string) {
        try {
            const prompt = `You are the interviewer. Evaluate the following scenario:\n\nQuestion: ${question}\nUser Answer: ${userAnswer}\nTarget Answer: ${targetAnswer}\n\nProvide constructive feedback to the interviewee. Address both correct and incorrect aspects and response should be in one or two line.\nFeedback:`;
            const params = {
                model: "gpt-3.5-turbo-instruct",
                prompt: prompt,
                max_tokens: 50,
            };
            const response = await openai.completions.create(params);
            const generatedFeedback = response.choices[0]?.text.trim();

            return generatedFeedback;
        } catch (error) {
            console.error("Error generating feedback:", error);
            return "Error generating feedback. Please try again.";
        }
    }
}

export default FeedbackService;
