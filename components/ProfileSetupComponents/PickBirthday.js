
import { format } from 'date-fns';
import ProfileSetUpStageButtons from "@/components/ProfileSetupComponents/ProfileSetUpStageButtons.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useEffect, useState} from "react";
import 'react-day-picker/dist/style.css';
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
        <div className = "flex justify-center" >
        <div className = "pt-3 text-xl">
            <DatePicker
        selected={startDate}
        dateFormat="MMM d, Y"
        onChange={(date) => {setStartDate(date); setSelected(date)} }
        minDate = {new Date(1900,1,1)}
        maxDate={new Date(new Date().setDate(new Date().getDate() - 18*365))}
        isClearable
        inline
        placeholderText="Enter Birthday"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        />
        </div>
        </div>
        <div className = "text-center text-white mt-3">
        {footer}
        </div>
        <ProfileSetUpStageButtons back = {false} next = {true} moveNextStage = {(stage) => moveNextStage(stage)} />
    </div>)
}