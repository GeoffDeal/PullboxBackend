import * as yup from "yup";

export const reorderPostSchema = yup
  .object({
    userId: yup
      .string()
      .nullable()
      .matches(/^user_[a-zA-Z0-9]+$/, "Invalid user ID format"),
    userName: yup.string(),
    product: yup.string().required(),
    notes: yup.string(),
    orderDate: yup.string(),
    requestDate: yup.string(),
    orderStatus: yup
      .string()
      .oneOf(["ordered", "unavailable", "complete"])
      .required(),
  })
  .noUnknown(true, "Unknown field present");

export const reorderPatchSchema = yup.object({
  orderStatus: yup
    .string()
    .oneOf(["ordered", "unavailable", "complete"])
    .required(),
});
