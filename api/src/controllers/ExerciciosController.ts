import type { Request, Response } from "express";
import { ExerciciosService } from "../services/ExerciciosService.js";

export class ExerciciosController {
  constructor(private readonly exerciciosService: ExerciciosService) {}

  listarExercicios = async (req: Request, res: Response): Promise<void> => {
    const exercicios: string = await this.exerciciosService.listarExercicios();
    console.log(exercicios);
  };
}
