import { MaterialUnit } from "@prisma/client";
import { z } from "zod";
import { siteDiaryIdSchema } from "./siteDiary";

export const createMaterialSchema = z
  .object({
    materialType: z.string().trim().min(1, "A material type is required"),
    materialUnits: z.nativeEnum(MaterialUnit),
    materialAmount: z
      .number({ invalid_type_error: "Quantity must be a number" })
      .positive({ message: "Quantity must be positive" })
      .max(2147483647, { message: "Number must be below 2147483647" }),
  })
  .merge(siteDiaryIdSchema);

const materialIdSchema = z.object({
  materialId: z.string().min(1, "A materialId is required"),
});

export const updateMaterialSchema = createMaterialSchema
  .omit({ siteDiaryId: true })
  .merge(materialIdSchema);
