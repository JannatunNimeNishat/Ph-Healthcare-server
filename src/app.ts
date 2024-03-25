import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/User/user.routes";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middleWares/globalErrorHandler";
import cookieParser from "cookie-parser";
const app: Application = express();
app.use(cors());
app.use(express.json());
//parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Ph health case server...",
  });
});

app.use("/api/v1", router);

/* app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", AdminRoutes); */

//global error handler
app.use(globalErrorHandler);

//not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your request path is not found",
    },
  });
});

export default app;
