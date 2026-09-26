import axios, { type AxiosInstance } from "axios";
import type { ExerciseDBResponse } from "../common/types/exercisedbResponse.js";
import { ExternalError } from "../common/errors/externalError.error.js";
import { AppError } from "../common/errors/appError.error.js";
import type { IError } from "../common/interfaces/error.interface.js";

export class ExerciciosService {
  constructor(private readonly axiosClient: AxiosInstance = axios) {}
  async listarExercicios(): Promise<ExerciseDBResponse | IError> {
    try {
      const axiosResponse = await this.axiosClient.get<
        ExerciseDBResponse | string
      >(process.env.URL_EXERCISEDB as string);

      if (typeof axiosResponse.data === "string") {
        const parsedResponse: unknown = JSON.parse(axiosResponse.data);
        return parsedResponse as ExerciseDBResponse;
      }

      return axiosResponse.data;
    } catch (e) {
      if (e instanceof TypeError) {
        const appError: AppError = new AppError(
          "Error no servidor. Erro ao converter para um objeto em JS",
          500,
        );
        return appError.spawError();
      }
      const externalErro: ExternalError = new ExternalError(
        "Erro ao consultar dados de uma servidor externo, tente novamente mais tarde",
        502,
      );
      return externalErro.spawError();
    }
  }
}
