import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/", adminController.getAllAdmin);

router.get("/:id", adminController.getById);

router.patch("/:id", adminController.updateAdmin);

router.delete("/:id", adminController.deleteAdmin);

router.delete("/soft/:id", adminController.softDeleteAdmin);

export const AdminRoutes = router;
