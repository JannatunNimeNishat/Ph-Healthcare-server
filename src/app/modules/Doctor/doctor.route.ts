import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get('/',DoctorController.getDoctors)
router.get('/:id',DoctorController.getSingleDoctor)

export const DoctorRoutes = router;