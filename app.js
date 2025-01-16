import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

import excelRouter from "./src/controllers/handleexcel.js";

app.use("/excel", excelRouter);

app.listen(3000, () => {
  console.log("Server running");
});
