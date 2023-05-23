import {useState} from "react";
import MakeTraitOptions from "@/components/MakeTraitOptions";
export default function MakeQuestionOptions({updateOptionArray, optionArray, index}){
    const[option, setOption] = useState("");
    const[traits, setTraits] = useState([]);
    const[traitHTML,setTraitHTML] = useState();
    //function to update option text
    function updateOption(e){
        let temp = optionArray;
        temp[index].optionName = e.target.value; // updates option value
        updateOptionArray(temp);
        setOption(e.target.value);
    }

    function updateTraits(traitName, traitValue, index2){
        let temp = traits;
        temp[index2].traitName = traitName;
        temp[index2].traitValue = traitValue;
        setTraits(temp); //updates trait
        let temp2 = optionArray;
        optionArray[index].optionTraits = temp;
        updateOptionArray(temp2);
        console.log(temp2)
    }
    function addTrait(){
        let temp = traits;
        temp.push(
            {
                traitName: "",
                traitValue: ""
            }
        );
        setTraits(temp);
        setTraitHTML(traits.map((elem,i) => <MakeTraitOptions key={i} updateTraitArray={updateTraits} traitArray={traits} index = {i} />));
    }

    function deleteTrait(){
        let temp = traits;
        temp.pop();
        setTraits(temp);
        setTraitHTML(traits.map((elem,i) => <MakeTraitOptions key={i} updateTraitArray={updateTraits} traitArray={traits} index = {i} />));
    }

    return(
        <div>
            <br></br>
            <label> Option {index} </label>
            <br></br>
            <input type = "text" className ="text-black" value = {option} onChange = {updateOption} />
            <br></br>
            {traitHTML}
            <br></br>
            <button onClick={addTrait}> Add trait</button> <button onClick={deleteTrait}> Delete trait</button>
        </div>
    )
}