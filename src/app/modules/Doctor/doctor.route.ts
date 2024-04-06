import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get('/',DoctorController.getDoctors)
router.get('/:id',DoctorController.getSingleDoctor)

router.patch('/:id',DoctorController.updateDoctor)

router.delete(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.deleteDoctor
  );
  
  router.delete(
    "/soft/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.softDeleteDoctor)

export const DoctorRoutes = router;