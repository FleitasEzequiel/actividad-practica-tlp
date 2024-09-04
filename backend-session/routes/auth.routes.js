import { login, session, logOut } from "../controllers/auth.controllers.js";
import { Router } from "express";
import validarJWT from "../middlewares/validar-jwt.js"

const router = Router();

router.post("/login", login);
router.get("/session",validarJWT , session);
router.post("/logout", logOut);

export { router };
