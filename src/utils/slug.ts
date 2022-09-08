import slugify from "slugify";

export const generateUniqueSlug = (words: string) => {
  return slugify([words, randomString()].join("-")).toLowerCase();
};

export const randomString = () => {
  return Math.random().toString(16).slice(2, 10).toString();
};
