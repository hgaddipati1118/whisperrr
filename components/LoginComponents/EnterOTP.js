import Title from "@/components/Title";
import LoginInputHeaders from "@/components/LoginComponents/LoginInputHeaders";
import {useState} from "react";
import { supabase } from "@/helpers/supabaseHelpers";
export default function EnterOTP({sendOTP, setStage, setLoading, getUser}){
    const [token, setToken] = useState();
    const[otpWork,setOtpWork] = useState("");
    //Updates OTP value based on user input
    // e is event (action to trigger function)
    function updateOTP(e){
        setToken(e.target.value);
    }

    async function checkOTP(){
        if(await verifyOtp()){
          getUser();
        }
        setLoading(false);
    }

    //To verify otp using supabase
    async function verifyOtp(){
        const sixDigit = /^[\d][\d][\d][\d][\d][\d]$/;
        if(!sixDigit.test(token)){
          setOtpWork("Enter a six digit code")
          return false;
        }
        setLoading(true);
        let email = localStorage.email;
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email'});
        const {user} = data;
        if(data && user){
          //Stores refresh token so user can stay logged in
          // In final app maybe have check box for option to remember?
          localStorage.refresh_token = data.session.refresh_token;
          setStage(2);
          setLoading(false);
          return true;
        }else{
          setOtpWork("Incorrect Code");
          setLoading(false);
          return false;
        }
      }

    // Code to make enter key work
    function checkEnter(e){
      if(e.key == "Enter"){
          checkOTP();
      }
    }

    return(
      <div className="flex h-screen">
      <div className="container my-auto">
        <Title tailwind = "text-center" />
        <div className = "flex justify-center mt-5">
        <div className = "my-4 bg-gray-700 pt-8 pb-4 rounded-2xl w-3/4 md:w-1/2 px-12 md:px-24">
      <LoginInputHeaders text = "Enter One Time Password (OTP)" />
      <input className="w-full h-10 rounded-lg px-3 mb-2" type="text"
      onChange = {updateOTP}
      value = {token}
      onKeyDown={checkEnter}
      placeholder = "******"
      />
      <div className = "text-blue-600 mb-2"> {otpWork} </div>
      <div className = "flex justify-center">
        <button className = "flex-none container py-1 w-1/3 rounded-lg bg-orange-600" 
        onClick = {sendOTP}> Resend Email </button>
        <button className = "flex-none container py-1 ml-8 w-1/3 rounded-lg bg-orange-600"  
        onClick = {checkOTP}> Login </button>
      </div>
      <div className = "flex justify-center mt-5">
      <div onClick = {() => setStage(0)}
       className = "flex-none bg-white rounded-full w-5 h-5 ml-6 " />
      <div className = "flex-none bg-gray-400 rounded-full w-5 h-5 mx-5" />
      </div>
      </div>
      </div>
      </div>
      </div>
      );
}