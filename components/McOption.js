import {useEffect} from "react";
const ALPHABET = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
const ALPHABET2 = ['a', 'b', 'c','d','e','f','g','h','i','j','k','l','m','n','o','p',
'q','r','s','t','u','v','w','x','y','z'];
export default function McOption({option, index, value, setValue}){

    function updateValue(val){
        if(value == val){
            setValue();
        }else{
            setValue(val);
        }
    }
    return(
        <div className= {`flex ${value == option.choiceVal?"bg-cyan-800":"bg-cyan-400"} hover:bg-cyan-800 mb-5 border-orange-500 border-2 rounded-lg w-auto`}
        onClick = {() => updateValue(option.choiceVal)}>
        <div className = "my-4 ml-4 border-2 border-black text-lg w-8 text-center bg-cyan-200">
            {ALPHABET[index]} 
        </div>
        <div className="text-black text-lg my-4 align-middle ml-4">
            {option.choiceName}
        </div>
        </div>
    )
}