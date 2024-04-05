import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.createAdminIntoDB(req);
    res.status(200).json({
      success: true,
      message: "Admin created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};
const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const result = await userService.createDoctorIntoDB(req);
    res.status(200).json({
      success: true,
      message: "Doctor created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};
const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const result = await userService.createPatientIntoDB(req);
    res.status(200).json({
      success: true,
      message: "Patient created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

export const userController = {
  createAdmin,
  createDoctor,
  createPatient
};
