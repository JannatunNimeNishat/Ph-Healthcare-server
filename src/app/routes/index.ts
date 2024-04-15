import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { SpecialtiesRoutes } from "../modules/Specialties/specialties.route";
import { DoctorRoutes } from "../modules/Doctor/doctor.route";
import { PatientRoutes } from "../modules/Patinet/patient.route";
import { ScheduleRoutes } from "../modules/Schedule/schedule.route";
import { DoctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path:'/auth',
    route:AuthRoutes
  },
  {
    path:'/specialties',
    route:SpecialtiesRoutes
  },
  {
    path:'/doctor',
    route:DoctorRoutes
  },
  {
    path: '/patient',
    route:PatientRoutes
  },
  {
    path: '/schedule',
    route:ScheduleRoutes
  },
  {
    path: '/doctor-schedule',
    route:DoctorScheduleRoutes
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
