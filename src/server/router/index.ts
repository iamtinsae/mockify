import { createRouter } from "./context";
import superjson from "superjson";
import { projectsRouter } from "./projects";
import { resourcesRoute } from "./resources";
import { endPointsRouter } from "./endpoints";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("projects.", projectsRouter)
  .merge("resources.", resourcesRoute)
  .merge("endpoints.", endPointsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
