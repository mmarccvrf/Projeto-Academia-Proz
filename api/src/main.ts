import express, { type Express } from "express";
import * as dotenv from "dotenv";
import { ExerciciosRouter } from "./exercises/exercicios.route.js";
import { MusclesRouter } from "./muscles/muscles.routes.js";

dotenv.config();

const app: Express = express();
const exerciciosRouter = new ExerciciosRouter();
const musclesRouter: MusclesRouter = new MusclesRouter();

app.use(exerciciosRouter.getRouter());
app.use(musclesRouter.getRouter());

app.get("/", (_req, res) => {
  res.send("API funcionando");
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log(
    `Servidor rodando em http://localhost:${process.env.PORT ?? 3000}`,
  );
});
