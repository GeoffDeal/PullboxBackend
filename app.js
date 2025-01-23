import express from "express";
import pool from "./src/dbConfig.js";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

process.on("SIGINT", async () => {
  try {
    await pool.end();
    console.log("Pool Closed");
  } catch (err) {
    console.error("Error closing pool: ", err);
  } finally {
    process.exit(0);
  }
});

// Routes
import productRouter from "./src/routes/productRoutes.js";
app.use("/product", productRouter);

import userRouter from "./src/routes/userRoutes.js";
app.use("/users/", userRouter);

// Listening
app.listen(3000, () => {
  console.log("Server running");
});
