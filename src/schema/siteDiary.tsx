import { z } from "zod";

export const createSiteDiarySchema = z.object({
  projectId: z.string().min(1, "A projectId is required"),
  siteDiaryName: z.string().trim().min(1, "A site diary name is required"),
  siteDiaryDate: z.date(),
});

export const siteDiaryIdSchema = z.object({
  siteDiaryId: z.string().min(1, "A siteDiaryId is required"),
});

export const updateSiteDiarySchema = createSiteDiarySchema
  .omit({ projectId: true })
  .merge(siteDiaryIdSchema);

export const getSiteDiaryInfoSchema = siteDiaryIdSchema;

export const deleteSiteDiarySchema = siteDiaryIdSchema;
