import { Request, Response } from "express";
import { ICreateUser } from "../../../models/User";
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
            res.status(400).send({ code: "auth/invalid-credentials", message: "Invalid credentials" });
            return;
        }

        const authService = new AuthService();

        // get userby email
        const user = await authService.getUserByEmail(email);
        if (user === null) {
            res.status(404).send({ code: "user/not-found", message: "User not found" });
            return;
        }
        // validate the password
        const isPasswordMatch = await checkPasswordValidity(password, user.passwordHash);

        if (!isPasswordMatch) {
            res.status(401).send({ code: "user/invalid-credentials", message: "Invalid Credentials" });
            return;
        }

        //generate jwt
        const tokenPayload = {
            email: user.email
        }

        const tokenExpiryTime = calculateTimeDiffFromNowToDayEnd(currentDate);
        let token = await generateToken(tokenPayload, tokenExpiryTime)

        res.send({ ...user, passwordHash: undefined, token: token })

    } catch (error: any) {
        logError("An error occured in login API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error has occured" });
    }
}

export const RegisterUser = async (req: Request, res: Response) => {
    const authService = new AuthService();
    try {
        const data = req.body || {};
        if (typeof data.email !== "string" || typeof data.password !== "string" || data.email === "" || data.name === "") {
            res.status(400).send({ code: "auth/invalid-credentials", message: "Invalid credentials" });
            return;
        }

        const passwordHash = await generatePasswordHash(data.password);
        const authData: ICreateUser = {
            email: data.email,
            passwordHash: passwordHash,
            name: data.name
        }

        const createdUser = await authService.createUser(authData);
        res.send(createdUser)

    } catch (error) {
        logError("An error occured in Employee Register API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error occured" });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const email = req.body.email || "";
        const newPass = req.body.password || "";

        if (email === "" || newPass === "") {
            res.status(400).send({ code: "auth/invalid-credentials", message: "Invalid credentials" });
            return;
        }
        const authService = new AuthService();
        const newHashedPassword = await generatePasswordHash(newPass);
        const isUpdated = await authService.updatePasswordByEmail(email, newHashedPassword);

        if (isUpdated) {
            res.status(204).send();
            return;
        }
        res.status(404).send({ code: "user/not-found", message: "User not found" });

    } catch (error) {
        logError("An error occured in Employee Register API", error);
        res.status(500).send({ code: "server/internal-error", message: "An internal server error occured" });
    }
}

