import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get('/my-schedule', auth(UserRole.DOCTOR),DoctorScheduleController.getMySchedule)

router.post('/',
auth(UserRole.DOCTOR),
DoctorScheduleController.createDoctorSchedule)



export const DoctorScheduleRoutes = router;