import { z } from "zod";
import { siteDiaryIdSchema } from "./siteDiary";

export const createLaborerSchema = z
  .object({
    laborerType: z.string().trim().min(1, "A laborer type is required"),
    laborerAmount: z
      .number({ invalid_type_error: "Amount must be a number" })
      .positive({ message: "Amount must be positive" })
      .max(2147483647, { message: "Number must be below 2147483647" }),
  })
  .merge(siteDiaryIdSchema);

const laborerIdSchema = z.object({
  laborerId: z.string().min(1, "A laborerId is required"),
});

export const updateLaborerSchema = createLaborerSchema
  .omit({ siteDiaryId: true })
  .merge(laborerIdSchema);

export const deleteLaborerSchema = laborerIdSchema;