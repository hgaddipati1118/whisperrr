import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import {useState, useEffect} from "react";
import Message from "@/components/Message";
export default function Conversation(){
    const[loading, setLoading] = useState(true);
    const[user, setUser] = useState();
    const[messages, setMessages] = useState([]);
    const[messageHTML, setMessageHTML] = useState();
    const[text, setText] = useState("");
    const[input, setInput] = useState("");
    const[conv_id, setConvId] = useState();
    const[time, setTime] = useState();

    function updateText(e){
        setText(e.target.value);
        setInput(e.target.value);
    }
    async function sendMessage(){
        console.log(text);
        if(text != ""){
            setText("");
            await supabase
            .from('messages')
            .insert({text: input, conv_id: conv_id, m_id: user["id"]})
            .select();
            getMessages();
            refreshSession(supabase);
            

        }
    }

    async function getMessages(){
        let user = await getUserProfileData(supabase);
        setUser(user);
        setConvId(user["conv_id"]);
        const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq("conv_id",conv_id);
        setMessages(data);
        //Now to turn messages data into html
        if(data != null){
            let messageHTML = data.map((msg, i)=>{
                return <Message  key={i} message = {msg} user = {user} />
            });
            setMessageHTML(messageHTML);
        }
        console.log(messageHTML);
        setLoading(false);
    }

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
        clearInterval(interval);
        };
    }, []);
    if(loading || messages == null || messages.length < 1){
        getMessages();
        return(
            <div>
                loading...
            </div>
        )
    };
    return(
        <div>
            <div>
            <div className="grid grid-cols-1 h-96 max-h-96 mx-32 mt-6 overflow-y-scroll flex flex-col-reverse">
            {messageHTML}
            </div>
            <div className = "flex mx-32 mt-6 bg-slate-700 py-2 pl-2">
            <input className = "bg-slate-700" placeholder = "type message"
            type ="text" value = {text} onChange = {updateText} />
            <i class="fa-solid fa-user"></i>
            <button onClick = {sendMessage}> send </button>
            </div>
            </div>
        </div>
    )
}