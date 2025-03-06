export const validateData = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false, stripUnknown: false });
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
  }
};
