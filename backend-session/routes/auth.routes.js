import { login, session, logOut } from "../controllers/auth.controllers.js";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.get("/session", session);
router.post("/logout", logOut);

export { router };
