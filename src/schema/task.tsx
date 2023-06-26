import { TaskStatus } from "@prisma/client";
import { z } from "zod";

export const getTasksSchema = z.object({
  projectId: z.string().min(1, "A projectId is required"),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(10).default(5).optional(),
  statuses: z.array(z.nativeEnum(TaskStatus)),
  searches: z.array(
    z.object({
      category: z.enum(["DESCRIPTION", "ASSIGNED_TO", "ASSIGNED_BY"]),
      value: z.string(),
    })
  ),
});

// TODO: where should createdBy go?
export const createTaskSchema = z.object({
  projectId: z.string().min(1, "A projectId is required"),
  taskDescription: z.string().trim().min(1, "A description is required"),
  taskStatus: z.nativeEnum(TaskStatus).default(TaskStatus.NOT_STARTED),
  taskAssignedTo: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string().nullable(),
      image: z.string().nullable(),
    })
    .nullable(),
});
const taskIdSchema = z.object({
  taskId: z.string().min(1, "A taskId is required"),
});

export const updateTaskSchema = createTaskSchema
  .omit({ projectId: true })
  .merge(taskIdSchema)
  .extend({ limit: z.number().min(1).max(10).default(5).optional() });

export const getTaskSchema = taskIdSchema;
export const deleteTaskSchema = taskIdSchema;
