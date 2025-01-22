import express from "express";
import pool from "./src/dbConfig.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// const testCon = async () => {
//   try {
//     const [results] = await pool.query("SELECT 1");
//     console.log("Success: ", results);
//   } catch (err) {
//     console.error("Error: ", err);
//   }
// };
// testCon();

// Routes
import productRouter from "./src/routes/productRoutes.js";
app.use("/product", productRouter);

import userRouter from "./src/routes/userRoutes.js";
app.use("/users/", userRouter);

// Listening
app.listen(3000, () => {
  console.log("Server running");
});
