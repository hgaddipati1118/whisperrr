import McOption from "@/components/McOption"

export default function Multiplechoice({questionInfo, value, setValue, width, profile}){
    let options = questionInfo.options.map((option, index) => {
        return(
     <McOption key = {option.choiceVal} option = {option} index = {index}
     value = {value} setValue = {(val) => setValue(val)} profile = {profile} />)
    });
    return(
        <div className = {width}>
        <div className = "text-white text-xl mt-5 mb-3">
            {questionInfo.question}
        </div>
        <div className>
            {options}
        </div>
        </div>
    )

    }