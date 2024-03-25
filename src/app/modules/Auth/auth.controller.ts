import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUserIntoDB(req.body);
  // setting the refresh token to cookies
  const {refreshToken}= result;
  res.cookie('refreshToken',refreshToken,{
    secure:false, //true when it is no the production
    httpOnly:true
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken:result.accessToken,
      needPasswordChange:result.needPasswordChange
    },
  });
});

export const authController = {
  loginUser,
};
