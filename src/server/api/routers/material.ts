import { z } from "zod";
import {
  createMaterialSchema,
  updateMaterialSchema,
} from "../../../schema/material";
import { trycatch } from "../../../utils/trycatch";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const deleteMaterialSchema = z.object({
  materialId: z.string(),
});

export const materialRouter = createTRPCRouter({
  createMaterial: protectedProcedure
    .input(createMaterialSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.material.create({
            data: {
              type: input.materialType,
              units: input.materialUnits,
              amount: input.materialAmount,
              createdById: ctx.session.user.id,
              siteDiaryId: input.siteDiaryId,
            },
          });
        },
        errorMessages: ["Failed to create material"],
      })();
    }),
  updateMaterial: protectedProcedure
    .input(updateMaterialSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.material.update({
            where: {
              id: input.materialId,
            },
            data: {
              type: input.materialType,
              units: input.materialUnits,
              amount: input.materialAmount,
            },
          });
        },
        errorMessages: ["Failed to update material"],
      })();
    }),
  deleteMaterial: protectedProcedure
    .input(deleteMaterialSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.material.delete({
            where: {
              id: input.materialId,
            },
          });
        },
        errorMessages: ["Failed to delete material"],
      })();
    }),
});
