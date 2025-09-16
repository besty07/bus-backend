const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow all origins for now
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let driverLocation = {};

app.get("/driver", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "driver.html"));
});

app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user.html"));
});

app.post("/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;
  driverLocation = { lat, lng, accuracy: accuracy || null, timestamp: Date.now() };
  console.log("✅ Updated location:", driverLocation);
  res.json({ status: "ok" });
});

app.get("/location", (req, res) => {
  res.json(driverLocation);
});

app.listen(PORT, () => console.log(`🚍 Server running on port ${PORT}`));

