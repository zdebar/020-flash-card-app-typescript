import dotenv from 'dotenv';
import path from "path";
import { convertSRSToSeconds } from '../utils/config.utils';

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const block = 20; // The size of repetition block
// repetition algorithm (m - minutes, h - hours, d - days)
export const SRS = convertSRSToSeconds(["0m","5m","15m","30m","1h","2h","4h","8h","12h","1d", "2d", "3d", "4d", "6d", "8d", "12d", "16d", "20d", "30d", "40d"]); 
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

