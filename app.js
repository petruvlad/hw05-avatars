const express = require("express");
const app = express();
const path = require("path");

// Define port
const port = 3000; // sau orice alt port dorit

// Setează folderul public pentru fișierele statice
app.use(express.static(path.join(__dirname, "public")));

// Pornirea serverului
app.listen(port, () => {
  console.log(`Serverul rulează la adresa http://localhost:${port}`);
});
