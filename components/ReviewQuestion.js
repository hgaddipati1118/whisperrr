"use client";
import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import { useEffect, useState } from 'react';
import questionList from '@/public/questionList.js';
import Loading  from '@/components/Loading';
import Multiplechoice from '@/components/Multiplechoice';
import Header from '@/components/Header'
/*
 ** Stuff to do
 *** On load generate not reviewed question
 *** Display question
 *** Decide whether to keep or delete question
 *** Save question
 *** Repeat
 ***
*/
const ALPHABET = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
const ALPHABET2 = ['a', 'b', 'c','d','e','f','g','h','i','j','k','l','m','n','o','p',
'q','r','s','t','u','v','w','x','y','z'];

export  default function Questions(){
    const [question, setQuestion] = useState();
    const [questionText, setQuestionText] = useState();
    const [questionData, setQuestionData] = useState();
    const [loading,setLoading] = useState(true);
    useEffect(
        () => {setUp()}
        , []
    ); 

    async function setUp(){
        setLoading(true);
        await getQuestion();
        setLoading(false);
    }
    async function getQuestion(){
        const{data, error} = await supabase.from("question_data").select("*").lt("reviewed",1).limit(1);        
        console.log(error, data);
        for(let i = 0; i<questionList.length; i++){
            if(questionList[i].id == data[0].id){
                setQuestion(questionList[i]);
                setQuestionText(questionList[i].question);
            }
        }
        setQuestionData(data[0]);
    }

    if(loading){
        return(
            <div>
                <Loading />
            </div>
        )
    
    }

    async function goodQuestion(){
        questionData.data.question = questionText;
        const{data, error} = await supabase.from("question_data").update({"reviewed": questionData.reviewed + 1, "data": questionData.data}).eq("id",questionData.id);
        console.log(questionData.id)
        setUp();
    
    }

    async function badQuestion(){
        const{data, error} = await supabase.from("question_data").delete().eq("id",questionData.id);
        console.log(questionData.id)
        setUp();
    }
    
    function updateQuestionText(e){
        setQuestionText(e.target.value);
    }

    return(<div className = "w-content h-content pb-6 overflow-hidden">
        <div className ="md:mx-24">
        <button className = "text-white bg-green-700 p-3 w-fit " onClick = {goodQuestion}> Good </button>
        <button className = "text-white bg-red-700 p-3 w-fit " onClick = {badQuestion}> Bad </button>
        </div>
        <textarea className = "mx-24 w-2/3 bg-cyan-600" value = {questionText} onChange = {updateQuestionText}/>
        <div className ="mx-4 md:mx-24">
        <Multiplechoice questionInfo={question} 
        width = "w-2/3" />
        </div>
    </div>
    );
}