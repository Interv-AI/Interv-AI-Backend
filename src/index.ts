import dotenv from "dotenv";
import { logError, logInfo } from "./logger/logger";
import app from "./app";
import { initDatabase } from "./database/database";

dotenv.config();

initDatabase().catch((err) => {
  logError("An error occured while initializing the database", err);
  process.exit(1);
})

const portToListen = process.env.PORT || 3001;

app.listen(portToListen, () => {
  logInfo("Server started listening on port:" + portToListen)
})