import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const config = {
  block: 20, // The size of repetition block
  learnedAt: 14, // Card learned at progress 14
  SRS: [
    // Precomputed repetition algorithm in seconds, should have 20 elements; learned at progress 10, mastered at progress 20
    0, // 0m
    60, // 1m
    120, // 2m
    240, // 4m
    480, // 8m
    900, // 15m
    1800, // 30m
    3600, // 1h
    7200, // 2h
    14400, // 4h
    28800, // 8h
    43200, // 12h
    86400, // 1d
    172800, // 2d
    345600, // 4d
    691200, // 8d
    1036800, // 12d
    1382400, // 16d
    1728000, // 20d
    3456000, // 40d
  ],
  JWT_SECRET:
    process.env.NODE_ENV === "test" ? "test-password" : process.env.JWT_SECRET,
  JWT_EXPIRES_IN:
    process.env.NODE_ENV === "test" ? "1h" : process.env.JWT_EXPIRES_IN,
};

export default config;
