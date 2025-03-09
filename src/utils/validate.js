import * as yup from "yup";
import { promises as fs } from "fs";

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

const fileSchema = yup.object({
  file: yup
    .mixed()
    .required()
    .test("fileType", "Invalid file type, must be xlsx", (value) => {
      return (
        value &&
        value.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    })
    .test("fileSize", "File too large", (value) => {
      return value && value.size <= 10 * 1024 * 1024;
    }),
});
export const validateFile = async (req, res, next) => {
  try {
    if (req.files.length === 0) {
      throw new Error("There must be at least one file");
    }
    await Promise.all(
      req.files.map((excelFile) => fileSchema.validate({ file: excelFile }), {
        abortEarly: false,
      })
    );
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors });
    try {
      const filePaths = req.files.map((file) => file.path);
      await Promise.all(filePaths.map((path) => fs.unlink(path)));
      console.log("Excel files deleted");
    } catch (err) {
      console.error("Error deleting files: ", err);
    }
  }
};
