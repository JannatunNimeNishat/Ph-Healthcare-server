import { Prisma } from "@prisma/client";
import { adminSearchAbleField } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";

const getAdminFromDB = async (prams: any, options: any) => {
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
          equals: filterData[key],
        },
      })),
    });
  }

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
    where:whereConditions
  })
  return {
    meta: {
      page,
      limit,
      total
    },
    data: result,
  };
};


const getByIdFromDB = async(id:string)=>{
  const result = await prisma.admin.findUnique({
    where:{
      id:id
    }
  })
  return result;
}


export const adminService = {
  getAdminFromDB,
  getByIdFromDB
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
