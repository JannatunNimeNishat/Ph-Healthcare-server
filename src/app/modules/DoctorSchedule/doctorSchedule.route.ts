import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get('/my-schedule', auth(UserRole.DOCTOR),DoctorScheduleController.getMySchedule)

router.post('/',
auth(UserRole.DOCTOR),
DoctorScheduleController.createDoctorSchedule)

router.delete('/:id', auth(UserRole.DOCTOR), DoctorScheduleController.deleteSchedule)

export const DoctorScheduleRoutes = router;