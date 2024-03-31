import { Router } from "express";
import { userController } from "./user.controller";
import multer from 'multer'
import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single('file'),
  userController.createAdmin
);

export const userRoutes = router;
