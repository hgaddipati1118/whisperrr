"use client";
import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import { useEffect, useState } from 'react';
import questionList from '@/public/questionList.js';
import Loading  from '@/components/Loading';
import Multiplechoice from '@/components/Multiplechoice';
import Header from '@/components/Header'
/*
 ** Stuff to do
 *** On load generate random number to pick question
 *** Display question
 *** Save answer choice
 *** Submit question
 *** Repeat
 *** States needed (question, loading, answer)
*/
export  default function Questions(){
    const [question, setQuestion] = useState();
    const [profile, setProfile] = useState();
    const [loading,setLoading] = useState(true);
    useEffect(
        () => {setUp()}
        , []
    );

    async function setUp(){
        console.log("HI");
        setLoading(true);
        setProfile(await getUserProfileData(supabase));
        getQuestion();
        setLoading(false);
    }

    function getQuestion(){
        let temp = questionList[Math.floor(Math.random()*questionList.length)];
        setQuestion(temp);
        console.log(temp)
    }
    if(loading){
        return(
            <Loading />
        )
    
    } 
    
    async function submit(ans){
        if(profile.id != null && ans != null){
            let oldQuestion = question;
            getQuestion();
            const {error} = await supabase.from("questions").
            insert({qID: oldQuestion.id, answer: ans, u_id: profile.id});
            console.log("submitted");

        }
     } 
     let dummy = "";
    return(<div>
        <Header/>
        <div className ="mx-32">
        <Multiplechoice questionInfo={question} value = {dummy} setValue={submit} 
        width = "w-2/5" />
        </div>
    </div>
    );
}