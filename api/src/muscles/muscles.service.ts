import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { MuscleDto } from "./dto/muscles.dto.js";
import type { MusclesRepository } from "./muscles.repository.js";
import type { IError } from "../common/interfaces/error.interface.js";
import { ExternalError } from "../common/errors/externalError.error.js";
import { AppError } from "../common/errors/appError.error.js";
import type { MuscleEntity } from "../entitys/muscle.entity.js";

export class MusclesService {
  constructor(
    private readonly musclesRepository: MusclesRepository,
    private readonly axiosClient: AxiosInstance = axios,
  ) {}

  async findAllMuscles(): Promise<MuscleEntity[]> {
    const muscles: MuscleEntity[] | undefined =
      this.musclesRepository.findAllMuscles();
    if (!muscles || muscles.length == 0) {
      try {
        const musclesResponse: MuscleDto[] = await this.getDataMusclesApi();
        if (!musclesResponse) return musclesResponse;

        for (const muscle of musclesResponse) {
          this.musclesRepository.createMuscle(muscle);
        }
      } catch (error: unknown) {
        throw new ExternalError("Erro ao coletar os musculos da API", 502);
      }
    }

    return muscles;
  }

  private async getDataMusclesApi(): Promise<MuscleDto[]> {
    try {
      const axiosReponse: AxiosResponse = await this.axiosClient.get(
        process.env.URL_MUSCLESDB as string,
      );

      if (!axiosReponse || !axiosReponse.data) {
        throw new ExternalError(
          "Error ao buscar os músculos da API ExerciseDB",
          502,
        );
      }

      return axiosReponse.data.data;
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
