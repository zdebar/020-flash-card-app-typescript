import { body, param, validationResult } from "express-validator";

// Middleware for sanitizing input
export const validateLanguageIDBody = [
  body("languageId")
    .isInt({ min: 1 })
    .withMessage(
      (value) =>
        `Invalid languageId provided: '${value}'. It must be a positive integer.`
    )
    .toInt(),
];

export const validateLanguageIDParams = [
  param("languageId")
    .isInt({ min: 1 })
    .withMessage(
      (value) =>
        `Invalid languageId provided: '${value}'. It must be a positive integer.`
    )
    .toInt(),
];

// Middleware for validating uid
export const validateUID = [
  body("uid").custom((value, { req }) => {
    const uid = req.user?.uid;
    if (!uid || typeof uid !== "string" || uid.trim() === "") {
      throw new Error(
        `Invalid uid provided: '${uid}'. It must be a non-empty string.`
      );
    }
    return true;
  }),
];

// Middleware for validating onBlockEnd
export const validateOnBlockEnd = [
  body("onBlockEnd")
    .isBoolean()
    .withMessage(
      (value) => `Invalid onBlockEnd value: '${value}'. It must be a boolean.`
    ),
];

// Middleware for validating items
export const validateItems = [
  body("items")
    .isArray()
    .withMessage(
      (value) => `Invalid items value: '${value}'. It must be an array.`
    )
    .notEmpty()
    .withMessage(
      (value) => `Invalid items value: '${value}'. It cannot be empty.`
    ),
];

// Middleware for validating itemId
export const validateItemID = [
  param("itemId")
    .isInt({ min: 1 })
    .withMessage(
      (value) =>
        `Invalid itemId provided: '${value}'. It must be a positive integer.`
    )
    .toInt(),
];

// Middleware for validating blockId
export const validateBlockID = [
  param("blockId")
    .isInt({ min: 1 })
    .withMessage(
      (value) =>
        `Invalid blockId provided: '${value}'. It must be a positive integer.`
    )
    .toInt(),
];
