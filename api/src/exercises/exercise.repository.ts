import { AppError } from "../common/errors/appError.error.js";
import type { ExercisesEntity } from "../entitys/exercise.entity.js";
import type { ExercisesDto } from "./dto/exercicios.dto.js";

const BODY_PART_MUSCLE_GROUPS: Record<string, readonly string[]> = {
  back: [
    "back",
    "erector spinae",
    "latissimus dorsi",
    "levator scapulae",
    "rhomboids",
    "trapezius",
    "upper back",
  ],
  cardio: ["cardio", "cardiovascular system"],
  chest: ["chest", "pectorals", "serratus anterior"],
  "lower arms": [
    "lower arms",
    "forearms",
    "grip muscles",
    "hands",
    "wrist extensors",
    "wrist flexors",
    "wrists",
  ],
  "lower legs": [
    "lower legs",
    "ankle stabilizers",
    "ankles",
    "calves",
    "feet",
    "soleus",
    "tibialis anterior",
  ],
  neck: ["neck", "levator scapulae", "sternocleidomastoid", "trapezius"],
  shoulders: [
    "shoulders",
    "deltoids",
    "levator scapulae",
    "rear deltoids",
    "rotator cuff",
    "trapezius",
    "upper back",
  ],
  "upper arms": ["upper arms", "brachialis", "biceps", "triceps"],
  "upper legs": [
    "upper legs",
    "abductors",
    "adductors",
    "glutes",
    "hamstrings",
    "hip flexors",
    "quadriceps",
  ],
  waist: ["waist", "abdominals", "core", "obliques"],
};
const MAX_AUTOMATIC_ALTERNATIVES = 10;

export class ExercisesRepository {
  private exercises!: ExercisesEntity[];

  constructor() {
    this.exercises = [];
  }

  findAllExercises(): ExercisesEntity[] {
    return this.exercises;
  }

  findOneExercise(id?: string, name?: string): ExercisesDto {
    let muscle: ExercisesEntity = {
      exerciseId: id!,
      name: name!,
      bodyParts: [],
      equipaments: [],
      secondaryMuscles: [],
      targetMuscle: [],
      otherExercises: [],
    };
    return muscle;
  }

  createExercise(exerciseDto: ExercisesDto): void {
    const exercise: ExercisesEntity = {
      exerciseId: exerciseDto.exerciseId,
      name: exerciseDto.name,
      bodyParts: exerciseDto.bodyParts,
      equipaments: exerciseDto.equipaments,
      secondaryMuscles: exerciseDto.secondaryMuscles,
      targetMuscle: exerciseDto.targetMuscle,
      otherExercises: [],
    };

    for (const existingExercise of this.exercises) {
      if (this.isCompatible(existingExercise, exercise)) {
        this.addOtherExerciseIfMissing(
          existingExercise,
          exercise,
          MAX_AUTOMATIC_ALTERNATIVES,
        );
      }
      if (this.isCompatible(exercise, existingExercise)) {
        this.addOtherExerciseIfMissing(
          exercise,
          existingExercise,
          MAX_AUTOMATIC_ALTERNATIVES,
        );
      }
    }

    this.exercises.push(exercise);
  }

  addOtherExercise(
    nameOtherExercise?: string,
    otherExerciseId?: string,
    nameExercise?: string,
    exerciseId?: string,
  ): ExercisesEntity {
    if (!nameOtherExercise && !otherExerciseId) {
      throw new AppError(
        "Erro ao buscar o outro exercício, não foram enviado nenhum parâmetro name ou ID para identificar o outro exercício",
        400,
      );
    }

    if (!nameExercise && !exerciseId) {
      throw new AppError(
        "Erro ao buscar o outro exercício, não foram enviado nenhum parâmetro name ou ID para identificar o exercício",
        400,
      );
    }

    const otherExerciseIndex = this.exercises.findIndex((candidate) =>
      nameOtherExercise
        ? candidate.name === nameOtherExercise
        : candidate.exerciseId === otherExerciseId,
    );
    const exerciseIndex = this.exercises.findIndex((candidate) =>
      nameExercise
        ? candidate.name === nameExercise
        : candidate.exerciseId === exerciseId,
    );

    if (exerciseIndex === -1)
      throw new AppError(
        "Nenhum exercício encontrado para adicionar o outro exercício",
        404,
      );
    if (otherExerciseIndex === -1)
      throw new AppError("Nenhum outro exercício encontrado", 404);

    const exercise = this.exercises[exerciseIndex];
    const otherExercise = this.exercises[otherExerciseIndex];

    if (!exercise)
      throw new AppError(
        "Nenhum exercício encontrado para adicionar o outro exercício",
        404,
      );
    if (!otherExercise)
      throw new AppError("Nenhum outro exercício encontrado", 404);

    if (exerciseIndex === otherExerciseIndex)
      throw new AppError("Um exercício não pode substituir a si mesmo", 400);

    if (!this.isCompatible(exercise, otherExercise))
      throw new AppError(
        "O outro exercício não trabalha uma parte corporal compatível",
        422,
      );

    this.addOtherExerciseIfMissing(exercise, otherExercise);

    return exercise;
  }

  private isCompatible(
    exercise: ExercisesEntity,
    otherExercise: ExercisesEntity,
  ): boolean {
    const bodyParts = new Set(
      (Array.isArray(exercise.bodyParts) ? exercise.bodyParts : [])
        .filter((bodyPart): bodyPart is string => typeof bodyPart === "string")
        .flatMap((bodyPart) => {
          const normalizedBodyPart = bodyPart.trim().toLocaleLowerCase();
          return (
            BODY_PART_MUSCLE_GROUPS[normalizedBodyPart] ?? [normalizedBodyPart]
          );
        }),
    );
    const otherExerciseMuscles = [
      ...(Array.isArray(otherExercise.targetMuscle)
        ? otherExercise.targetMuscle
        : []),
      ...(Array.isArray(otherExercise.secondaryMuscles)
        ? otherExercise.secondaryMuscles
        : []),
    ]
      .filter((muscle): muscle is string => typeof muscle === "string")
      .map((muscle) => muscle.trim().toLocaleLowerCase());

    return otherExerciseMuscles.some((muscle) => bodyParts.has(muscle));
  }

  private addOtherExerciseIfMissing(
    exercise: ExercisesEntity,
    otherExercise: ExercisesEntity,
    maxAlternatives = Number.POSITIVE_INFINITY,
  ): void {
    const currentOtherExercises = Array.isArray(exercise.otherExercises)
      ? exercise.otherExercises
      : [];
    if (
      !currentOtherExercises.some(
        (candidate) => candidate.exerciseId === otherExercise.exerciseId,
      ) && currentOtherExercises.length < maxAlternatives
    ) {
      exercise.otherExercises = [
        ...currentOtherExercises,
        { ...otherExercise, otherExercises: [] },
      ];
    }
  }
}
