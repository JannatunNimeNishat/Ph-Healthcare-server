import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post('/',
auth(UserRole.DOCTOR),
DoctorScheduleController.createDoctorSchedule)



export const DoctorScheduleRoutes = router;