import { z } from "zod";
import { siteDiaryIdSchema } from "./siteDiary";

export const createWorkProgressSchema = z
  .object({
    workProgressComments: z.string().trim().min(1, "A comment is required"),
  })
  .merge(siteDiaryIdSchema);

const workProgressIdSchema = z.object({
  workProgressId: z.string().min(1, "A workProgressId is required"),
});

export const updateWorkProgressSchema = createWorkProgressSchema
  .omit({ siteDiaryId: true })
  .merge(workProgressIdSchema);

export const deleteWorkProgressSchema = workProgressIdSchema;
