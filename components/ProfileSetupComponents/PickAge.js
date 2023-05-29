import ProfileSetUpStageButtons from "@/components/ProfileSetupComponents/ProfileSetUpStageButtons.js";
export default function PickAge({moveNextStage, age, ageError, checkAge, title}){
    
    return (
        <div>
                        <div className ="flex justify-center">
                            <div className = "text-white text-xl text-center mt-5 w-2/3">
            {title}
        </div>
        </div>
    <div className = "flex justify-center">
        <div>
        <input type = "number" min="18" placeholder = "18" value = {age} 
        onChange = {checkAge}
        className="leading-none text-[128px] md:text-[250px] text-center 
        bg-black text-gray-400 h-70 w-full" max="99" />
        <div className="text-white text-center ml-5"> {ageError} </div>
        </div>
    </div>
    <ProfileSetUpStageButtons next = {true} back = {true} moveNextStage={(inc) => moveNextStage(inc)} />
    </div>
    )
}