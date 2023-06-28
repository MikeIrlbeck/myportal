import { z } from "zod";

export const createSiteDiarySchema = z.object({
  projectId: z.string().min(1, "A projectId is required"),
  siteDiaryName: z.string().trim().min(1, "A site diary name is required"),
  siteDiaryDate: z.date(),
});

const id = z.object({
  siteDiaryId: z.string().min(1, "A siteDiaryId is required"),
});

export const updateSiteDiarySchema = createSiteDiarySchema
  .omit({ projectId: true })
  .merge(id);

export const getSiteDiaryInfoSchema = id;

export const deleteSiteDiarySchema = id;

export const getSiteDiariesSchema = z.object({
  projectId: z.string().min(1, "A projectId is required"),
  siteDiaryNames: z.array(z.string()),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});
