import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { ExternalError } from "../common/errors/externalError.error.js";
import { AppError } from "../common/errors/appError.error.js";
import type { ExercisesEntity } from "../entitys/exercise.entity.js";
import type { ExercisesDto } from "./dto/exercicios.dto.js";
import type { exerciciosResponseData } from "../common/types/exercisesResponseData.js";
import type { ExercisesRepository } from "./exercise.repository.js";

type ExercisesApiPage = {
  data?: exerciciosResponseData[];
  meta?: {
    hasNextPage?: boolean;
    nextCursor?: string | null;
  };
};

export class ExerciciosService {
  private loadingExercises: Promise<ExercisesEntity[]> | undefined;

  constructor(
    private readonly exercisesRepository: ExercisesRepository,
    private readonly axiosClient: AxiosInstance = axios,
  ) {}
  async listarExercicios(): Promise<ExercisesEntity[]> {
    try {
      const exercises: ExercisesEntity[] =
        this.exercisesRepository.findAllExercises();

      if (!exercises || exercises.length === 0) {
        if (!this.loadingExercises) {
          this.loadingExercises = this.loadExercises().finally(() => {
            this.loadingExercises = undefined;
          });
        }

        return await this.loadingExercises;
      }

      return exercises;
    } catch (e) {
      if (e instanceof AppError || e instanceof ExternalError) {
        throw e;
      }

      if (e instanceof TypeError) {
        throw new AppError(
          "Error no servidor. Erro ao converter para um objeto em JS",
          500,
        );
      }

      throw new ExternalError(
        "Erro ao consultar dados de uma servidor externo, tente novamente mais tarde",
        502,
      );
    }
  }

  private async loadExercises(): Promise<ExercisesEntity[]> {
    const exercisesData: exerciciosResponseData[] = [];
    const seenCursors = new Set<string>();
    let after: string | undefined;
    let hasNextPage = true;

    while (hasNextPage) {
      const axiosResponse = await this.fetchExercisesPage(after);
      const page = axiosResponse.data;

      if (
        !page ||
        !Array.isArray(page.data) ||
        !page.meta ||
        typeof page.meta.hasNextPage !== "boolean"
      ) {
        throw new ExternalError(
          "O servidor externo retornou dados de paginação inválidos",
          502,
        );
      }

      exercisesData.push(...page.data);
      hasNextPage = page.meta.hasNextPage;

      if (hasNextPage) {
        const nextCursor = page.meta.nextCursor;
        if (
          typeof nextCursor !== "string" ||
          !nextCursor ||
          seenCursors.has(nextCursor) ||
          page.data.length === 0
        ) {
          throw new ExternalError(
            "Não foi possível avançar na paginação dos exercícios externos",
            502,
          );
        }

        seenCursors.add(nextCursor);
        after = nextCursor;
      }
    }

    for (const exercise of exercisesData) {
      const exercisesDto: ExercisesDto = {
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        bodyParts: exercise.bodyParts,
        equipaments: exercise.equipments,
        secondaryMuscles: exercise.secondaryMuscles,
        targetMuscle: exercise.targetMuscles,
      };

      this.exercisesRepository.createExercise(exercisesDto);
    }

    return this.exercisesRepository.findAllExercises();
  }

  private async fetchExercisesPage(
    after?: string,
  ): Promise<AxiosResponse<ExercisesApiPage>> {
    if (after) {
      await this.delay(300);
    }

    let retryAttempt = 0;
    while (true) {
      try {
        return await this.axiosClient.get<ExercisesApiPage>(
          process.env.URL_EXERCISEDB as string,
          {
            params: {
              limit: 25,
              ...(after ? { after } : {}),
            },
          },
        );
      } catch (error: unknown) {
        if (
          !axios.isAxiosError(error) ||
          error.response?.status !== 429 ||
          retryAttempt >= 3
        ) {
          throw error;
        }

        await this.delay(this.getRetryDelay(error, retryAttempt));
        retryAttempt++;
      }
    }
  }

  private getRetryDelay(error: AxiosError, retryAttempt: number): number {
    const retryAfter = error.response?.headers["retry-after"];
    const retryAfterSeconds = Number(retryAfter);

    if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
      return Math.min(retryAfterSeconds * 1000, 30_000);
    }

    if (typeof retryAfter === "string") {
      const retryAt = Date.parse(retryAfter);
      if (Number.isFinite(retryAt)) {
        return Math.max(0, retryAt - Date.now());
      }
    }

    return Math.min(1000 * 2 ** retryAttempt, 8000);
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async adicionarExercicioSubstituto(
    exerciseId: string,
    otherExerciseId: string,
  ): Promise<ExercisesEntity> {
    await this.listarExercicios();

    return this.exercisesRepository.addOtherExercise(
      undefined,
      otherExerciseId,
      undefined,
      exerciseId,
    );
  }
}
