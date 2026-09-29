import type { AppError } from "../errors/appError.error.js";

export interface IError {
  name: string;
  message: string;
  statusCode: number;

  spawError(): IError;
}
