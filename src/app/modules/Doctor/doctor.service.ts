import prisma from "../../../shared/prisma";

const getSpecialtiesFromDB = async()=>{
    const result = await prisma.doctor.findMany();
    return result;
}


export const DoctorService = {
    getSpecialtiesFromDB
}