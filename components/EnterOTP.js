import Title from "@/components/Title";
import LoginInputHeaders from "@/components/LoginInputHeaders";
import {useState} from "react";
import { supabase } from "@/helpers/supabaseHelpers";
export default function EnterOTP({sendOTP, setStage, setLoading, setEmail}){
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
}