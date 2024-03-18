import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAdminFromDB = async (prams: any) => {
  //   console.log({ prams });
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
  const adminSearchAbleField = ["name", "email"];
  if (prams?.searchTerm) {
    andConditions.push({
      OR: adminSearchAbleField.map((field) => ({
        [field]: {
          contains: prams?.searchTerm,
          mode: "insensitive",
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
