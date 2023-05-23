import Title from "@/components/Title";
import LoginInputHeaders from "@/components/LoginInputHeaders";
import {useState} from "react";
export default function EnterEmail({email, setEmail, sendOTP, updateStage}){
    const[emailWork, setEmailWork] = useState("");

    //Code to update email
    async function updateEmail(e){
        setEmail(e.target.value);
        setEmailWork("");
    }

    // Code to make enter key work
    // Doesn't work rn :(
    function checkEnter(e){
        if(e.key == "Enter"){
            sendOTP();
        }
      }

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
}