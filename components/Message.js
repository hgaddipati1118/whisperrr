import { format } from 'date-fns';
export default function Message({message, user}){
    let tailwind = "text-white break-words rounded-lg w-fit text-xl px-3 py-2 my-2 max-w-[70%] h-fit";
    let date = new Date(message.sent_at);
    if(message.m_id == user.id ){
        return(
            <div className = "text-white grid grid-cols-1 justify-end justify-self-end ">
            <div className={"justify-self-end mr-6 bg-amber-800 "+tailwind}>
            {message.text}
            </div>
           <div className = "mr-6 justify-self-end">
            {format(date, "MMM do, p")}
            </div>
            </div>
        )
    } else{
        return(
            <div className = "text-white justify-self-start">
            <div className={"justify-self-start bg-sky-600 "+tailwind}>
            {message.text}
            </div>
            <div className = "justify-self-start">
            {format(date, "MMM do, p")}
            </div>
            </div>
        )
    }
}