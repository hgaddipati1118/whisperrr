import Title from "@/components/Title";
import LoginInputHeaders from "@/components/LoginInputHeaders";
import {useState} from "react";
export default function EnterEmail({email, setEmail, sendOTP, emailWork, setEmailWork}){
    [emailWork, setEmailWork] = useState("");
    //Code to update email
    async function updateEmail(e){
        setEmail(e.target.value);
        setEmailWork("");
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
        setEmailWork("enter a @gmail.com email"); // email entered not Georgia Tech
      } else{
        setEmailWork("OTP sent to your inbox"); // VALID EMAIL!!!
        return true;
      }
    }
    return false;
  }

  function checkOTP(){
    if(updateEmailWork()){
        sendOTP();
    }
  }

    // Code to make enter key work
    function checkEnter(e){
        if(e.key == "Enter"){
            sendOTP();
        }
      }

    return(
        <div className="mt-3">
            <Title />
            <div className = "container my-4 mx-auto bg-gray-700 pt-8 pb-4 w-1/2 rounded-2xl px-24">
                <div className = "">
                <LoginInputHeaders text = "Enter your Email" />
                </div>
        <input className="w-full h-10 rounded-lg px-3 mb-2" type="text"
        onChange = {updateEmail} onKeyDown={checkEnter} value = {email}
        placeholder = "example@gmail.com"
        />
        <div className = "text-blue-600 mb-2 w-full"> {emailWork} </div>
        <div className = "flex justify-center">
            <button className = "container w-1/3 rounded-lg py-1 bg-orange-600" 
            onClick = {checkOTP}> GET OTP</button>
        </div>
        
        <div className = "flex justify-center mt-5">
            <div className = "flex-none bg-gray-400 rounded-full w-5 h-5 ml-6 " />
            <div className = "flex-none bg-white rounded-full w-5 h-5 mx-5" />
        </div>
        </div>
      </div>
      );
}