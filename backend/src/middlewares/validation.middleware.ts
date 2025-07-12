import { body, validationResult } from "express-validator";

// Middleware for sanitizing input
export const validateLanguageID = [
  body("languageID")
    .isInt({ min: 1 })
    .withMessage("languageID must be a positive integer.")
    .toInt(),
];
