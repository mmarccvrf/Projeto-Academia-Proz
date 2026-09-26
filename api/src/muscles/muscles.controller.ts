import type { Request, Response } from "express";
import type { MuscleDto } from "./dtos/muscles.dto.js";
import type { MusclesService } from "./muscles.service.js";

export class MusclesController {
  constructor(private readonly muscleService: MusclesService) {}

  async findAllMuscles(req: Request, res: Response): Promise<Response> {}
}
