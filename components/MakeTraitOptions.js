import {useState} from "react";
const traitNames = ["nothing", "humor", "career", "compassion", "flexibility", "communication",
"openness", "creativity", "optimism", "expresiveness", "adventureness"] ; //Options of traits
export default function MakeTraitOptions({updateTraitArray, traitArray, index}){
    const[traitName, setTraitName] = useState("nothing");
    const[traitValue, setTraitValue] = useState(0);
    let selectHTML = traitNames.map((elem,i) => <option className="text-black" key = {i} value={elem}> {elem} </option>);


    function updateTraitValue(e){
        setTraitValue(e.target.value);
        console.log("HII");
        updateTraitArray(traitName, e.target.value, index);
    }

    function updateTraitName(e){
        setTraitName(e.target.value);
        updateTraitArray(e.target.value, traitValue, index);
    }
    return(
        <div>
            <br></br>
            <label>Trait Name</label>
            <select className = "text-black" value = {traitName} onChange = {updateTraitName}>
            {selectHTML}
            </select>
            <label>Trait Value:</label>
            <input type="number" min="-5" max = "-5" className = "text-black" value = {traitValue} onChange = {updateTraitValue} />
        </div>
    )
}