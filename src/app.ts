import express from "express";
import cors from 'cors'
import { authRouter } from "./api/routes/Auth";
import { QuestionRouter } from "./api/routes/Question";
const app = express()
app.use(express.json())
app.use(cors())


app.use("/auth", authRouter)
app.use("/interview", QuestionRouter)

export default app;