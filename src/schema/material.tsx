import { z } from "zod";
import { siteDiaryIdSchema } from "./siteDiary";

export const createMaterialSchema = z
  .object({
    materialType: z.string().trim().min(1, "A material type is required"),
    materialUnits: z.string().trim().min(1, "A material unit is required"),
    materialAmount: z
      .number({ invalid_type_error: "Amount must be a number" })
      .positive({ message: "Amount must be positive" })
      .max(2147483647, { message: "Number must be below 2147483647" }),
  })
  .merge(siteDiaryIdSchema);

const materialIdSchema = z.object({
  materialId: z.string().min(1, "A materialId is required"),
});

export const updateMaterialSchema = createMaterialSchema
  .omit({ siteDiaryId: true })
  .merge(materialIdSchema);
