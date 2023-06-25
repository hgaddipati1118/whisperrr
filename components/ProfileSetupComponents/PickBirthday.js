
import { format } from 'date-fns';
import ProfileSetUpStageButtons from "@/components/ProfileSetupComponents/ProfileSetUpStageButtons.js";
import { DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {useEffect, useState} from "react";
import dayjs from 'dayjs';
export default function PickBirthday({moveNextStage, selected, setSelected}){
    const [startDate, setStartDate] = useState(selected);
    //Footer used for date picker
    let footer = <p>Please pick a day.</p>;
    if (selected) {
        footer = <p>You picked {format(selected, 'PP')}.</p>;
    }
    return(<div> 
        <div className = "text-center text-white text-xl mt-5 mb-3">
        Select your birthday
        </div>
        <div className = "flex justify-center px-12" >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar defaultValue={dayjs('2002-04-17')} 
        onChange = {(date) => {setStartDate(date.toDate()); setSelected(date.toDate())} } 
        minDate = {dayjs(new Date(1900,1,1))}
        maxDate={dayjs(new Date(new Date().setDate(new Date().getDate() - 18*365)))}
        />
        </LocalizationProvider>
        </div>
        <div className = "text-center text-white mt-3">
        {footer}
        </div>
        
        <ProfileSetUpStageButtons back = {false} next = {true} moveNextStage = {(stage) => moveNextStage(stage)} />
    </div>)
}