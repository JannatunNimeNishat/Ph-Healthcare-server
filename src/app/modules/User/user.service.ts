import { PrismaClient, UserRole } from "@prisma/client";
const prisma = new PrismaClient();

const createAdminIntoDB = async (data: any) => {
  const userData = {
    email: data?.admin.email,
    password: data?.password,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    // query-1
    await transactionClient.user.create({
      data: userData,
    });
    //query-2
    const createdAdminData = await transactionClient.admin.create({
      data: data.admin, //coming from input of this service function
    });
    return createdAdminData;
  });

  return result;
};

export const userService = {
  createAdminIntoDB,
};
