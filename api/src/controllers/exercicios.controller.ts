import type { Request, Response } from "express";
import { ExerciciosService } from "../services/exercicios.service.js";
import type { IError } from "../common/interfaces/error.interface.js";
import type { ExerciseDBResponse } from "../common/types/exercisedbResponse.js";

export class ExerciciosController {
  constructor(private readonly exerciciosService: ExerciciosService) {}

  async listarExercicios(req: Request, res: Response): Promise<Response> {
    try {
      const exercicios: ExerciseDBResponse | IError =
        await this.exerciciosService.listarExercicios();

      if ("statusCode" in exercicios) {
        return res.status(exercicios.statusCode).json({
          error: exercicios.name,
          message: exercicios.message,
          statusCode: exercicios.statusCode,
        });
      }

      return res.status(200).json(exercicios);
    } catch (error: unknown) {
      const typedError = error as IError;
      return res.status(typedError.statusCode ?? 500).json({
        error: typedError.name,
        message: typedError.message,
        statusCode: typedError.statusCode,
      });
    }
  }
}
