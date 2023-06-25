import {supabase, refreshSession} from '@/helpers/supabaseHelpers';
import { useState } from "react";
import Link from 'next/link';
import Title from '@/components/Title';
export default function Header(){
    const[showDropdown, setShowDropdown] = useState(false);
    //Used to sign user out
    async function signout(){
        let homeRegex = /http[\S]*\//
        supabase.auth.signOut();
        let temp = window.location.href;
        if(!homeRegex.test(temp)){
            window.location.reload();
        }
        localStorage.otpGeneratedTime = null;
        window.location.href = temp.match(homeRegex)[0].replace("\null","");
    }
    let dropdown = <div onMouseOver={()=>setShowDropdown(true)} onMouseLeave={()=>setShowDropdown(false)}
    className = "absolute text-white text-xl bg-gray-800 p-2 border-1 border-gray-700 my-1 ml-3 w-28 hover:cursor-default">
     <Link className = "hover:text-blue-600 " href="/"> Chat </Link>
    <Link className = "hover:text-blue-600 " href="/profile"> Profile </Link>
    <Link className = "hover:text-blue-600" href="/questions"> Questions </Link>
    <Link className = "hover:text-blue-600" href="/history"> History </Link>
    <div className = "hover:text-blue-600">
            <button onClick={signout} > log out </button>
    </div> 
    </div>;
    return(
        <div>
        <div className = "bg-gray-900 flex py-0.5 w-screen">
            <div className = {`px-2 py-2 ml-3 w-28 ${showDropdown?"bg-gray-700":""}`} onMouseOver={()=>setShowDropdown(true)}
            onMouseLeave={()=>setShowDropdown(false)}>
            <div className = "bg-white my-1 w-12 h-1 rounded-sm"/>
            <div className = "bg-white my-1 w-12 h-1 rounded-sm"/>
            <div className = "bg-white my-1 w-12 h-1 rounded-sm"/>
            </div>
           <Link href="/"> <Title tailwind = "ml-5 py-0.5 align-middle text-4xl" /> </Link>
        </div>
           {showDropdown?dropdown:<div className ="absolute h-5 w-32" onMouseOver = {()=>setShowDropdown(true)} /> }
        </div>
    )
}