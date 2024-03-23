import { Router } from "express";
import { adminController } from "./admin.controller";

import validateRequest from "../../middleWares/validateRequest";
import { AdminValidationSchemas } from "./admin.validations";
const router = Router();

router.get("/", adminController.getAllAdmin);

router.get("/:id", adminController.getById);

router.patch(
  "/:id",
  validateRequest(AdminValidationSchemas.update),
  adminController.updateAdmin
);

router.delete("/:id", adminController.deleteAdmin);

router.delete("/soft/:id", adminController.softDeleteAdmin);

export const AdminRoutes = router;
