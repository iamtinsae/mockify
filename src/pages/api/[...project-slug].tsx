import { prisma } from "../../server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateFake } from "../../utils/faker";

const extractUrl = (query: NextApiRequest["query"]) => {
  if (!Array.isArray(query["project-slug"])) {
    throw Error("Invalid url given.");
  }

  const {
    limit,
    page,
    "project-slug": [projectSlug = "", resourceName = "", route = "/"],
  } = query;

  return { projectSlug, resourceName, route, limit, page };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const extractedUrl = extractUrl(req.query);

  const endPoint = await prisma?.endPoint.findFirst({
    where: {
      route: extractedUrl.route,
      method: req.method,
      resource: {
        name: extractedUrl.resourceName ?? "",
        project: {
          slug: extractedUrl.projectSlug ?? "",
        },
      },
    },

    include: {
      schemas: true,
    },
  });

  if (!endPoint) {
    res.status(404);
    return res.send({ error: "End point not found!" });
  }

  if (endPoint.isList) {
    const generatedFakes = [];
    for (let i = 0; i < 10; ++i)
      generatedFakes.push(generateFake(endPoint.schemas));
    return res.json({ data: generatedFakes, hasNext: false });
  }

  return res.json(generateFake(endPoint.schemas));
}
