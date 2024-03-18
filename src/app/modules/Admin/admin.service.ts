import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAdminFromDB = async (prams: any) => {
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
  const adminSearchAbleField = ["name", "email"];
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
  });
  return result;
};

export const adminService = {
  getAdminFromDB,
};
