import * as yup from "yup";

export const validateData = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: false,
    });
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
};

const idSchema = yup.object({
  id: yup.number().integer().positive().required(),
});
export const validateId = async (req, res, next) => {
  try {
    await idSchema.validate(req.params, {
      abortEarly: false,
      stripUnknown: false,
    });
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
};
