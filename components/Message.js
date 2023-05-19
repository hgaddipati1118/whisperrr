export default function Message({message, user}){
    let tailwind = "text-white tracking-widest rounded-lg w-fit text-xl px-3 py-1 my-2 max-w-[70%]";
    if(message.m_id == user.id ){
        return(
            <div className={"justify-self-end mr-6 bg-amber-800 "+tailwind}>
            {message.text}
            </div>
        )
    } else{
        return(
            <div className={"justify-self-start bg-sky-600 "+tailwind}>
                {message.text}
            </div>
        )
    }
}