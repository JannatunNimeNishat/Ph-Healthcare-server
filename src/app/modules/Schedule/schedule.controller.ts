import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ScheduleService } from "./schedule.service";
import pick from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.createScheduleIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedule = catchAsync(async (req: Request & {user?:IAuthUser} , res: Response) => {
  const filters = pick(req.query, ["startDate", "endDate"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const user = req.user;
  const result = await ScheduleService.getAllScheduleFromDB(filters, options,user as IAuthUser);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule fetched successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedule,
};
