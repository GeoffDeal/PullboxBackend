import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Routes
import productRouter from "./src/routes/productRoutes.js";
app.use("/product", productRouter);

import userRouter from "./src/routes/userRoutes.js";
app.use("/user/", userRouter);

// Listening
app.listen(3000, () => {
  console.log("Server running");
});
