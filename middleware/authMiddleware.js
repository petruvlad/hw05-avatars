const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
    // Extrage token-ul din antetul autorizare
    const token = req.headers.authorization.replace("Bearer ", "");

    // Verifică validitatea token-ului
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Găsește utilizatorul în baza de date folosind ID-ul din token
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    // Verifică dacă utilizatorul a fost găsit și token-ul este în lista sa de token-uri
    if (!user) {
      throw new Error();
    }

    // Pasează utilizatorul și token-ul mai departe în cerere
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
}

module.exports = authMiddleware;
