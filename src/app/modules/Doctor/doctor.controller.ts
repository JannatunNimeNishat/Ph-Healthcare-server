import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { DoctorService } from "./doctor.service";

const getDoctors = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.getDoctorsFromDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctors fetched successfully",
      data: result
    });
  });
const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await DoctorService.getSingleDoctorFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor fetched successfully",
      data: result
    });
  });

  export const DoctorController ={
    getDoctors,
    getSingleDoctor
  }