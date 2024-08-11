const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/check-link", async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.head(url); // Use HEAD or GET based on your needs
    res.json({ exists: response.status >= 200 && response.status < 300 });
  } catch (error) {
    res.json({ exists: false });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`...Server listening on port ${PORT}....`);
});
