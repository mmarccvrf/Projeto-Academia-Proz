import type { Request, Response } from "express";
import { ExerciciosService } from "./exercicios.service.js";
import { AppError } from "../common/errors/appError.error.js";
import type { IError } from "../common/interfaces/error.interface.js";
import type { ExercisesEntity } from "../entitys/exercise.entity.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export class ExerciciosController {
  constructor(private readonly exerciciosService: ExerciciosService) {}

  async findAllExercises(req: Request, res: Response): Promise<Response> {
    try {
      const exercicios: ExercisesEntity[] =
        await this.exerciciosService.listarExercicios();
      const page = this.parsePositiveInteger(
        req.query.page,
        "page",
        DEFAULT_PAGE,
      );
      const limit = this.parsePositiveInteger(
        req.query.limit,
        "limit",
        DEFAULT_LIMIT,
      );

      if (limit > MAX_LIMIT) {
        throw new AppError(`O limite máximo por página é ${MAX_LIMIT}`, 400);
      }

      const total = exercicios.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;

      return res.status(200).json({
        status: "OK",
        statusCode: 200,
        data: exercicios.slice(startIndex, startIndex + limit),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      });
    } catch (error: unknown) {
      return this.errorResponse(res, error);
    }
  }

  async addOtherExercise(
    req: Request<{ exerciseId: string; otherExerciseId: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      const exercise =
        await this.exerciciosService.adicionarExercicioSubstituto(
          req.params.exerciseId,
          req.params.otherExerciseId,
        );

      return res.status(200).json({
        status: "OK",
        statusCode: 200,
        data: exercise,
      });
    } catch (error: unknown) {
      return this.errorResponse(res, error);
    }
  }

  private errorResponse(res: Response, error: unknown): Response {
    const errorData =
      error !== null && typeof error === "object" && "statusCode" in error
        ? (error as Partial<IError>)
        : undefined;
    const statusCode =
      typeof errorData?.statusCode === "number" ? errorData.statusCode : 500;

    return res.status(statusCode).json({
      error:
        typeof errorData?.name === "string"
          ? errorData.name
          : "InternalServerError",
      message:
        typeof errorData?.message === "string"
          ? errorData.message
          : "Erro interno do servidor",
      statusCode,
    });
  }

  private parsePositiveInteger(
    value: unknown,
    parameterName: string,
    defaultValue: number,
  ): number {
    if (value === undefined) {
      return defaultValue;
    }

    if (typeof value !== "string" || !/^\d+$/.test(value)) {
      throw new AppError(
        `O parâmetro ${parameterName} deve ser um inteiro positivo`,
        400,
      );
    }

    const parsedValue = Number(value);
    if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
      throw new AppError(
        `O parâmetro ${parameterName} deve ser um inteiro positivo`,
        400,
      );
    }

    return parsedValue;
  }
}
