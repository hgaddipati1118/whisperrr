import prefGenderOptions from "@/public/prefGenderOptions";
import Multiplecheckbox from "@/components/Multiplecheckbox";
import ProfileSetUpStageButtons from "@/components/ProfileSetupComponents/ProfileSetUpStageButtons.js";
export default function PickPreferredGenders({moveNextStage, preferred_gender, setPreferredGender}){
    return(
        <div>
                
                <div className ="flex justify-center">
                <div className ="w-2/3">
                <Multiplecheckbox questionInfo = {prefGenderOptions} value = {preferred_gender} setValue = {(val) => setPreferredGender(val)} />
                </div>
                </div>
                <ProfileSetUpStageButtons next = {true} back = {true} moveNextStage={(inc) => moveNextStage(inc)} />
                
        </div>
    )
}