import genderOptions from '@/public/genderOptions';
import ProfileSetUpStageButtons from "@/components/ProfileSetupComponents/ProfileSetUpStageButtons.js";
import Multiplechoice from "@/components/Multiplechoice.js";
export default function PickGender({moveNextStage, gender, setGender}){
    return(
        <div>
            <div className ="flex justify-center">
                <div className ="w-2/3">
                <Multiplechoice questionInfo = {genderOptions} value = {gender} setValue = {(val) => setGender(val)} />
            </div>
            </div>
            <ProfileSetUpStageButtons next = {true} back = {true} moveNextStage={(inc) => moveNextStage(inc)} />
        </div>
    )
}