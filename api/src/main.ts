import express, { type Express } from "express";
import * as dotenv from "dotenv";
import { ExerciciosRouter } from "./exercises/exercicios.route.js";

dotenv.config();

const app: Express = express();
const exerciciosRouter = new ExerciciosRouter();

app.use(exerciciosRouter.getRouter());

app.get("/", (_req, res) => {
  res.send("API funcionando");
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log(
    `Servidor rodando em http://localhost:${process.env.PORT ?? 3000}`,
  );
});
