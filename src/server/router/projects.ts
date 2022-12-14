import z from "zod";
import { generateUniqueSlug } from "../../utils/slug";
import { createProtectedRouter } from "./context";

export const projectsRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      name: z.string(),
      description: z.string().default(""),
    }),
    async resolve({ ctx, input }) {
      const slug = generateUniqueSlug(input.name);
      const project = await ctx.prisma.project.create({
        data: {
          slug,
          creatorId: ctx.session.user.id,
          ...input,
        },
      });

      return project;
    },
  })
  .query("getMyProject", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input: { slug } }) {
      const project = await ctx.prisma.project.findFirst({
        where: {
          slug,
          creatorId: ctx.session.user.id,
        },
        include: {
          resources: {
            include: {
              endPoints: {
                include: {
                  schemas: true,
                },
              },
            },
          },
        },
      });

      return project;
    },
  })
  .query("getAllMyProjects", {
    async resolve({ ctx }) {
      return await ctx.prisma.project.findMany({
        where: {
          creatorId: ctx.session.user.id,
        },
      });
    },
  });
