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
const ALPHABET = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
const ALPHABET2 = ['a', 'b', 'c','d','e','f','g','h','i','j','k','l','m','n','o','p',
'q','r','s','t','u','v','w','x','y','z'];

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
    useEffect(() => {
        window.addEventListener("keyup", handleKeyPress);
    
        return () => {
          window.removeEventListener("keyup", handleKeyPress);
        };
      }, );
    if(loading){
        return(
            <div>
            <Header />
            <Loading />
            </div>
        )
    
    }

    

    async function handleKeyPress(e){
        let numOptions = questionData.data.options.length;
        let value = ALPHABET.indexOf(e.key);
        if(value == -1){
            value = ALPHABET2.indexOf(e.key);
        }
        if(value >= 0 && value < numOptions){
            submit(value);
        }
    }
    
    async function submit(ans){
        if(profile.id != null && ans != null){
            let oldQuestion = question;
            getQuestion();
            const{error} = await supabase.from("questions").
            insert({qID: oldQuestion.id, answer: ans, u_id: profile.id});
            console.log(error);
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
            await supabase
            .rpc('update_user_q', {"user_id":profile.id});
            console.log(error)
        }
     } 
     let dummy = "-1";
    return(<div className = "w-content h-content pb-6 overflow-hidden">
        <Header/>
        <div className ="px-8 md:px-24">
        <Multiplechoice questionInfo={question} value = {dummy} setValue={submit} 
        width = " w-11/12 md:w-2/3" />
        </div>
    </div>
    );
}