import {
  createPlantSchema,
  deletePlantSchema,
  updatePlantSchema,
} from "../../../schema/plant";
import { trycatch } from "../../../utils/trycatch";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const plantRouter = createTRPCRouter({
  createPlant: protectedProcedure
    .input(createPlantSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.plant.create({
            data: {
              type: input.plantType,
              amount: input.plantAmount,
              createdById: ctx.session.user.id,
              siteDiaryId: input.siteDiaryId,
            },
          });
        },
        errorMessages: ["Failed to create plant"],
      })();
    }),
  updatePlant: protectedProcedure
    .input(updatePlantSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.plant.update({
            where: {
              id: input.plantId,
            },
            data: {
              type: input.plantType,
              amount: input.plantAmount,
            },
          });
        },
        errorMessages: ["Failed to update plant"],
      })();
    }),
  deletePlant: protectedProcedure
    .input(deletePlantSchema)
    .mutation(async ({ ctx, input }) => {
      return await trycatch({
        fn: () => {
          return ctx.prisma.plant.delete({
            where: {
              id: input.plantId,
            },
          });
        },
        errorMessages: ["Failed to delete plant"],
      })();
    }),
});
