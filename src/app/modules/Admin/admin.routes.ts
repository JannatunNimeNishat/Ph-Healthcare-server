import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/", adminController.getAllAdmin);

router.get('/:id',adminController.getById);

router.patch('/:id',adminController.updateAdmin);

export const AdminRoutes = router;
