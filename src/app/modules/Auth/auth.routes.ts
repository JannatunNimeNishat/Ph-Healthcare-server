import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/login", authController.loginUser);

router.post(
  "/refresh-token",
  authController.generatingAccessTokenFromRefreshToken
);
router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  authController.changePassword
);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export const AuthRoutes = router;
