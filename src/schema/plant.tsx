import { z } from "zod";
import { siteDiaryIdSchema } from "./siteDiary";

export const createPlantSchema = z
  .object({
    plantType: z.string().trim().min(1, "A plant type is required"),
    plantAmount: z
      .number({ invalid_type_error: "Quantity must be a number" })
      .positive({ message: "Quantity must be positive" })
      .max(2147483647, { message: "Number must be below 2147483647" }),
  })
  .merge(siteDiaryIdSchema);

const plantIdSchema = z.object({
  plantId: z.string().min(1, "A plantId is required"),
});

export const updatePlantSchema = createPlantSchema
  .omit({ siteDiaryId: true })
  .merge(plantIdSchema);
