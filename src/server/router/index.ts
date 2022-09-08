import { createRouter } from "./context";
import superjson from "superjson";
import { projectsRouter } from "./projects";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("projects.", projectsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
