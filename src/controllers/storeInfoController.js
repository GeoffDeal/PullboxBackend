import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/storeInfo.json");

export function readInfo(req, res) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Problem reading file" });
    }
    res.status(200).json(JSON.parse(data));
  });
}

export function writeInfo(req, res) {
  const newInfo = JSON.stringify(req.body);
  fs.writeFile(filePath, newInfo, "utf8", (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Problem writing file" });
    }
    res.status(201).json({ message: "File written" });
  });
}
