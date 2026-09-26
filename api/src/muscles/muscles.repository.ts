import type { MuscleDto } from "./dtos/muscles.dto.js";

export class MusclesRepository {
  private muscles!: MuscleDto[];
  private id!: number;

  constructor() {
    this.muscles = [];
    this.id = 0;
  }

  findAllMuscles(): MuscleDto[] {
    return this.muscles;
  }

  findOneMuscles(id?: number, name?: string): MuscleDto {
    let muscle: MuscleDto = { id: 1, name: "test" };
    return muscle;
  }

  createMuscle(muscleResponse: MuscleDto): void {
    const muscle: MuscleDto = {
      id: this.id,
      name: muscleResponse.name,
    };

    this.id++;
    this.muscles.push(muscle);
  }
}
