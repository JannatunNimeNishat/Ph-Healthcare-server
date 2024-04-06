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


export const DoctorService = {
    getDoctorsFromDB,
    getSingleDoctorFromDB
}