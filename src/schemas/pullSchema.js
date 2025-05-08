import * as yup from "yup";

export const pullPostSchema = yup
  .object({
    userId: yup
      .string()
      .matches(/^user_[a-zA-Z0-9]+$/, "Invalid user ID format")
      .required(),
    productId: yup.number().integer().positive().required(),
  })
  .noUnknown(true, "Unknown field found");

export const pullAmountSchema = yup
  .object({
    amount: yup.number().integer().positive().required(),
  })
  .noUnknown(true, "Unknown field found");
