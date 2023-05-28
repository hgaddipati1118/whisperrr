import ProfileSetUpStageButtons from "@/components/ProfileSetupComponents/ProfileSetUpStageButtons.js";
export default function PickAge({moveNextStage, age, ageError, checkAge}){
    
    return (
        <div>
        <div className = "text-white text-xl text-center mt-5">
            What is the lowest age you are willing to date?
        </div>
    <div className = "flex justify-center">
        <div>
        <input type = "number" min="18" placeholder = "18" value = {age} 
        onChange = {checkAge}
        className="leading-none text-[250px] text-center 
        bg-black text-gray-400 h-70 w-full" max="99" />
        <div className="text-white text-center ml-5"> {ageError} </div>
        </div>
    </div>
    <ProfileSetUpStageButtons next = {true} back = {true} moveNextStage={(inc) => moveNextStage(inc)} />
    </div>
    )
}