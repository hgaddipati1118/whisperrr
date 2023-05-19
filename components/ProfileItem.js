export default function ProfileItem({value, valueTitle}){
    return(
        <div className = "text-white text-size-2xl pb-3 flex">
           <div className = "font-bold text-size-3xl pr-1"> {valueTitle}: </div> <div> {value} </div>
        </div>
    )
}