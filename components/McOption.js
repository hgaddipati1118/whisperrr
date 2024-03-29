import {useEffect} from "react";
const ALPHABET = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
const ALPHABET2 = ['a', 'b', 'c','d','e','f','g','h','i','j','k','l','m','n','o','p',
'q','r','s','t','u','v','w','x','y','z'];
export default function McOption({option, index, value, setValue, profile}){

    function updateValue(val){
        if(value == val){
            setValue();
        }else{
            setValue(val);
        }
    }
    return(
        <div className= {`flex ${(value == option.choiceVal && profile)?"bg-cyan-800":"bg-cyan-400"} md:hover:bg-cyan-800 mb-5 
        border-orange-500 border-2 rounded-lg max-w-2/3 w-fit`}
        onClick = {() => updateValue(option.choiceVal)}>
        <div className = "my-4 ml-4 px-2 border-2 border-black text-lg h-8 text-center bg-cyan-200">
            {ALPHABET[index]} 
        </div>
        <div className="text-black text-m my-4 align-middle mx-4">
            {option.choiceName}
        </div>
        </div>
    )
}