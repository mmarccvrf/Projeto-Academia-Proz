import { Router } from "express";
import { MusclesController } from "./muscles.controller.js";
import { MusclesService } from "./muscles.service.js";
import { MusclesRepository } from "./muscles.repository.js";

export class MusclesRouter {
  private readonly router: Router;
  private readonly controller: MusclesController;

  constructor() {
    this.controller = new MusclesController(
      new MusclesService(new MusclesRepository()),
    );
    this.router = Router();
    this.router.get(
      "/muscles",
      this.controller.findAllMuscles.bind(this.controller),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
