import express from "express";
import pool from "./src/dbConfig.js";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Check for tables
const tableCheck = async () => {
  try {
    await pool.execute(`CREATE TABLE IF NOT EXISTS users(
      ID INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      boxnumber INT,
      phone VARCHAR(100),
      customer TINYINT(1) NOT NULL,
      customertype VARCHAR(100), 
      sublist VARCHAR(100)
      )`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      title VARCHAR(100) NOT NULL, 
      body TEXT,
      date DATE NOT NULL DEFAULT (CURRENT_DATE)
      )`);
  } catch (err) {
    console.error("Problem checking tables: ", err);
  }
};
tableCheck();

// Close pool on exit
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
