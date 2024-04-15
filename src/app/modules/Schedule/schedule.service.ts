import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { Schedule } from "@prisma/client";

const createScheduleIntoDB = async (payload: any):Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;
    const schedules = [];
  const currentData = new Date(startDate); // start date
  const lastDate = new Date(endDate); // end date

  while (currentData <= lastDate) {
    // looping from incoming start to end date
    // adding time to the date
    const startDateTime = new Date(
      addMinutes(
        addHours(
            `${format(currentData, "yyyy-MM-dd")}`,
            Number(startTime.split(":")[0])
          ),
          Number(startTime.split(":")[1])
      )
    );
    // adding time to the date
    const endDateTime = new Date(
      addMinutes(
        addHours(
            `${format(currentData, "yyyy-MM-dd")}`,
            Number(endTime.split(":")[0])
          ),
          Number(endTime.split(":")[1])
      )
    );
    // looping through each days startDateTime and endDateTime
    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };
    //   checking is already exists
      const existingSchedule = await prisma.schedule.findFirst({
        where:{
            startDateTime: scheduleData.startDateTime,
            endDateTime:scheduleData.endDateTime
        }
      })

      if(!existingSchedule){
        const result = await prisma.schedule.create({
            data: scheduleData,
          });
          schedules.push(result)
      }
      
      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }
    currentData.setDate(currentData.getDate() + 1);
  }
  return schedules;
};

export const ScheduleService = {
  createScheduleIntoDB,
};
