import axios, { type AxiosInstance } from "axios";
import type { MuscleDto } from "./dtos/muscles.dto.js";
import type { MusclesRepository } from "./muscles.repository.js";
import type { IError } from "../common/interfaces/error.interface.js";
import { ExternalError } from "../common/errors/externalError.error.js";
import { AppError } from "../common/errors/appError.error.js";

export class MusclesService {
  constructor(
    private readonly musclesRepository: MusclesRepository,
    private readonly axios: AxiosInstance = axios,
  ) {}

  async findAllMuscles(): Promise<MuscleDto[]> {
    const muscles: MuscleDto[] | undefined =
      this.musclesRepository.findAllMuscles();

    if (!muscles) {
      try {
        const musclesResponse: MuscleDto[] = await this.getDataMusclesApi();
        if (!musclesResponse) return musclesResponse;

        for (const muscle of musclesResponse) {
        }
      } catch (error: unknown) {}
    }

    return muscles;
  }

  private async getDataMusclesApi(): Promise<MuscleDto[]> {
    try {
      const axiosReponse: MuscleDto[] = await axios.get(
        process.env.URL_MUSCLESDB as string,
      );

      if (!axiosReponse)
        throw new ExternalError(
          "Error ao buscar os músculos da API ExerciseDB",
          502,
        );

      return axiosReponse;
    } catch (erro: unknown) {
      if (erro as IError) {
        const typeError = erro as IError;
        throw typeError;
      }

      const appError: AppError = new AppError(
        "Error interno ao solicitar os músculos da API ExerciseDB",
        500,
      );
      throw appError;
    }
  }
}
