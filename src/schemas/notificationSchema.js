import * as yup from "yup";

export const notificationPostSchema = yup
  .object({
    title: yup
      .string()
      .min(4, "Title must be more than 4 characters")
      .max(100, "Title cannot be more than 100 characters")
      .required(),
    body: yup.string().max(10000, "Text is too long"),
    imageUrl: yup.string().url("Invalid URL"),
  })
  .noUnknown(true, "Unknown field found");
