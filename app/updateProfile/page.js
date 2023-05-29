"use client";
import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import Signout from '@/components/Signout';
import Header from '@/components/Header';
import Conversation from '@/components/Conversation';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import Loading from '@/components/Loading';
import Title from '@/components/Title';
import ProfileSetup from '@/components/ProfileSetup';
export default function App() {
  const[profile, setProfile] = useState([]);
    const[loading, setLoading] = useState(true);
    useEffect(() => {
        getProfile();
      }, []);
    async function getProfile(){
        setLoading(true);
        let userProfile = await getUserProfileData(supabase)
        setProfile(userProfile);
        setLoading(false);
    }
    if(loading){
        return(
            <div>
        <Title tailwind = "text-6xl" /> 
        <Loading />
        </div>);
    }
        return(
            <div>
                <Title tailwind = "text-4xl text-center mt-3" />
                <ProfileSetup />
            </div>
        )
}
