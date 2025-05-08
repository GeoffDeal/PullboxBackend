import * as yup from "yup";

export const subscriptionPostSchema = yup
  .object({
    userId: yup
      .string()
      .matches(/^user_[a-zA-Z0-9]+$/, "Invalid user ID format")
      .required(),
    seriesId: yup.string().required(),
  })
  .noUnknown(true, "Unknown field present");
