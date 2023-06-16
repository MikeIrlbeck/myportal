import { z } from "zod";

export const createSiteDiarySchema = z.object({
  projectId: z.string().min(1, "A projectId is required"),
  siteDiaryName: z.string().trim().min(1, "A site diary name is required"),
  siteDiaryDate: z.date(),
});
