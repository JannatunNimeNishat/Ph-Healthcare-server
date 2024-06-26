import { Request, Response } from "express";

import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { SpecialtiesService } from "./specialties.service";
import catchAsync from "../../../shared/catchAsync";


const createSpecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.createSpecialtiesIntoDB(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Specialties created successfully",
      data: result
    });
  });
  
const getSpecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.getSpecialtiesFromDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Specialties fetched successfully",
      data: result
    });
  });
  
const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await SpecialtiesService.deleteSpecialtiesFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Specialties deleted successfully",
      data: result
    });
  });
  
  export const SpecialtiesController ={
    createSpecialties,
    getSpecialties,
    deleteSpecialties
  }