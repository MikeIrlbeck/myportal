import { z } from "zod";
import { siteDiaryIdSchema } from "./siteDiary";

export const createSiteProblemSchema = z
  .object({
    siteProblemComments: z.string().trim().min(1, "A comment is required"),
  })
  .merge(siteDiaryIdSchema);

const siteProblemIdSchema = z.object({
  siteProblemId: z.string().min(1, "A siteProblemId is required"),
});

export const updateSiteProblemSchema = createSiteProblemSchema
  .omit({ siteDiaryId: true })
  .merge(siteProblemIdSchema);
