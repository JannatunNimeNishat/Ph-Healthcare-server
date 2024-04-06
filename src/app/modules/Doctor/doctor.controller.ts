import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { DoctorService } from "./doctor.service";

const getDoctors = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.getSpecialtiesFromDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctors fetched successfully",
      data: result
    });
  });

  export const DoctorController ={
    getDoctors
  }