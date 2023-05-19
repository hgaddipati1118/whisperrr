"use client"
import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import {useEffect, useState} from "react";
import Loading from '@/components/Loading';
import Multiplechoice from '@/components/Multiplechoice';
import Multiplecheckbox from '@/components/Multiplecheckbox';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import genderOptions from '@/public/genderOptions';
import 'react-day-picker/dist/style.css';
export default function ProfileSetup(){
    // Stage 0 = change birthday
    // Stage 1 = change gender
    // Stage 2 = change preferred gender
    // Stage 3 = set preferred age range
    // Stage 4 = save profile
    const[stage, setStage] = useState(0);
    const[bday, setBday] = useState();
    const[id, setId] = useState();
    const[gender, setGender] = useState();
    const[max_preferred_age, setMaxPreferredAge] = useState();
    const[min_preferred_age, setMinPreferredAge] = useState();
    const[preferred_gender, setPreferredGender] = useState([]);
    const [selected, setSelected] = useState();
    const[profileLoaded, setProfileLoaded] = useState(false);
    const [minAgeError, setMinAgeError] = useState();
    const [maxAgeError, setMaxAgeError] = useState();
    //Footer used for date picker
    let footer = <p>Please pick a day.</p>;
    if (selected) {
        footer = <p>You picked {format(selected, 'PP')}.</p>;
    }
    const[loading, setLoading] = useState(true);

    //function to update all profile data values
    async function getProfile(){
        if(!profileLoaded){
            setLoading(true);
            await refreshSession(supabase);
            let userProfile = await getUserProfileData(supabase);
            setBday(userProfile.bday);
            if(bday){
                setSelected(new Date(bday));
            }
            setGender(userProfile.gender);
            setId(userProfile.id);
            setMaxPreferredAge(userProfile.max_preferred_age);
            setMinPreferredAge(userProfile.min_preferred_age);
            if(userProfile.preferred_gender){
                setPreferredGender(userProfile.preferred_gender.split("&"));
            }
            setLoading(false);
        }
        setProfileLoaded(true);
    }

    //fxns to update all the values
    function updateValue(e){
        if(e.target.name == "age"){
            setAge(e.target.value);
        } else if(e.target.name == "gender"){
            setGender(e.target.value);
        } else if(e.target.name == "max_preferred_age"){
            setMaxPreferredAge(e.target.value);
        } else if(e.target.name == "min_preferred_age"){
            setMinPreferredAge(e.target.value);
        } else if(e.target.name == "preferred_gender"){
            setPreferredGender(e.target.value);
        }
    }
    
    async function saveChanges(){
        setLoading(true);
        const { error } = await supabase
                          .from('profiles')
                          .update({ age: age, gender: gender,
                                  max_preferred_age: max_preferred_age,
                                  min_preferred_age: min_preferred_age,
                                preferred_gender: preferred_gender })
                          .eq('id', id)
                           ;
        setLoading(false);
        getProfile();
    }

    async function moveNextStage(i){
        setStage(stage + i);
        if(stage == 0){
            if(selected){
                setBday(format(selected,'P'));
                await supabase
                .from('profiles')
                .update({ bday: format(selected,'P') }).eq("id",id).select();
                ;
            }
        } else if (stage == 1){
            if(gender){
                await supabase
                .from('profiles')
                .update({ gender: gender }).eq("id",id);
            }
        } else if (stage == 2){
            if(preferred_gender){
                let preferred_gender_array = preferred_gender.join("&");
                await supabase
                .from('profiles')
                .update({ preferred_gender: preferred_gender_array }).eq("id",id)
                ;
                
            }
        } else if (stage == 3){
            let temp = min_preferred_age;
            if(min_preferred_age < 18 || min_preferred_age > 99){
                setMinPreferredAge(18);
                temp = 18;
            }
            await supabase
                .from('profiles')
                .update({ min_preferred_age: temp }).eq("id",id)
                ;
        } else if (stage == 4){
            let temp = max_preferred_age;
            if(max_preferred_age < min_preferred_age || max_preferred_age > 99){
                setMaxPreferredAge(min_preferred_age);
                temp = min_preferred_age;
            }
            await supabase
                .from('profiles')
                .update({ max_preferred_age: temp }).eq("id",id)
                ;
        }
        
    }
    //Effect to get profile from supabase
    useEffect(() => {
        getProfile()
      }, []);
    //Effect to make sure bday properly loaded
    useEffect(() => {
        if(bday){
            setSelected(new Date(bday));
        }
    } , [bday]);

    if(loading){
        return(<Loading />)
    }else{
        //Pick birthday
        if(stage == 0){
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

        //Enter gender
        if(stage == 1){
            
            return(
                <div className = "grid grid-cols-3 place-content-center">
                <div className = "w-24 mt-32 justify-self-end">
                    <img className = "flex-none" onClick = {() => moveNextStage(-1)} src = "left_chevron.png" />
                </div>
                <Multiplechoice questionInfo = {genderOptions} value = {gender} setValue = {(val) => setGender(val)} />
                <div className = "w-24 mt-32">
                    <img className = "flex-none" onClick = {() => moveNextStage(1)} src = "right_chevron.png" />
                </div>
                
                </div>
            )
        }
        let temp = genderOptions;
        temp.question = "Select the genders you're willing to date";
        //Enter preferred gender
        if(stage == 2){
            return(
                <div className = "grid grid-cols-3 place-content-center">
                <div className = "w-24 mt-32 justify-self-end">
                    <img className = "flex-none" onClick = {() => moveNextStage(-1)} src = "left_chevron.png" />
                </div>
                <Multiplecheckbox questionInfo = {temp} value = {preferred_gender} setValue = {(val) => setPreferredGender(val)} />
                <div className = "w-24 mt-32">
                    <img className = "flex-none" onClick = {() => moveNextStage(1)} src = "right_chevron.png" />
                </div>
                
                </div>
            )
        }

        
        //Enter min age
        function checkMinPreferredAge(e){
            setMinPreferredAge(e.target.value);
            if((e.target.value < 18 || e.target.value > 99)){
                setMinAgeError("Enter an age between 18-99");
            } else{
                setMinAgeError();
            }
        }
        if(stage == 3){
            return (
                <div>
                                    <div className = "text-white text-xl text-center mt-5 mb-3">
                    What is the lowest age you're willing to date?
                </div>
            <div className = "grid grid-cols-3 place-content-center">
                <div className = "w-24 mt-32 justify-self-end">
                    <img className = "flex-none" onClick = {() => moveNextStage(-1)} src = "left_chevron.png" />
                </div>
                <div>
                <input type = "number" min="18" placeholder = "18" value = {min_preferred_age} 
                onChange = {checkMinPreferredAge}
                className="leading-none text-[250px] text-center 
                bg-black text-gray-400 h-70 w-full" max="99" />
                <div className="text-white text-center ml-5"> {minAgeError} </div>
                </div>
                <div className = "w-24 mt-32">
                    <img className = "flex-none" onClick = {() => moveNextStage(1)} src = "right_chevron.png" />
                </div>
                
            </div>
            </div>
            )
        }

        //Enter max age
        function checkMaxPreferredAge(e){
            setMaxPreferredAge(e.target.value);
            if((e.target.value < min_preferred_age || e.target.value > 99)){
                setMaxAgeError("Enter an age between "+ min_preferred_age + "-99");
            } else{
                setMaxAgeError();
            }
        }
        if(stage == 4){
            return (
            <div>
                                    <div className = "text-white text-xl text-center mt-5 mb-3">
                    What is the highest age you're willing to date?
                </div>
            <div className = "grid grid-cols-3 place-content-center">
                <div className = "w-24 mt-32 justify-self-end">
                    <img className = "flex-none" onClick = {() => moveNextStage(-1)} src = "left_chevron.png" />
                </div>
                <div>
                <input type = "number" min={min_preferred_age} placeholder = {min_preferred_age} 
                value = {max_preferred_age} 
                onChange = {checkMaxPreferredAge}
                className="leading-none text-[250px] text-center 
                bg-black text-gray-400 h-70 w-full" max="99" />
                <div className="text-white text-center ml-5"> {maxAgeError} </div>
                </div>
                <div className = "w-24 mt-32">
                    <img className = "flex-none" onClick = {() => moveNextStage(1)} src = "right_chevron.png" />
                </div>
                
            </div>
            </div>
            )
        }
        let allGood = "You've finished setting up your profile!";
        let notAllGood = "One or more details are still missing from your profile";
            //Finish profile
            if(stage == 5){
                return (
                    <div className = "grid grid-cols-3 place-content-center">
                        <div className = "w-24 mt-32 justify-self-end">
                    <img className = "flex-none" onClick = {() => moveNextStage(-1)} src = "left_chevron.png" />
                </div>
                <div>
                        <div className = "text-white text-center text-4xl py-5"> {(bday && (preferred_gender.length > 0) && 
                        min_preferred_age && gender && max_preferred_age)?allGood:notAllGood}</div>
                        <div className = "mx-auto bg-amber-700 rounded-xl py-5 w-1/4 text-center">
                        <a href = "/" className = "text-white text-center text-2xl"> Save Profile </a>
                        </div>
                </div>
                </div>
                )
            }
        

    }
}