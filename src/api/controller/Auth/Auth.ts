import { Request, Response } from "express";
import { ICreateUser, userModel } from "../../../models/User";
import AuthService from "../../../service/Auth/Auth";
import { logError } from "../../../logger/logger";
import { generateToken } from "../../../auth/AuthUtils";
import { checkPasswordValidity, calculateTimeDiffFromNowToDayEnd, generatePasswordHash } from "../../../utils";
import dotenv from 'dotenv-flow'

dotenv.config()

export const login = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const currentDate = new Date();

        if (typeof email !== "string" || typeof password !== "string" || email === "" || password === "") {
            res.status(400).send({ code: "auth/invalid-credentials", message: "Invalid credentials", status: "Error" });
            return;
        }

        const authService = new AuthService();
        const user = await authService.getUserByEmail(email);
        if (user === null) {
            res.status(404).send({ code: "user/not-found", message: "User not found", status: "Error" });
            return;
        }
        const isPasswordMatch = await checkPasswordValidity(password, user.passwordHash);

        if (!isPasswordMatch) {
            res.status(401).send({ code: "user/invalid-credentials", message: "Invalid Credentials", status: "Error" });
            return;
        }
        const tokenPayload = {
            email: user.email
        }

        const tokenExpiryTime = calculateTimeDiffFromNowToDayEnd(currentDate);
        let token = await generateToken(tokenPayload, tokenExpiryTime)

        res.send({ ...user, passwordHash: undefined, token: token, status: "Success" })

    } catch (error: any) {
        logError("An error occured in login API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
}

export const RegisterUser = async (req: Request, res: Response) => {
    const authService = new AuthService();
    const currentDate = new Date();

    try {
        const data = req.body || {};
        if (typeof data.email !== "string" || typeof data.password !== "string" || data.email === "" || data.name === "") {
            res.status(400).send({ code: "auth/invalid-credentials", message: "Invalid credentials", status: "Error" });
            return;
        }

        const tokenPayload = {
            email: data.email
        }

        const passwordHash = await generatePasswordHash(data.password);
        const authData: ICreateUser = {
            email: data.email,
            passwordHash: passwordHash,
            name: data.name
        }
        const existingUser = await authService.getUserByEmail(data.email);
        if (existingUser !== null) {
            res.status(409).send({ code: "auth/email-already-exists", message: "Email already exists", status: "Error" });
            return;
        }

        const tokenExpiryTime = calculateTimeDiffFromNowToDayEnd(currentDate);
        let token = await generateToken(tokenPayload, tokenExpiryTime)

        const createdUser = await authService.createUser(authData);
        res.send({ createdUser, token, status: "Success" });

    } catch (error: any) {
        logError("An error occurred in Employee Register API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error occurred" });

    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const email = req.body.email || "";
        const newPass = req.body.password || "";

        if (email === "" || newPass === "") {
            res.status(400).send({ code: "auth credentials are requirred", message: "Invalid credentials", status: "Error" });
            return;
        }
        const authService = new AuthService();
        const newHashedPassword = await generatePasswordHash(newPass);
        const isUpdated = await authService.updatePasswordByEmail(email, newHashedPassword);

        if (isUpdated) {
            res.status(204).send({ status: "Success" });
            return;
        }
        res.status(404).send({ code: "user/not-found", message: "User not found", status: "Error" });

    } catch (error) {
        logError("An error occured in Employee Register API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error occured" });
    }
}

