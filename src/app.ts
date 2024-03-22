import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/User/user.routes";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middleWares/globalErrorHandler";

const app: Application = express();
app.use(cors());
app.use(express.json());
//parser
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
export default app;
