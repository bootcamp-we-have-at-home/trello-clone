import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  registerController,
  loginController,
  meController,
  logoutController,
} from "../controllers/auth.controller.js";
const router: Router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", meController);
router.post("/logout", logoutController);
router.get("/protected", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "You have access to this protected route",
    user: req.user,
  });
});
export default router;