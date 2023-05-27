import {supabase, getUserProfileData} from "@/helpers/supabaseHelpers";
import { format } from 'date-fns';
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import Title from "@/components/Title";
import ProfileItem from "@/components/ProfileItem";
import {useState, useEffect} from "react";
import Link from "next/link";
export default function Profile(){
    const [loading,setLoading] = useState(true);
    const [profile, setProfile] = useState();
    async function getProfile(){
        console.log("hi");
        while(loading){
            let user = await getUserProfileData(supabase);
            user.bday = format(new Date(user.bday), "PP");
            console.log(user.gender);
            if(user.gender == "M"){
                user.gender = "Male";
            }
            if(user.gender == "F"){
                user.gender = "Female";
            }
            if(user.gender == "NB"){
                user.gender = "Non-Binary";
            }
            if(user.gender == "O"){
                user.gender = "Other";
            }
            user.preferred_gender = user.preferred_gender.split("&");
            user.preferred_gender = user.preferred_gender.map((gender)=>(gender == "M")?"Male":((gender == "F")?"Female":(gender == "NB"?"Non-Binary":"Other")));
            user.preferred_gender.sort();
            let genderString = user.preferred_gender[0];
            for(let i = 1; i<user.preferred_gender.length; i++){
                genderString += ", " + user.preferred_gender[i];
            }
            user.preferred_gender = genderString;
            setProfile(user);
            console.log(user);
            if(user){
                setLoading(false);
                return;
            }
        }
    }
    useEffect(
        () => {
            getProfile();
        },[]
    )
    if(loading){
        return (<div>
            <Title />
            <Loading />
            </div>
        )
    }
    return(
        <div>
            <Header />
        <div className = "ml-36">
            <div className = "text-3xl py-6 text-white"> Profile </div>
            <ProfileItem value = {profile.bday} valueTitle = "Birthday" />
            <ProfileItem value = {profile.gender} valueTitle = "Gender" />
            <ProfileItem value = {profile.preferred_gender} valueTitle = "Preferred Genders" />
            <ProfileItem value = {profile.min_preferred_age} valueTitle = "Minimum age to date" />
            <ProfileItem value = {profile.max_preferred_age} valueTitle = "Maximum age to date" />
            <ProfileItem value = {profile.q_score.toLocaleString("en-US")} valueTitle = "Q-Score" />
            <ProfileItem value = {new String(profile.questions_answered).toLocaleString("en-US")} valueTitle = "Questions Answered" />
            <ProfileItem value = {profile.average_rating == -1?"N/A":profile.average_rating} valueTitle = "Average Rating" />
        </div>
        
        <Link className = "text-white" href="/updateProfile">
        <div className = "bg-amber-700 ml-36 rounded-lg w-1/6 text-center text-size-5xl"> Edit Profile
        </div>
        </Link>
        </div>

    )
}