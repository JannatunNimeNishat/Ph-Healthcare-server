import { Router } from "express";
import { adminController } from "./admin.controller";

import validateRequest from "../../middleWares/validateRequest";
import { AdminValidationSchemas } from "./admin.validations";
import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";
const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.getAllAdmin
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.getById
);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(AdminValidationSchemas.update),
  adminController.updateAdmin
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.deleteAdmin
);

router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.softDeleteAdmin
);

export const AdminRoutes = router;
