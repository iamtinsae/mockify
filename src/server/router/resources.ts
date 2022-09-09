import { z } from "zod";
import { createProtectedRouter } from "./context";

export const resourcesRoute = createProtectedRouter().mutation("create", {
  input: z.object({
    projectSlug: z.string(),
    name: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  }),
  async resolve({ ctx, input }) {
    const project = await ctx.prisma.project.findFirstOrThrow({
      where: {
        slug: input.projectSlug,
        creatorId: ctx.session.user.id,
      },
    });

    const resource = await ctx.prisma.resource.create({
      data: {
        name: input.name,
        projectId: project.id,
      },
    });

    return resource;
  },
});
