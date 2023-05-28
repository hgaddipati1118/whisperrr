import McbOption from "@/components/McbOption"

export default function Multiplecheckbox({questionInfo, value, setValue}){
    let options = questionInfo.options.map((option, index) => {
        return(
     <McbOption key = {option.choiceVal} option = {option} index = {index}
     value = {value} setValue = {(val) => setValue(val)} />)
    });
    return(
        <div >
        <div className = "text-white text-xl mt-5 mb-3">
            {questionInfo.question}
        </div>
        <div>
            {options}
        </div>
        </div>
    )

    }