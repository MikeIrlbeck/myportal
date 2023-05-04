import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { trycatch } from "../../../utils/trycatch";
import type { createInnerTRPCContext } from "../trpc";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const hasPermissionToProjectSchema = z.object({
  projectId: z.string(),
});

export const isCreatorOfProjectSchema = z.object({
  projectId: z.string(),
});

export const getMyProfessionalRoleSchema = z.object({
  projectId: z.string(),
});

export const deleteMyAccountSchema = z.object({
  projectId: z.string(),
});

export const updateMyProfessionalRoleSchema = z.object({
  projectId: z.string(),
  userProfessionalRole: z.enum([
    "ACCOUNTANT",
    "DOCUMENT_CONTROLLER",
    "FOREMAN",
    "PROJECT_ENGINEER",
    "PROJECT_MEMBER",
    "PROJECT_MANAGER",
    "PROJECT_DIRECTOR",
    "QUANTITY_SURVEYOR",
    "SITE_SUPERVISOR",
    "SITE_ENGINEER",
    "SITE_ADMIN",
  ]),
});

export const userHasPermissionToProject = async ({
  ctx,
  projectId,
}: {
  ctx: createInnerTRPCContext;
  projectId: string;
}) => {
  const userOnProject = await ctx.prisma.usersOnProjects.findFirst({
    where: {
      userId: ctx.session?.user?.id,
      projectId: projectId,
    },
  });
  // not found
  if (!userOnProject) {
    return false;
  }
  return true;
};

export const userHasPermissionToProjectOrThrow = async ({
  ctx,
  projectId,
}: {
  ctx: createInnerTRPCContext;
  projectId: string;
}) => {
  if (
    !(await userHasPermissionToProject({
      ctx,
      projectId: projectId,
    }))
  )
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
};

export const meRouter = createTRPCRouter({
  hasPermissionToProject: protectedProcedure
    .input(hasPermissionToProjectSchema)
    .query(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return userHasPermissionToProject({
            ctx,
            projectId: input.projectId,
          });
        },
        errorMessages: ["Failed to check if user has permission to project"],
      })();
    }),
  isCreatorOfProject: protectedProcedure
    .input(isCreatorOfProjectSchema)
    .query(async ({ ctx, input }) => {
      return await trycatch({
        fn: async () => {
          const isCreator = await ctx.prisma.project.findFirst({
            where: {
              id: input.projectId,
              createdById: ctx.session.user.id,
            },
          });
          if (!isCreator) {
            return false;
          }
          return true;
        },
        errorMessages: ["Failed to check if user is creator of project"],
      })();
    }),
  getMyProfessionalRole: protectedProcedure
    .input(getMyProfessionalRoleSchema)
    .query(async ({ ctx, input }) => {
      return await trycatch({
        fn: async () => {
          const userOnProjectRecord =
            await ctx.prisma.usersOnProjects.findFirst({
              where: {
                userId: ctx.session.user.id,
                projectId: input.projectId,
              },
            });
          return userOnProjectRecord?.userProfessionalRole;
        },
        errorMessages: ["Failed to get my professional role"],
      })();
    }),
  updateMyProfessionalRole: protectedProcedure
    .input(updateMyProfessionalRoleSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.usersOnProjects.update({
            where: {
              userId_projectId: {
                userId: ctx.session.user.id,
                projectId: input.projectId,
              },
            },
            data: {
              userProfessionalRole: input.userProfessionalRole,
            },
          });
        },
        errorMessages: ["Failed to update project"],
      })();
    }),
});
