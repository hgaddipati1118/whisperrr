export default function ProfileSetupStageButtons({back, next, moveNextStage}){
    let buttonCSS = "container w-1/12 mr-6 rounded-lg py-1 ";
    let background = "bg-orange-600"
    return(
        <div className = "flex justify-center mt-4">
        <button className = { buttonCSS + (back?background:"")} onClick = {() => moveNextStage(-1)} > Back </button>
            <button className = { buttonCSS + (next?background:"")} onClick = {() => moveNextStage(1)} > Next </button>
        </div>
    )
}