const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;
const rootDir = path.resolve(__dirname, "../");

app.use(cors());
app.use(express.static(path.join(rootDir, "public")));
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "index.html"));
});

app.get("/aboutme", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "projects", "aboutme", "index.html"));
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
