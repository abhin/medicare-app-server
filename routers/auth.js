import { login, googleLoginCallBack, googleUserVerify } from "../controllers/auth.js";
import express from "express";
import passport from "passport";
import { validateLogin, verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/login",
  validateLogin(),
  login
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleLoginCallBack
);

router.post("/google/verify", verifyUser, googleUserVerify);

export default router;
