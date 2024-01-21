import mongoose from "mongoose";

interface IUser {
    id: string,
    passwordHash: string,
    name: string,
    email: string,
    createdAt: string;
    updatedAt: string;
}

interface ICreateUser extends Omit<IUser, "id" | "createdAt" | "updatedAt"> { }

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
})

const userModel = mongoose.model("auth", userSchema, "authdb");

export { userModel, IUser, ICreateUser };