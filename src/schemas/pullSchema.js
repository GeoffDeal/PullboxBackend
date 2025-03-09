import * as yup from "yup";

export const pullPostSchema = yup
  .object({
    userId: yup
      .number()
      .integer()
      .positive()
      .max(6, "ID is too long")
      .required(),
    productId: yup.number().integer().positive().required(),
  })
  .noUnknown(true, "Unknown field found");

export const pullAmountSchema = yup
  .object({
    amount: yup.number().integer().positive().required(),
  })
  .noUnknown(true, "Unknown field found");
