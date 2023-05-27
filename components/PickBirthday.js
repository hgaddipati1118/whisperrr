
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import {useEffect, useState} from "react";
import 'react-day-picker/dist/style.css';
export default function PickBirthday({moveNextStage, selected, setSelected}){
    //Footer used for date picker
    let footer = <p>Please pick a day.</p>;
    if (selected) {
        footer = <p>You picked {format(selected, 'PP')}.</p>;
    }
    return(<div> 
        <div className = "text-center text-white text-xl mt-5 mb-3">
        Select your birthday
        </div>
        <div className = "grid grid-cols-8" >
        <div className = "col-span-5 pt-3 bg-amber-700 w-2/5 rounded-lg justify-self-end">
            <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            fixedWeeks
            fromYear = {1985}
            toYear = {2005}
            defaultMonth={new Date(2002, 8)}
            captionLayout = "dropdown-buttons"
            className = "text-l h-70"
            />
        </div>
        <div className = "w-24 mt-32 col-span-1">
            <img className = "flex-none" onClick = {() => moveNextStage(1)} src = "right_chevron.png" />
        </div>
        </div>
        <div className = "text-center text-white">
        {footer}
        </div>
    </div>)
}