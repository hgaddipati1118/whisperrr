"use client";
import {useState, useEffect} from 'react';
import {supabase, refreshSession} from '@/helpers/supabaseHelpers';
import Home from '@/components/Home';
import Title from '@/components/Title';
import Loading from '@/components/Loading';
import LoginInputHeaders from './LoginInputHeader';




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

    //To verify otp using supabase
    async function verifyOtp(){
      const sixDigit = /^[\d][\d][\d][\d][\d][\d]$/;
      if(!sixDigit.test(token)){
        setOtpWork("Enter a six digit code")
        return false;
      }
      setLoading(true);
      setEmail(localStorage.email);
      console.log(email, token);
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email'});
      const {user} = data;
      if(data && user){
        console.log(data);
        console.log(error);
        //Stores refresh token so user can stay logged in
        // In final app maybe have check box for option to remember?
        localStorage.refresh_token = data.session.refresh_token;
        setStage(2);
        return true;
      }else{
        console.log(error);
        setOtpWork("Incorrect Code");
        return false;
      }
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
      return(<div>
        <Title />
        <div className = "container mx-auto bg-gray-700 pt-8 pb-4 w-1/2 rounded-2xl">
      <LoginInputHeaders text = "Enter your Email" />
      <input className="w-5/6 h-10 rounded-lg mx-12 px-3 mb-2" type="text"
      onChange = {updateEmail} onKeyDown={checkEnter} value = {email}
      placeholder = "example@gmail.com"
      />
      <div className = "mx-12 text-blue-600 mb-2"> {emailWork} </div>
      <button className = "container mx-52 w-1/3 rounded-lg bg-orange-600" 
      onClick = {sendOTP}> GET OTP</button>
      
      <div className = "flex mt-5 mx-64">
      <div className = "flex-none bg-gray-400 rounded-full w-5 h-5 ml-6 " />
      <div className = "flex-none bg-white rounded-full w-5 h-5 mx-5" />
      </div>
      </div>
      </div>
      );
    } else if(stage == 1){ // Enter OTP
      return(
        <div>
        <Title />
        <div className = "container mx-auto bg-gray-700 pt-8 pb-4 w-1/2 rounded-2xl">
      <LoginInputHeaders text = "Enter One Time Password (OTP) from Email" />
      <input className="w-5/6 h-10 rounded-lg mx-12 px-3 mb-2" type="text"
      onChange = {updateOTP}
      value = {token}
      placeholder = "******"
      />
      <div className = "mx-12 text-blue-600 mb-2"> {otpWork} </div>
      <div className = "flex">
        <button className = "flex-none container ml-20 w-1/3 rounded-lg bg-orange-600" 
        onClick = {sendOTP}> Resend Email </button>
        <button className = "flex-none container ml-8 w-1/3 rounded-lg bg-orange-600"  
        onClick = {checkOTP}> Login </button>
      </div>
      <div className = "flex mt-5 mx-64">
      <div onClick = {() => setStage(0)}
       className = "flex-none bg-white rounded-full w-5 h-5 ml-6 " />
      <div className = "flex-none bg-gray-400 rounded-full w-5 h-5 mx-5" />
      </div>
      </div>
      </div>
      );
    } else if (stage == 2){ //User logged in
      return(
      <Home user = {user}> </Home>);
    }
  }