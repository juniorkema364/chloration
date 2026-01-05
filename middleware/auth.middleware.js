// src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import { User } from "../models/user.js"; // adapte le chemin

const auth = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized - No access token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Unauthorized - Access token expired",
        });
      }
      return res.status(401).json({
        message: "Unauthorized - Invalid access token",
      });
    }

    // Sequelize
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default auth;
