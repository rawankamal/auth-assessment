const express = require("express");
const path = require("path");

const app = express();

// Serve Angular frontend
app.use(express.static(path.join(__dirname, "dist/auth-assessment")));

// API routes
app.use("/api", require("./dist/api/main.js"));

// أي Route تاني يفتح Angular app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/auth-assessment/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
