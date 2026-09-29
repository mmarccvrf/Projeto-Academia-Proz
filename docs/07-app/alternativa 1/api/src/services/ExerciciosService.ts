import { Axios } from "axios";

export class ExerciciosService {
  async listarExercicios(): string | void {
    try {
      const axiosResponse: Axios = await new Axios().get(
        process.env.URL_EXERCISEDB as string,
      );
      const response = console.log(axiosResponse.data);
    } catch (e) {
      console.log("Error ao pegar os dados da ExerciseDB");
      console.log(e);
      return;
    }
  }
}
