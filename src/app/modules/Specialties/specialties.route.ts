import { NextFunction, Request, Response, Router } from "express";
import { SpecialtiesController } from "./specialties.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialtiesValidation } from "./specialties.validation";

const router = Router();

router.get('/',SpecialtiesController.getSpecialties)

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.create.parse( JSON.parse(req.body.data))
    return SpecialtiesController.createSpecialties(req, res, next);
  }
);

router.delete('/:id',SpecialtiesController.deleteSpecialties)

export const SpecialtiesRoutes = router;
