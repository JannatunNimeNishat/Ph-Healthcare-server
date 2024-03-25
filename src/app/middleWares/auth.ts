import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }
      const inComingDecodedTokenData = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );

      if (roles.length && !roles.includes(inComingDecodedTokenData?.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "FORBIDDEN!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
