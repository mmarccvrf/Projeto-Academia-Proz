import type { IError } from "../interfaces/error.interface.js";

export class AppError implements IError {
  name: string;
  message: string;
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    ((this.message = message),
      (this.name = "AppError"),
      (this.statusCode = statusCode ? statusCode : 500));
  }

  spawError(): AppError {
    throw this;
  }
}
