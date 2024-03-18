import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    //amader tik kore deya field er bahirer field gulo asle jate pick na kore, saijonno req.query ta ke filter kore neya hosce pick function deya
    const filters = pick(req.query, [
      "name",
      "email",
      "searchTerm",
      "contactNumber",
    ]);

    const result = await adminService.getAdminFromDB(filters);

    res.status(200).json({
      success: true,
      message: "Admin data fetched",
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

export const adminController = {
  getAllAdmin,
};
