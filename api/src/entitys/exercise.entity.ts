export class ExercisesEntity {
  exerciseId!: string;
  name!: string;
  bodyParts!: string[];
  equipaments!: string[];
  targetMuscle!: string[];
  secondaryMuscles!: string[];
  otherExercises!: ExercisesEntity[];
}
