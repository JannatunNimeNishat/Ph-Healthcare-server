import { Router } from "express";
import { userController } from "./user.controller";

import auth from "../../middleWares/auth";

const router = Router();



router.post("/", auth('ADMIN',"SUPER_ADMIN"), userController.createAdmin);



export const userRoutes = router;
