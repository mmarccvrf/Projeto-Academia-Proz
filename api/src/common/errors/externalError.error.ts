import type { IError } from "../interfaces/error.interface.js";

export class ExternalError implements IError {
  message: string;
  name: string;
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    this.name = "ExternalError";
    this.message = message;
    this.statusCode = statusCode ? statusCode : 500;
  }
  spawError(): IError {
    throw this;
  }
}
