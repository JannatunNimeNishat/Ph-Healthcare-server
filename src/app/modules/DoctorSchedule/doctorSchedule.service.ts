import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const createDoctorScheduleIntoDB = async (
  user: any,
  payload: { scheduleIds: string[] }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getMyScheduleFromDB = async (
  filters: any,
  options: any,
  user: IAuthUser
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const andConditions = [];

  // filtering with start and end date time
  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }
  //   filters
  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.DoctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    // where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const DoctorScheduleService = {
  createDoctorScheduleIntoDB,
  getMyScheduleFromDB,
};
