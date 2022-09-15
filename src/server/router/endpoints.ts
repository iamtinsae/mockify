import { z } from "zod";
import { createProtectedRouter } from "./context";

export const endPointsRouter = createProtectedRouter().mutation("create", {
  input: z.object({
    name: z.string(),
    route: z.string(),
    schemas: z.array(
      z.object({
        name: z.string(),
        type: z.enum([
          "ID",
          "NAME",
          "ADDRESS",
          "PHONE_NUMBER",
          "AGE",
          "DATE",
          "WORD",
        ]),
      })
    ),
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
        name: input.name,
        route: input.route,
        method: input.method,
        resourceId: resource.id,
      },
    });

    input.schemas.forEach(
      async (schema) =>
        await ctx.prisma.schema.create({
          data: {
            name: schema.name,
            type: schema.type,
            endPointId: endPoint.id,
          },
        })
    );

    return endPoint;
  },
});
