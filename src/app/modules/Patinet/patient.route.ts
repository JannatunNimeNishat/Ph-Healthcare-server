import { Router } from "express";
import { PatientController } from "./patient.controller";

const router = Router();


router.get(
    '/',
    PatientController.getAllFromDB
);



export const PatientRoutes = router;