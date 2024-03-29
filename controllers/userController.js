const User = require("../models/User");
const gravatar = require("gravatar");

async function registerUser(req, res) {
  try {
    const { email, username, password } = req.body;

    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mp" });

    const newUser = new User({
      email,
      username,
      password,
      avatarURL,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { registerUser };
