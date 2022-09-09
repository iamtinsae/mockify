import { z } from "zod";
import { createProtectedRouter } from "./context";

export const endPointsRouter = createProtectedRouter().mutation("create", {
  input: z.object({
    route: z.string(),
    resourceId: z.string(),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  }),
  async resolve({ ctx, input }) {
    const resource = await ctx.prisma.resource.findFirstOrThrow({
      where: {
        id: input.resourceId,
        project: {
          creatorId: ctx.session.user.id,
        },
      },
    });

    const endPoint = await ctx.prisma.endPoint.create({
      data: {
        route: input.route,
        method: input.method,
        resourceId: resource.id,
      },
    });

    return endPoint;
  },
});
