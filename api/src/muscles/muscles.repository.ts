import type { MuscleEntity } from "../entitys/muscle.entity.js";
import type { MuscleDto } from "./dto/muscles.dto.js";

export class MusclesRepository {
  private muscles!: MuscleEntity[];
  private id!: number;

  constructor() {
    this.muscles = [];
    this.id = 0;
  }

  findAllMuscles(): MuscleEntity[] {
    return this.muscles;
  }

  findOneMuscles(id?: number, name?: string): MuscleDto {
    let muscle: MuscleEntity = { id: 1, name: "test" };
    return muscle;
  }

  createMuscle(muscleResponse: MuscleDto): void {
    const muscle: MuscleEntity = {
      id: this.id,
      name: muscleResponse.name,
    };

    this.id++;
    this.muscles.push(muscle);
  }
}
