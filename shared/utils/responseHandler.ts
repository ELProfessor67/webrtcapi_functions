import { themeMessages } from "../constants/messages";
import { Response } from "express";

/**
 * Handles the response for a service function in an Express route.
 * @param {Response} res - The Express response object.
 * @param {Function} serviceFn - The service function to execute.
 * @param {boolean} [error=false] - Whether there is a validation error.
 * @param {...any[]} args - Additional arguments to pass to the service function.
 * @returns {Promise<void>} A promise that resolves with the response.
 */
export const responseHandler = async (res: Response, serviceFn: Function, error: boolean = false, ...args: any[]) => {
  try {
    // If there is a validation error, send a 400 response with a validation error message
    if (error) {
      return res.status(400).json({ error: themeMessages.ValidationError });
    }

    // Call the service function with the provided arguments
    const result = await serviceFn(...args);
    const { status = 200, message = themeMessages.Success, data = null } = result || {};

    // Send the response based on the status code returned by the service function
    if (status === 200) {
      return res.status(200).json({
        message: message,
        data: data,
      });
    } else {
      return res.status(status).json({ error: message });
    }
  } catch (error) {
    // Handle any unexpected errors by sending a 500 response with an internal server error message
    return res.status(500).json({ error: themeMessages.InternalServerError });
  }
};
