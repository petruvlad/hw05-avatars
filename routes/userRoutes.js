const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jimp = require("jimp");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "tmp");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({ storage: storage });


router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
    
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image file" });
      }


      const avatar = await jimp.read(req.file.path);
      await avatar.resize(250, 250).write(req.file.path);

      
      const uniqueFileName = Date.now() + "-" + req.file.originalname;

    
      fs.renameSync(
        req.file.path,
        path.join("public", "avatars", uniqueFileName)
      );

      
      req.user.avatarURL = `/avatars/${uniqueFileName}`;
      await req.user.save();

      
      res.status(200).json({ avatarURL: req.user.avatarURL });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
