import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";



const getAllAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //amader tik kore deya field er bahirer field gulo asle jate pick na kore, saijonno req.query ta ke filter kore neya hosce pick function deya
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(options);
    const result = await adminService.getAdminFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched",
      meta: result.meta,
      data: result.data,
    });
    /* res.status(200).json({
      success: true,
      message: "Admin data fetched",
      meta: result.meta,
      data: result.data,
    }); */
  }
);

const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await adminService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched by id!",
      data: result,
    });
  }
);

const updateAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await adminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched by id!",
      data: result,
    });
  }
);

const deleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await adminService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data deleted!",
      data: result,
    });
  }
);

const softDeleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await adminService.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data deleted!",
      data: result,
    });
  }
);

export const adminController = {
  getAllAdmin,
  getById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
