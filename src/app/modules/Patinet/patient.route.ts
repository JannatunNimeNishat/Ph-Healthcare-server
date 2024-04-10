import { Router } from "express";
import { PatientController } from "./patient.controller";

const router = Router();


router.get(
    '/',
    PatientController.getAllFromDB
);

router.get(
    '/:id',
    PatientController.getByIdFromDB
);



export const PatientRoutes = router;