import { Router } from "express";
import { ExerciciosController } from "../controllers/ExerciciosController.js";
import { ExerciciosService } from "../services/ExerciciosService.js";

export class ExerciciosRouter {
  private readonly router: Router;
  private readonly controller: ExerciciosController;

  constructor() {
    this.controller = new ExerciciosController(new ExerciciosService());
    this.router = Router();
    this.router.get("/exercicios", this.controller.listarExercicios);
  }

  public getRouter(): Router {
    return this.router;
  }
}
