import genderOptions from '@/public/genderOptions';
import ProfileSetUpStageButtons from "@/components/ProfileSetupComponents/ProfileSetUpStageButtons.js";
import Multiplechoice from "@/components/Multiplechoice.js";
export default function PickGender({moveNextStage, gender, setGender}){
    return(
        <div>
            <div className = "flex justify-center">
                <Multiplechoice questionInfo = {genderOptions} value = {gender} setValue = {(val) => setGender(val)} />
            </div>
            <ProfileSetUpStageButtons next = {true} back = {true} moveNextStage={(inc) => moveNextStage(inc)} />
        </div>
    )
}