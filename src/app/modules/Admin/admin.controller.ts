import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
    /* res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    }); */
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await adminService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched by id!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await adminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched by id!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await adminService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data deleted!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await adminService.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data deleted!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getAllAdmin,
  getById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
