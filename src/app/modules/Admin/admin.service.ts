import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleField } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAdminFromDB = async (
  prams: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = prams;
  const andConditions: Prisma.AdminWhereInput[] = [];
  /* [
    {
      name: {
        contains: prams?.searchTerm,
        mode: "insensitive",
      },
    },
    {
      email: {
        contains: prams?.searchTerm,
        mode: "insensitive",
      },
    },
  ], */

  //1. search
  if (searchTerm) {
    andConditions.push({
      OR: adminSearchAbleField.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //2. filter
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          // equals: filterData[key],
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  //3. remove the users with  isDeleted=true
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  // checking the user is exists or not and also isDeleted or not.
  await prisma.admin.findUniqueOrThrow({
    where: { id: id, isDeleted: false },
  });

  const result = await prisma.admin.update({
    where: {
      id: id,
    },
    data: data,
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
  // checking the user is exists or not.
  await prisma.admin.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id: id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });
  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  // checking the user is exists or not. Or is already deleted
  await prisma.admin.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
};

export const adminService = {
  getAdminFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};

/** pagination logic
 * data = 1 2 3 4 5 6 7 8
 * page = 2
 * limit = 3
 *
 * skip = 3
 * formula = (page -1) * limit
 * (2-1)*3 = 3
 *
 */
