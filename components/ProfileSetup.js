"use client"
import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import {useEffect, useState} from "react";
import Loading from '@/components/Loading';
import Link from 'next/link';
import { format } from 'date-fns';
import PickGender from "@/components/ProfileSetupComponents/PickGender.js";
import PickPreferredGenders from '@/components/ProfileSetupComponents/PickPreferredGenders';
import PickAge from "@/components/ProfileSetupComponents/PickAge.js";
import 'react-day-picker/dist/style.css';
import PickBirthday from "@/components/ProfileSetupComponents/PickBirthday.js";
import ProfileSetUpStageButtons from "@/components/ProfileSetupComponents/ProfileSetUpStageButtons.js";
import {formatBday, formatGender, formatPreferredGender} from "@/helpers/profileDataHelpers.js";
import ProfileItem from "@/components/ProfileItem";

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
    const [selected, setSelected] = useState(new Date(2002,2,23));
    const[profileLoaded, setProfileLoaded] = useState(false);
    const [minAgeError, setMinAgeError] = useState();
    const [maxAgeError, setMaxAgeError] = useState();
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
                <PickBirthday moveNextStage={(inc) => moveNextStage(inc)} 
                selected = {selected} setSelected={(selected) => setSelected(selected)} />
            </div>)
        }

        //Enter gender
        if(stage == 1){
            
            return(
                <PickGender moveNextStage = {(inc) => moveNextStage(inc)}
                gender = {gender} setGender = {(gender) => setGender(gender)} />
            )
        }
        //Enter preferred gender
        if(stage == 2){
            return(
                <PickPreferredGenders moveNextStage = {(inc) => moveNextStage(inc)} 
                 preferred_gender={preferred_gender} setPreferredGender={(gender) => setPreferredGender(gender)}/>
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
              <PickAge moveNextStage = {(inc) => moveNextStage(inc)} age = {min_preferred_age}
                ageError = {minAgeError} checkAge = {(e) => checkMinPreferredAge(e)}
                title = "What is the lowest age you are willing to date?"
              />
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
                <PickAge moveNextStage = {(inc) => moveNextStage(inc)} age = {max_preferred_age}
                ageError = {maxAgeError} checkAge = {(e) => checkMaxPreferredAge(e)}
                title = "What is the highest age you are willing to date?"
              />
            )
        }
        let allGood = "Review your profile information";
        let notAllGood = "One or more details are still missing from your profile";
            //Finish profile
            if(stage == 5){
                return (
                    <div>
                        
                <div>
                    <div className ="flex justify-center">
                        <div className = "text-white text-center text-2xl py-5 w-2/3"> {(bday && (preferred_gender.length > 0) && 
                        min_preferred_age && gender && max_preferred_age)?allGood:notAllGood}</div>
                        </div>
                        <div className ="flex justify-center">
                        <ProfileItem value = {formatBday(bday)} valueTitle = "Birthday" />
                        </div>
                        <div className ="flex justify-center">
                        <ProfileItem value = {formatGender(gender)} valueTitle = "Gender" />
                        </div>
                        <div className ="flex justify-center">
                        <ProfileItem value = {formatPreferredGender(preferred_gender)} valueTitle = "Preferred Genders" />
                        </div>
                        <div className ="flex justify-center">
                        <ProfileItem value = {min_preferred_age} valueTitle = "Minimum age to date" />
                        </div>
                        <div className ="flex justify-center">
                        <ProfileItem value = {max_preferred_age} valueTitle = "Maximum age to date" />
                        </div>
                        
                        
                        
                        <div className="flex justify-center"> 
                        <Link href="/home" className = "text-white text-center text-xl"> 
                        <div className = "mx-auto bg-amber-700 rounded-xl py-2 px-2 mt-2 w-fit text-center">
                        Save Profile 
                        </div>
                        </Link>
                        </div>
                </div>
                <ProfileSetUpStageButtons back = {true} moveNextStage={(inc) => moveNextStage(inc)} />
                </div>
                )
            }
        

    }
}