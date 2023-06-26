import {
  createTaskSchema,
  deleteTaskSchema,
  getTaskSchema,
  getTasksSchema,
  updateTaskSchema,
} from "../../../schema/task";
import { trycatch } from "../../../utils/trycatch";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.task.create({
            data: {
              description: input.taskDescription,
              status: input.taskStatus,
              createdById: ctx.session.user.id,
              assignedToId: input.taskAssignedTo?.id,
              projectId: input.projectId,
            },
            include: {
              assignedTo: true,
              createdBy: true,
            },
          });
        },
        errorMessages: ["Failed to create task"],
      })();
    }),
  getTasks: protectedProcedure
    .input(getTasksSchema)
    .query(async ({ ctx, input }) => {
      return await trycatch({
        fn: async () => {
          const tasks = await ctx.prisma.task.findMany({
            where: {
              projectId: input.projectId,
              status: {
                in: input.statuses.length > 0 ? input.statuses : undefined,
              },
              AND: !(input.searches.length > 0)
                ? undefined
                : input.searches.map((search) => {
                    if (search.category === "DESCRIPTION")
                      return {
                        description: {
                          contains: search.value,
                        },
                      };
                    else if (search.category === "ASSIGNED_TO") {
                      return {
                        assignedTo: {
                          email: {
                            contains: search.value,
                          },
                        },
                      };
                    } else if (search.category === "ASSIGNED_BY") {
                      return {
                        createdBy: {
                          email: {
                            contains: search.value,
                          },
                        },
                      };
                    }
                    // Here so that Typesciprt won't throw an error
                    return {
                      description: undefined,
                    };
                  }),
            },
            include: {
              createdBy: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: input.limit,
            skip: input.cursor ? 1 : 0,
            cursor: input.cursor ? { id: input.cursor } : undefined,
          });
          return {
            tasks: tasks.map((task) => ({
              id: task.id,
              description: task.description,
              status: task.status,
              createdBy: task.createdBy,
              assignedTo: task.assignedTo,
            })),
            nextCursor: tasks[tasks.length - 1]?.id || undefined,
          };
        },
        errorMessages: ["Failed to get tasks"],
      })();
    }),
  getTask: protectedProcedure
    .input(getTaskSchema)
    .query(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.task.findUniqueOrThrow({
            where: {
              id: input.taskId,
            },
            include: {
              createdBy: {
                select: {
                  name: true,
                },
              },
              assignedTo: {
                select: {
                  name: true,
                },
              },
            },
          });
        },
        errorMessages: ["Failed to get task"],
      })();
    }),
  updateTask: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.task.update({
            where: {
              id: input.taskId,
            },
            data: {
              description: input.taskDescription,
              status: input.taskStatus,
              assignedToId: input.taskAssignedTo?.id,
            },
          });
        },
        errorMessages: ["Failed to update task"],
      })();
    }),
  deleteTask: protectedProcedure
    .input(deleteTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.task.delete({
            where: {
              id: input.taskId,
            },
          });
        },
        errorMessages: ["Failed to delete task"],
      })();
    }),
});
