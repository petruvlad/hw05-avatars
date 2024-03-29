const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jimp = require("jimp");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// Middleware pentru a gestiona încărcarea fișierului din cerere
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp"); // directorul temporar pentru stocarea temporară a avatarului
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // generarea unui nume unic pentru fișier
  },
});

const upload = multer({ storage: storage });

// Ruta pentru actualizarea avatarului utilizatorului
router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // Verifică dacă există fișierul avatarului în cerere
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image file" });
      }

      // Procesează avatarul pentru a-i ajusta dimensiunile
      const avatar = await jimp.read(req.file.path);
      await avatar.resize(250, 250).write(req.file.path);

      // Generează un nume unic pentru fișierul avatarului
      const uniqueFileName = Date.now() + "-" + req.file.originalname;

      // Mută avatarul utilizatorului din directorul temporar în directorul public/avatars
      fs.renameSync(
        req.file.path,
        path.join("public", "avatars", uniqueFileName)
      );

      // Actualizează câmpul avatarURL al utilizatorului în baza de date
      req.user.avatarURL = `/avatars/${uniqueFileName}`;
      await req.user.save();

      // Răspuns de succes
      res.status(200).json({ avatarURL: req.user.avatarURL });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
