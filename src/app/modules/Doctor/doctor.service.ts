import { Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IDoctorFilterRequest } from "./doctor.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";

/* const getDoctorsFromDB = async () => {
  const result = await prisma.doctor.findMany();
  return result;
}; */

const getDoctorsFromDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties,...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
      andConditions.push({
          OR: doctorSearchableFields.map(field => ({
              [field]: {
                  contains: searchTerm,
                  mode: 'insensitive',
              },
          })),
      });
  }
  //doctor > doctorSpecialties > specialties -> title
  if (specialties && specialties.length > 0) {
      andConditions.push({
          doctorSpecialties: {
              some: {
                specialties: {
                      title: {
                          contains: specialties,
                          mode: 'insensitive',
                      },
                  },
              },
          },
      });
  }

  if (Object.keys(filterData).length > 0) {
      const filterConditions = Object.keys(filterData).map(key => ({
          [key]: {
              equals: (filterData as any)[key],
          },
      }));
      andConditions.push(...filterConditions);
  }

  andConditions.push({
      isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { createdAt: 'desc' },
      include: {
          doctorSpecialties: {
              include: {
                  specialties:true
                  // specialities: true
              }
          }
      },
  });

  const total = await prisma.doctor.count({
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


const getSingleDoctorFromDB = async (id: string) => {
  const result = await prisma.doctor.findFirstOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const updateDoctorIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;
  const doctorInfo = await prisma.doctor.findFirstOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
     await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });
    if (specialties && specialties.length > 0) {
      // delete specialties
      const deleteSpecialtiesIds = specialties.filter(
        (specialty: any) => specialty.isDeleted
      );
      for (const specialty of deleteSpecialtiesIds) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
      //create specialties
      const createSpecialtiesIds = specialties.filter(
        (specialty: any) => !specialty.isDeleted
      );
      for (const specialty of createSpecialtiesIds) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include:{
            specialties:true
        }
      },
    },
  });
  return result;
};

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
  softDeleteDoctorFromDB,
  updateDoctorIntoDB,
};
