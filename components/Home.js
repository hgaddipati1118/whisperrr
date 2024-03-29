import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import Header from '@/components/Header';
import Conversation from '@/components/Conversation';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import Loading from '@/components/Loading';
import Title from '@/components/Title';
import ProfileSetup from '@/components/ProfileSetup';
export default function Home({user, setState}){
    //Stage 0: need to finish profile
    //Stage 1: No match so answer question
    //Stage 2: Has match so text
    //Stage 3: Rate match
    const[stage, setStage] = useState(0);
    const[profile, setProfile] = useState([]);
    const[loading, setLoading] = useState(true);
    useEffect(() => {
        getProfile();
      }, []);
    async function getProfile(){
        setLoading(true);
        let userProfile = await getUserProfileData(supabase);
        console.log(userProfile)

        setProfile(userProfile);
        let profileKeys = ["bday", "gender", "min_preferred_age","max_preferred_age","preferred_gender"];
        console.log(userProfile);
        if(profileKeys.every(key => userProfile[key] != null)){
            if(userProfile["in_conversation"]){
                setStage(2);
            }
            else{
                setStage(1);
            }
        }
        setLoading(false);
    }
    if(loading){
        return(
            <div>
        <Title tailwind ="text-center text-6xl" /> 
        <Loading />
        </div>);
    }
    if(stage == 0){
        return(
            <div>
                <Title tailwind ="text-4xl text-center" />
                <ProfileSetup />
            </div>
        )
    } else if (stage == 1) {
        return(
            <div className="grid grid-cols-1 justify-items-center">
                <Header />
                <div className = "text-white text-center text-xl w-2/3 md:text-2xl py-6"> Right now we do not have a match for you :(</div>
                <div className = "text-white text-center text-l md:text-xl w-2/3 md:w-1/3 mx-auto"> To improve your chances of getting a match answer some questions</div>
                <Link className="justify-self-center bg-amber-700 w-2/3 md:w-1/3 mx-auto my-6 
                py-3 rounded-lg text-xl text-center text-white" 
                href = "/questions"> Answer questions </Link>
            </div>
        )
    } else if(stage == 2){
        return (
        <div className = "w-screen overflow-x-hidden h-screen">
            <Header  />
            <Conversation user = {profile} setStage = {(stage) => setStage(stage)} />
        </div>
        );
    }
}