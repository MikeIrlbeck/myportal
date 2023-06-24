import { z } from "zod";
import { siteDiaryIdSchema } from "./siteDiary";

export const createWorkProgressSchema = z
  .object({
    workProgressComments: z.string().trim().min(1, "A comment is required"),
  })
  .merge(siteDiaryIdSchema);

const siteProblemIdSchema = z.object({
  siteProblemId: z.string().min(1, "A siteProblemId is required"),
});

export const updateWorkProgressSchema = createWorkProgressSchema
  .omit({ siteDiaryId: true })
  .merge(siteProblemIdSchema);

export const deleteWorkProgressSchema = siteProblemIdSchema;
