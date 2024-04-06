import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getDoctorsFromDB = async()=>{
    const result = await prisma.doctor.findMany();
    return result;
}
const getSingleDoctorFromDB = async(id:string)=>{
    const result = await prisma.doctor.findFirstOrThrow({
        where:{
            id
        }
    });
    return result;
}

const deleteDoctorFromDB = async (id: string) => {
  
    await prisma.doctor.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    const result = await prisma.$transaction(async (transactionClient) => {
      const doctorDeletedData = await transactionClient.doctor.delete({
        where: {
          id: id,
        },
      });
  
      await transactionClient.user.delete({
        where: {
          email: doctorDeletedData.email,
        },
      });
      return doctorDeletedData;
    });
    return result;
  };
  
  const softDeleteDoctorFromDB = async (id: string) => {
    await prisma.doctor.findUniqueOrThrow({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    const result = await prisma.$transaction(async (transactionClient) => {
      const doctorDeletedData = await transactionClient.doctor.update({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
        },
      });
  
      await transactionClient.user.update({
        where: {
          email: doctorDeletedData.email,
        },
        data: {
          status: UserStatus.DELETED,
        },
      });
      return doctorDeletedData;
    });
    return result;
  };

export const DoctorService = {
    getDoctorsFromDB,
    getSingleDoctorFromDB,
    deleteDoctorFromDB,
    softDeleteDoctorFromDB
}