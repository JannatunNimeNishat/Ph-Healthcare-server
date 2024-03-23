import { NextFunction, Request, Response, Router } from "express";
import { adminController } from "./admin.controller";
import z, { AnyZodObject } from "zod";
import validateRequest from "../../middleWares/validateRequest";
const router = Router();

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});



router.get("/", adminController.getAllAdmin);

router.get("/:id", adminController.getById);

router.patch("/:id", validateRequest(update), adminController.updateAdmin);

router.delete("/:id", adminController.deleteAdmin);

router.delete("/soft/:id", adminController.softDeleteAdmin);

export const AdminRoutes = router;
