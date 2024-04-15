import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleController.createSchedule
);

export const ScheduleRoutes = router;
