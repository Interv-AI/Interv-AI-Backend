import express from "express";
import cors from 'cors'
import { authRouter } from "./api/routes/Auth";

const app = express()
app.use(express.json())
app.use(cors())


app.use("/auth", authRouter)

export default app;