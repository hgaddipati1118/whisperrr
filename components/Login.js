"use client";  //Changes components based on user input

//Imports
import {useState, useEffect} from 'react';
import {supabase, refreshSession} from '@/helpers/supabaseHelpers';
import Home from '@/components/Home';
import Title from '@/components/Title';
import Loading from '@/components/Loading';
import EnterEmail from '@/components/LoginComponents/EnterEmail';
import EnterOTP from '@/components/LoginComponents/EnterOTP'

//Code for login page
export default function Login(){
  const[emailWork, setEmailWork] = useState("");
  const[loading, setLoading] = useState(true);
  const[email, setEmail] = useState("");
  //Stage 0: enter email
  //Stage 1: enter OTP
  // Stage 2: User logged in
  const[stage, setStage] = useState(0);
  const[user, setUser] = useState();
  
  // Uses supabase to send otp code to email;
  async function otpSignIn(){
    await supabase.auth.signInWithOtp({
      email: email
    });
    localStorage.email = email;
  }

  

    //Code to send OTP
    // Only sends OTP if emailWork is null cuz then no errors
    // Then changes stage to 1
    async function sendOTP(){
        localStorage.email = email;
        otpSignIn();
        setStage(1);
    }

    async function getUser(){
      setLoading(true);
      while (typeof window == 'undefined') {
      }
      await refreshSession(supabase);
      const { data, error} = await supabase.auth.getUser();
      if(!error){
        setStage(2);
        setUser(data.user);
      }
      setLoading(false);
    }

    //Gets user info to see if logged in
    useEffect(() => {
      getUser();
    },[]);


    if(loading){
      return(
        <div>
        <Title tailwind = "text-center text-6xl" />
        <Loading />
        </div>
      )
    }

    
    if(stage == 0){ // Enter email stage
      return(
        <EnterEmail email = {email} setEmail = {setEmail} sendOTP = {sendOTP}  />
      )
    } else if(stage == 1){ // Enter OTP
      return(
        <EnterOTP sendOTP={sendOTP} setStage = {setStage} setLoading = {setLoading} 
        getUser = {getUser} setEmail = {setEmail} 
        emailWork = {emailWork} setEmailWork = {(email) => setEmailWork(email)} />
      );
    } else if (stage == 2){ //User logged in
      return(
      <Home user = {user} setState = {(stage) => setStage(stage)}> </Home>);
    }
  }