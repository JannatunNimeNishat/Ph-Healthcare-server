import { Router } from "express";
import { userController } from "./user.controller";

import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";

const router = Router();



router.post("/", auth(UserRole.SUPER_ADMIN,UserRole.ADMIN), userController.createAdmin);



export const userRoutes = router;
