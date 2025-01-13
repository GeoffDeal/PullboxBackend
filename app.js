import express from "express";
// import mysql from 'mysql2';

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server running");
});
