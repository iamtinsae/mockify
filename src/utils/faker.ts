import { faker } from "@faker-js/faker";
import type { Schema } from "@prisma/client";

const generateFakeFromSchema = (type: string) => {
  switch (type) {
    case "ADDRESS":
      return faker.address.city();

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
      throw Error("Given type is not supported.");
  }
};

export const generateFake = (schemas: Array<Schema>) => {
  const fakeData: { [key: string]: unknown } = {};
  schemas.forEach(
    (schema) => (fakeData[schema.name] = generateFakeFromSchema(schema.type))
  );

  return fakeData;
};
