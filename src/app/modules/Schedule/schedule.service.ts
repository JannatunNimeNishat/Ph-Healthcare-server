import {addHours, format} from 'date-fns';

const createScheduleIntoDB = async (payload:any) => {
    const {startDate, endDate, startTime, endTime} = payload;

    const currentData = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while(currentData <= lastDate){
        const startDateTime = new Date(
            addHours(
                `${format(currentData, 'yyyy-MM-dd')}`,
                Number(startTime.split(':')[0])
            )
        )
        const endDateTime = new Date(
            addHours(
                `${format(lastDate, 'yyyy-MM-dd')}`,
                Number(endTime.split(':')[0])
            )
        )

        while(startDateTime<endDateTime){
            
        }
    }
}

export const ScheduleService = {
    createScheduleIntoDB
}