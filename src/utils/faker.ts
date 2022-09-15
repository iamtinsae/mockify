import { z } from "zod";
import { allowed_schema_types } from "../lib/validation";
import { faker } from "@faker-js/faker";
import { Schema } from "@prisma/client";

const schemaType = z.object({
  name: z.string(),
  type: z.enum(allowed_schema_types),
});

const generateFakeFromSchema = (schema: Schema) => {
  if (schema.type === "ADDRESS") {
    return faker.address.city();
  }

  switch (schema.type) {
    case "AGE":
      return faker.datatype.number({ min: 10, max: 90 });

    case "DATE":
      return faker.date.birthdate();

    case "ID":
      return faker.database.mongodbObjectId();
    case "NAME":
      return faker.name.fullName();

    case "PHONE_NUMBER":
      return faker.phone.number();

    case "WORD":
      return faker.word.noun();

    default:
      throw Error("Unknown schema type given.");
  }
};

export const generateFake = (schemas: Array<Schema>) => {
  const fake: { [key: string]: unknown } = {};
  schemas.forEach(
    (schema) => (fake[schema.name] = generateFakeFromSchema(schema))
  );

  return fake;
};
