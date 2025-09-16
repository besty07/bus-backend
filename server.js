const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow only your deployed frontend domain (replace this URL with your frontend deployment link)
app.use(cors({
  origin: ["https://your-frontend.onrender.com"]
}));

app.use(express.json());

// ✅ Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// store driver location
let driverLocation = {};

// serve driver page
app.get("/driver", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "driver.html"));
});

// serve user page
app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user.html"));
});

// driver updates location
app.post("/location", (req, res) => {
  const { lat, lng, accuracy } = req.body;

  driverLocation = {
    lat,
    lng,
    accuracy: accuracy || null,
    timestamp: Date.now()
  };

  console.log("✅ Updated location:", driverLocation);
  res.json({ status: "ok" });
});

// user requests driver location
app.get("/location", (req, res) => {
  res.json(driverLocation);
});

app.listen(PORT, () => console.log(`🚍 Server running on port ${PORT}`));

