import express from "express";
import path from "path";
import axios from "axios";
import cors from "cors";
import { fileURLToPath } from 'url';
// import { Client } from "osu-web.js";

// const token = await getToken();
// const client = new Client(token.access_token)
const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../");

app.use(cors());
app.use(express.static(path.join(rootDir, "public")));
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "index.html"));
});

app.get("/aboutme", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "aboutme", "index.html"));
});

app.get("/check-link", async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url); // Use HEAD or GET based on your needs
    res.json({ exists: response.status >= 200 && response.status < 300 });
  } catch (error) {
    res.json({ exists: false });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`...Server listening on port ${PORT}....`);
});
