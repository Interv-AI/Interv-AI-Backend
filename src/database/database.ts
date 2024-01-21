import mongoose, { Mongoose } from "mongoose";

export async function initDatabase() {
    //@ts-ignore
    await mongoose.connect(process.env.MONGO_URL || "");
    mongoose.set('allowDiskUse', true)
    mongoose.set("debug", true);
}