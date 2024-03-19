import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleField } from "./admin.constant";

const prisma = new PrismaClient();

const getAdminFromDB = async (prams: any, options: any) => {
  const { limit, page } = options;
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
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  return result;
};

export const adminService = {
  getAdminFromDB,
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
