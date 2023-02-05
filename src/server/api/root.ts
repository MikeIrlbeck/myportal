import { laborerRouter } from "./routers/laborer";
import { materialRouter } from "./routers/material";
import { meRouter } from "./routers/me";
import { plantRouter } from "./routers/plant";
import { projectRouter } from "./routers/project";
import { siteDiaryRouter } from "./routers/siteDiary";
import { siteProblemRouter } from "./routers/siteProblem";
import { taskRouter } from "./routers/task";
import { userRouter } from "./routers/user";
import { weatherRouter } from "./routers/weather";
import { workProgressRouter } from "./routers/workProgress";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  me: meRouter,
  user: userRouter,
  project: projectRouter,
  siteDiary: siteDiaryRouter,
  plant: plantRouter,
  laborer: laborerRouter,
  material: materialRouter,
  siteProblem: siteProblemRouter,
  workProgress: workProgressRouter,
  weather: weatherRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
