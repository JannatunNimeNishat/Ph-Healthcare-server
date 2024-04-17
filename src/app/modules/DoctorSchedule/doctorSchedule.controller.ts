import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const createDoctorSchedule = catchAsync(async (req: Request & {user?:IAuthUser},  res: Response) => {
    const user = req.user;
  
    const result = await DoctorScheduleService.createDoctorScheduleIntoDB(user,req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedule created successfully",
      data: result
    });
  });


  const getMySchedule = catchAsync(async (req: Request & {user?:IAuthUser} , res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate",'isBooked']);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await DoctorScheduleService.getMyScheduleFromDB(filters, options,user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule fetched successfully",
      data: result,
    });
  });

  const deleteSchedule = catchAsync(async (req: Request & {user?:IAuthUser} , res: Response) => {
    const {id} = req.params;
    const user = req.user;
    const result = await DoctorScheduleService.deleteScheduleFromDB(user as IAuthUser,id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule deleted successfully",
      data: result,
    });
  });




  export const DoctorScheduleController = {
    createDoctorSchedule,
    getMySchedule,
    deleteSchedule
  }