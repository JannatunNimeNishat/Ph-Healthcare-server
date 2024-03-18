import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createAdminIntoDB = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data?.password, 12);

  const userData = {
    email: data?.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    // query-1
    //note: acan e password ase tai response e send kora hosce na.
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
