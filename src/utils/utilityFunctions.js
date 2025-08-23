import { pool } from "../dbConfig.js";

export const closePool = async (signal) => {
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

export const tableCheck = async () => {
  console.log("Checking tables...");
  try {
    await pool.execute(`CREATE TABLE IF NOT EXISTS users(
        id VARCHAR(100) PRIMARY KEY,
        box_number INT,
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
        user_id VARCHAR(100) NOT NULL,
        series_id VARCHAR(225) NOT NULL,
        CONSTRAINT subscriptions_fk1 FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT subscriptions_fk2 FOREIGN KEY (series_id) REFERENCES series(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT unique_sub UNIQUE (user_id, series_id)
      );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS pulls_list (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        product_id INT NOT NULL,
        amount INT NOT NULL DEFAULT 1,
        pull_date DATE NOT NULL DEFAULT (CURRENT_DATE),
        CONSTRAINT pulls_list_fk1 FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT pulls_list_fk2 FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT unique_pull UNIQUE (user_id, product_id)
      );`);
    await pool.execute(`CREATE TABLE IF NOT EXISTS reorders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        product VARCHAR(255) NOT NULL,
        notes TEXT,
        order_date DATE NOT NULL,
        request_date DATE,
        order_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
       );`);
    console.log("Check complete");
  } catch (err) {
    console.error("Problem checking tables: ", err);
  }
};
