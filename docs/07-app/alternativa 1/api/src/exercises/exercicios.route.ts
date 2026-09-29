import { Router } from "express";
import { ExerciciosController } from "./exercicios.controller.js";
import { ExerciciosService } from "./exercicios.service.js";
import { ExercisesRepository } from "./exercise.repository.js";

export class ExerciciosRouter {
  private readonly router: Router;
  private readonly controller: ExerciciosController;

  constructor() {
    this.controller = new ExerciciosController(
      new ExerciciosService(new ExercisesRepository()),
    );
    this.router = Router();
    this.router.get(
      "/exercises",
      this.controller.findAllExercises.bind(this.controller),
    );
    this.router.post(
      "/exercises/:exerciseId/alternatives/:otherExerciseId",
      this.controller.addOtherExercise.bind(this.controller),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
