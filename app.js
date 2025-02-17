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
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      box_number INT,
      phone VARCHAR(100),
      customer TINYINT(1) NOT NULL,
      status VARCHAR(100) 
    );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      title VARCHAR(100) NOT NULL, 
      body TEXT,
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
      series_id VARCHAR(225),
      publisher VARCHAR(255),
      product_type VARCHAR(255) NOT NULL,
      CONSTRAINT products_fk FOREIGN KEY (series_id) REFERENCES series(id) ON UPDATE CASCADE
    );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      series_id VARCHAR(225) NOT NULL,
      CONSTRAINT subscriptions_fk1 FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT subscriptions_fk2 FOREIGN KEY (series_id) REFERENCES series(id) ON UPDATE CASCADE ON DELETE CASCADE
    );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS pulls_list (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      pull_date DATE NOT NULL DEFAULT (CURRENT_DATE),
      CONSTRAINT pulls_list_fk1 FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT pulls_list_fk2 FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
    );`);
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

import excelRouter from "./src/controllers/handleexcel.js";
app.use("/excel/", excelRouter);

// Listening
app.listen(3000, () => {
  console.log("Server running");
});
