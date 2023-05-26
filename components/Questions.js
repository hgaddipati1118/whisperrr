"use client";
import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import { useEffect, useState } from 'react';
import questionList from '@/public/questionList.js';
import Loading  from '@/components/Loading';
import Multiplechoice from '@/components/Multiplechoice';
import Header from '@/components/Header'
import tailwindConfig from '@/tailwind.config';
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
    const [questionData, setQuestionData] = useState();
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

    async function getQuestion(){
        let temp = questionList[Math.floor(Math.random()*questionList.length)];
        setQuestion(temp);
        const{data, error} = await supabase.from("question_data").select("*").eq("id",temp.id).single();
        setQuestionData(data);
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
            await supabase.from("questions").
            insert({qID: oldQuestion.id, answer: ans, u_id: profile.id});
            //Time to update personality values of user
            let option = questionData.data.options[parseInt(ans)];
            let traits = option.optionTraits;
            let userTraits = profile.personality;
            console.log(questionData);
            if(!userTraits){
                userTraits = {};
            }
            console.log(userTraits);
            traits.forEach(trait => {
                if(!userTraits[trait.traitName] || userTraits[trait.traitName] == undefined || isNaN(userTraits[trait.traitName])){
                    userTraits[trait.traitName] = 0;
                }
                userTraits[trait.traitName] += parseInt(trait.traitValue);
            });

            let temp = profile;
            temp.personality = userTraits;
            setProfile(temp);
            await supabase.from("profiles").update({"personality": userTraits}).eq("id",profile.id);
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