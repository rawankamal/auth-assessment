const express = require("express");
const path = require("path");

const app = express();

// Serve Angular frontend (correct Nx output path)
app.use(express.static(path.join(__dirname, "dist/apps/auth-assessment")));

// API routes (correct Nx output path)
app.use("/api", require("./dist/apps/api/main.js"));

// Any other route serves Angular app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/apps/auth-assessment/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
