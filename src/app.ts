import express from "express";
import cors from 'cors';
import { authRouter } from "./api/routes/Auth";
import { QuestionRouter } from "./api/routes/Question";

const app = express();

// Configure CORS options
const corsOptions = {
    origin: 'https://interv-ai-frontend-pi.vercel.app',
    optionsSuccessStatus: 200 // For legacy browser support
};

// Use CORS with the configured options
app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/interview", QuestionRouter);

export default app;
