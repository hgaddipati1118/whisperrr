import {supabase, refreshSession} from '@/helpers/supabaseHelpers';
import { useState } from "react";
import Link from 'next/link';
import Title from '@/components/Title';
export default function Header(){
    const[showDropdown, setShowDropdown] = useState(false);
    //Used to sign user out
    async function signout(){
        await refreshSession(supabase);
        await supabase.auth.signOut();
        window.location.reload();
    }
    let dropdown = <div onMouseOver={()=>setShowDropdown(true)} onMouseLeave={()=>setShowDropdown(false)}
    className = "absolute text-white text-xl bg-gray-800 p-2 border-1 border-gray-700 my-1 ml-3 w-28 hover:cursor-default">
     <Link className = "hover:text-blue-600 " href="/"> Chat </Link>
    <Link className = "hover:text-blue-600 " href="/profile"> Profile </Link>
    <Link className = "hover:text-blue-600" href="/questions"> Questions </Link>
    <div className = "hover:text-blue-600"> History </div>
    <div className = "hover:text-blue-600">
            <button onClick={signout} > log out </button>
    </div> 
    </div>;
    return(
        <div>
        <div className = "bg-gray-900 flex">
            <div className = {`pl-2 py-2 ml-3 w-28 ${showDropdown?"bg-gray-700":""}`} onMouseOver={()=>setShowDropdown(true)}
            onMouseLeave={()=>setShowDropdown(false)}>
            <div className = "bg-white my-3 w-20 h-2 rounded-sm"/>
            <div className = "bg-white my-3 w-20 h-2 rounded-sm"/>
            <div className = "bg-white my-3 w-20 h-2 rounded-sm"/>
            </div>
           <Link href="/"> <Title tailwind = "mt-3 ml-5" /> </Link>
        </div>
           {showDropdown?dropdown:<div className ="absolute h-5 w-32" onMouseOver = {()=>setShowDropdown(true)} /> }
        </div>
    )
}