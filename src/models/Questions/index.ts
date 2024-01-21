import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
    question_Id: string
    domain: string,
    question: string,
    keywords: string,
    target_answer: string,
    difficulty: string
}

const questionSchema: Schema = new Schema<IQuestion>({
    question_Id: { type: String, required: true, unique: true, index: true },
    domain: { type: String, required: true },
    question: { type: String, required: true },
    keywords: { type: String, required: true },
    target_answer: { type: String, required: true },
    difficulty: { type: String, required: true },
});

export default mongoose.model<IQuestion>('question', questionSchema);