import type { Request, Response } from "express";
import type { MusclesService } from "./muscles.service.js";
import type { MuscleEntity } from "../entitys/muscle.entity.js";
import type { IError } from "../common/interfaces/error.interface.js";

export class MusclesController {
  constructor(private readonly muscleService: MusclesService) {}

  async findAllMuscles(req: Request, res: Response): Promise<Response> {
    try {
      const muscles: MuscleEntity[] = await this.muscleService.findAllMuscles();

      return res.status(200).json({
        status: "OK",
        statusCode: 200,
        data: muscles,
      });
    } catch (erro: unknown) {
      const typeError: IError = erro as IError;
      return res.status(typeError.statusCode).json({
        error: typeError.name,
        message: typeError.message,
        statusCode: typeError.statusCode,
      });
    }
  }
}
