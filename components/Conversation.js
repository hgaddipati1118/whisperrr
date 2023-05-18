import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import {useState, useEffect} from "react";
export default function Conversation(){
    const[loading, setLoading] = useState(true);
    const[user, setUser] = useState();
    const[messages, setMessages] = useState([]);
    const[messageHTML, setMessageHTML] = useState();
    const[text, setText] = useState("");
    const[conv_id, setConvId] = useState();
    function updateText(e){
        setText(e.target.value);
    }
    async function sendMessage(){
        if(text != ""){
            const{data, error} = 
            await supabase
            .from('messages')
            .insert({text: text, conv_id: conv_id, m_id: user["id"]})
            .select();
            console.log(data, error);
            refreshSession(supabase);
            await getMessages();
            setText("");

        }
    }

    async function getMessages(){
        let user = await getUserProfileData(supabase);
        setUser(user);
        setConvId(user["conv_id"]);
        console.log(conv_id);
        const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq("conv_id",conv_id);
        console.log(data, error);
        setMessages(data);
        //Now to turn messages data into html
        if(messages != null){
            let messageHTML = messages.map((msg)=>{
                return <div>{msg.text}</div>
            });
            setMessageHTML(messageHTML);
        }
        setLoading(false);
    }
    useEffect(
        () => {getMessages()},[text]);
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
            {messageHTML}
            <textarea value = {text} onChange = {updateText} />
            <br></br>
            <button onClick = {sendMessage}> send </button>
            <br></br>
            <button onClick = {getMessages}> refresh </button>
        </div>
    )
}