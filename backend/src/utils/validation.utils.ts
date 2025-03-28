import { UserError } from "../types/dataTypes";
import logger from "./logger.utils";
import { Response } from "express";

/**
 * Function converts request strings to number.
 * 
 * @param value 
 * @param paramName 
 * @returns parsed number
 */
export function parseAndValidateRequestValue(value: string | undefined | null, paramName: string): number {
  if (!value) {
    throw new Error(`${paramName} is required, but was not provided.`)
  }

  const numberValue = Number(value);
  if (isNaN(numberValue) || numberValue <= 0) {
    throw new Error(`Invalid ${paramName} number: ${value}`)
  }
  return numberValue;
}

/**
 * For separating interal server error and UserErrors. UserErrors are res.status(400) with specific error message.
 * Interal server errors are logged.  
 * 
 * @param err 
 * @param res 
 */
export function handleControllerError(err: any, res: Response) {  
  if (err instanceof UserError) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    logger.error({ error: err.message })
  }    
}
