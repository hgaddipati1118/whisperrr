"use client";  //Changes components based on user input

//Imports
import {useState, useEffect} from 'react';
import {supabase, refreshSession} from '@/helpers/supabaseHelpers';
import Home from '@/components/Home';
import Title from '@/components/Title';
import Loading from '@/components/Loading';
import EnterEmail from '@/components/EnterEmail';
import EnterOTP from '@/components/EnterOTP'

//Code for login page
export default function Login(){
  const[emailWork, setEmailWork] = useState("");
  const[loading, setLoading] = useState(true);
  const[email, setEmail] = useState("");
  const[token,setToken] = useState("");
  const[otpWork,setOtpWork] = useState("");
  //Stage 0: enter email
  //Stage 1: enter OTP
  // Stage 2: User logged in
  const[stage, setStage] = useState(0);
  const[user, setUser] = useState();
  //Code to update email
  async function updateEmail(e){
    setEmail(e.target.value);
    setEmailWork("");
  }
  
  // Uses supabase to send otp code to email;
  async function otpSignIn(){
    console.log(email)
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email
    });
    console.log(data, error);
    localStorage.email = email;
  }

  //Code to check if email entered valid
  // @email is email input by user
  function updateEmailWork(){
    const validEmail = /@.*\./;
    //Change to proper post testing!
    const validGatechEmail = /@gmail\.com$/ /* /@gatech\.edu$/*/;
    if(email){
      if(!validEmail.test(email)){
        setEmailWork("enter valid email"); // email entered not valid
      } else if(!validGatechEmail.test(email)){
        setEmailWork("enter an @gatech.edu email"); // email entered not Georgia Tech
      } else{
        setEmailWork(""); // VALID EMAIL!!!
        return true;
      }
    }
    return false;
  }

    //Code to send OTP
    // Only sends OTP if emailWork is null cuz then no errors
    // Then changes stage to 1
    async function sendOTP(){
      
      if(updateEmailWork()){
        localStorage.email = email;
        otpSignIn();
        setStage(1);
      }
    }

    async function updateOTP(e){
      setToken(e.target.value);
    }
    
    async function checkOTP(){
      if(await verifyOtp()){
        getUser();
      }
      setLoading(false);
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
    
    useEffect(() => {
      getUser();
    },[]);
    if(loading){
      return(
        <div>
        <Title />
        <Loading />
        </div>
      )
    }

    
    function checkEnter(e){
      if(e.key == "Enter"){
        if(stage == 0){
          sendOTP();
        }else if (stage == 1){
          checkOTP();
        }
      }
    }
    if(stage == 0){ // Enter email stage
      return(
        <EnterEmail email = {email} setEmail = {setEmail} sendOTP = {sendOTP}  />
      )
    } else if(stage == 1){ // Enter OTP
      return(
        <EnterOTP sendOTP={sendOTP} setStage = {setStage} setLoading = {setLoading} 
        getUser = {getUser} setEmail = {setEmail} />
      );
    } else if (stage == 2){ //User logged in
      return(
      <Home user = {user}> </Home>);
    }
  }