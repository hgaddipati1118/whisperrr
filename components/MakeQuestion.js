"use client";
import {useState} from "react";
import {supabase} from "@/helpers/supabaseHelpers";
import MakeQuestionOptions from "@/components/MakeQuestionOptions";
export default function MakeQuestion(){
    const [question, setQuestion] = useState(""); // Store question itself
    const [options, setOptions] = useState([]); // Stores options
    const [optionHTML, setOptionHTML] = useState();
    function addOption(){
        let temp = options;
        temp.push(
            {
                optionName: "",
                optionTraits: []
            }
        );
        setOptions(temp);
        console.log(options);
        setOptionHTML(options.map((elem,i) => <MakeQuestionOptions key = {i} updateOptionArray={setOptions} optionArray={options} index = {i} />));
        console.log(optionHTML);
    }

    function deleteOption(){
        let temp = options;
        temp.pop();
        setOptions(temp);
        console.log(options);
        setOptionHTML(options.map((elem,i) => <MakeQuestionOptions key = {i} updateOptionArray={setOptions} optionArray={options} index = {i} />));
        console.log(optionHTML);
    }
    console.log(options);
    console.log(optionHTML);

    async function addQuestion(){
        let tempQuestion = question;
        let tempOptions = options;
        let dump = {
            "question": tempQuestion,
            "options": options
        };
        await supabase.from("question_data").insert({"data": dump});
        setQuestion("");
        setOptions([]);
        setOptionHTML();
    }
    return(<div className = "text-white">
        <label > Question </label>
        <input type = "text" className = "text-black" value = {question} onChange = {(e) => setQuestion(e.target.value)} />
        {optionHTML}
        <br></br>
        <button onClick = {addOption}> Add Option </button>        <button onClick = {deleteOption}> Delete Option </button>
        <br></br>
        <button onClick = {addQuestion}> Submit Question</button>
    </div>)
}