import mongoose, { Schema, Document } from "mongoose";
interface IQuestion extends Document {
    question_id: number,
    domain: string,
    question: string,
    keywords: string,
    target_answer: string,
    difficulty: string
}


const questionSchema: Schema = new Schema<IQuestion>({
    question_id: { type: Number, required: true, unique: true, index: true },
    domain: { type: String, required: true },
    question: { type: String, required: true },
    keywords: { type: String, required: true },
    target_answer: { type: String, required: true },
    difficulty: { type: String, required: true },
});

const questionModel = mongoose.model<IQuestion>("question", questionSchema, "Questions");
export { questionModel, IQuestion };