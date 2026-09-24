import { Router } from "express";
import { ExerciciosController } from "../controllers/exercicios.controller.js";
import { ExerciciosService } from "../services/exercicios.service.js";

export class ExerciciosRouter {
  private readonly router: Router;
  private readonly controller: ExerciciosController;

  constructor() {
    this.controller = new ExerciciosController(new ExerciciosService());
    this.router = Router();
    this.router.get(
      "/exercicios",
      this.controller.listarExercicios.bind(this.controller),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
