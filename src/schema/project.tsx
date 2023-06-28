import { z } from "zod";

export const createProjectSchema = z.object({
  projectName: z.string().trim().min(1, "A project name is required"),
});

export const projectIdSchema = z.object({
  projectId: z.string().trim().min(1, "A projectId is required"),
});

export const getProjectSchema = projectIdSchema;

export const updateProjectSchema = createProjectSchema.merge(projectIdSchema);

export const deleteProjectSchema = projectIdSchema;

export const addToProjectSchema = z
  .object({
    userId: z.string().trim().min(1, "A userId is required"),
    userName: z.string().trim().min(1, "A userName is required"),
    userEmail: z.string().trim().min(1, "A userEmail is required"),
    userImage: z.string().trim().min(1, "A userImage is required"),
  })
  .merge(projectIdSchema);

export const removeFromProjectSchema = z
  .object({
    userToBeRemovedId: z.string(),
  })
  .merge(projectIdSchema);

export const getProjectCreatorSchema = projectIdSchema;
