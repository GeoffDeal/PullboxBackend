import express from "express";
import pool from "./src/dbConfig.js";
import cors from "cors";
import productRouter from "./src/routes/productRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import subscriptionRouter from "./src/routes/subscriptionRoutes.js";
import pullRouter from "./src/routes/pullRoutes.js";
import notificationRouter from "./src/routes/notificationRoutes.js";
import storeInfoRouter from "./src/routes/storeInfoRoutes.js";
import priceAdjustmentRouter from "./src/routes/priceAdjustmentRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Check for tables
const tableCheck = async () => {
  console.log("Checking tables...");
  try {
    await pool.execute(`CREATE TABLE IF NOT EXISTS users(
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      box_number INT,
      phone VARCHAR(100),
      customer TINYINT(1) NOT NULL,
      status VARCHAR(100) 
    );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      title VARCHAR(100) NOT NULL, 
      body TEXT,
      image_url VARCHAR(255),
      date DATE NOT NULL DEFAULT (CURRENT_DATE)
    );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS series (
      id VARCHAR(225) PRIMARY KEY,
      name VARCHAR(225) NOT NULL,
      publisher VARCHAR(225) NOT NULL
    );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS  series_skus (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sku VARCHAR(40) NOT NULL UNIQUE,
      series_id VARCHAR(225) NOT NULL,
      CONSTRAINT series_sku_fk FOREIGN KEY (series_id) REFERENCES series(id) ON UPDATE CASCADE
    );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sku VARCHAR(40) NOT NULL UNIQUE,
      product_name VARCHAR(255) NOT NULL,
      item_code VARCHAR(255) NOT NULL,
      msrp VARCHAR(255) NOT NULL,
      release_date DATE NOT NULL,
      foc_due_date DATE,
      image_url VARCHAR(255),
      issue NUMERIC(10,1),
      variant VARCHAR(12),
      printing VARCHAR(12),
      incentive VARCHAR(20),
      series_id VARCHAR(225),
      publisher VARCHAR(255),
      product_type VARCHAR(255) NOT NULL,
      date_added DATE NOT NULL DEFAULT (CURRENT_DATE),
      CONSTRAINT products_fk FOREIGN KEY (series_id) REFERENCES series(id) ON UPDATE CASCADE,
      INDEX idx_release_foc (foc_due_date, release_date),
      FULLTEXT INDEX idx_product_name (product_name)
    );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      series_id VARCHAR(225) NOT NULL,
      CONSTRAINT subscriptions_fk1 FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT subscriptions_fk2 FOREIGN KEY (series_id) REFERENCES series(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT unique_sub UNIQUE (user_id, series_id)
    );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS pulls_list (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      amount INT NOT NULL DEFAULT 1,
      pull_date DATE NOT NULL DEFAULT (CURRENT_DATE),
      CONSTRAINT pulls_list_fk1 FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT pulls_list_fk2 FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT unique_pull UNIQUE (user_id, product_id)
    );`);
    console.log("Check complete");
  } catch (err) {
    console.error("Problem checking tables: ", err);
    setTimeout(() => {
      process.exit(1);
    }, 1000``);
  }
};

// Close pool on exit
const closePool = async (signal) => {
  try {
    console.log(`Received signal: ${signal}`);
    await pool.end();
    console.log("Pool Closed");
  } catch (err) {
    console.error("Error closing pool: ", err);
  } finally {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
};
process.on("SIGINT", () => closePool("SIGINT"));
process.on("SIGTERM", () => closePool("SIGTERM"));

// Routes

app.use("/products/", productRouter);

app.use("/users/", userRouter);

app.use("/subs/", subscriptionRouter);

app.use("/pulls/", pullRouter);

app.use("/notifications", notificationRouter);

app.use("/storeinfo", storeInfoRouter);

app.use("/priceadjustments", priceAdjustmentRouter);

// Listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running");
});

await tableCheck();
