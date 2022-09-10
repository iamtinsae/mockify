import { z } from "zod";
import { createProtectedRouter } from "./context";

export const resourcesRoute = createProtectedRouter()
  .mutation("create", {
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
  })
  .mutation("delete", {
    input: z.object({
      resourceId: z.string(),
    }),
    async resolve({ ctx, input: { resourceId } }) {
      // check if a resource exists with the resource id
      // and creator id of requestor
      await ctx.prisma.resource.findFirstOrThrow({
        where: {
          id: resourceId,
          project: {
            creatorId: ctx.session.user.id,
          },
        },
      });

      await ctx.prisma.resource.delete({
        where: {
          id: resourceId,
        },
      });

      return true;
    },
  });
