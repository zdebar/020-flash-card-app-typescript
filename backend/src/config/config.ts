import dotenv from "dotenv";
import path from "path";
import { validateEnvVariables } from "../utils/validate.utils";

// Only load .env file in non-production environments
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}
validateEnvVariables([
  "LOGGER_LEVEL",
  "NODE_ENV",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
]);

const config = {
  round: 10, // The size of repetition block
  SRS: [
    0, // Precomputed repetition algorithm in seconds
    0, // 0s
    120, // 2m
    900, // 15m
    3600, // 1h
    14400, // 4h
    86400, // 1d
    172800, // 2d
    345600, // 4d
    691200, // 8d
    1036800, // 12d
    1382400, // 16d
  ],
  srsRandomness: 0.1, // Randomness of SRS algorithm 0.1 (10%); uniform distribution; to ensure that words are not repeated in blocks, but are are mixed out
  learnedProgress: 5, // Progress value for a word to be considered learned

  JWT_SECRET:
    process.env.NODE_ENV === "test" ? "test-password" : process.env.JWT_SECRET,
  JWT_REFRESH_SECRET:
    process.env.NODE_ENV === "test"
      ? "test-password"
      : process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN:
    process.env.NODE_ENV === "test" ? "1h" : process.env.JWT_EXPIRES_IN,
};

export default config;
