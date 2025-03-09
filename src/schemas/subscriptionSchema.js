import * as yup from "yup";

export const subscriptionPostSchema = yup
  .object({
    userId: yup.number().max(6, "ID string too long").required(),
    seriesId: yup.string().required(),
  })
  .noUnknown(true, "Unknown field present");
