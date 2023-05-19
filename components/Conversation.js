import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import {useState, useEffect, useRef} from "react";
// get our fontawesome imports
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Message from "@/components/Message";
export default function Conversation(){
    const[loading, setLoading] = useState(true);
    const[user, setUser] = useState();
    const[messages, setMessages] = useState([]);
    const[messageHTML, setMessageHTML] = useState();
    const[text, setText] = useState("");
    const[input, setInput] = useState("");
    const[conv_id, setConvId] = useState();
    const messagesEndRef = useRef(null)
    //To autoscroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

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
        const interval = setInterval(() => getMessages(), 1000);
        return () => {
        clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        scrollToBottom()
      }, [messageHTML]);

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
            <div ref={messagesEndRef} />
            </div>
            <div className = "flex mx-32 mt-6 bg-slate-700 pl-2">
            <input className = "bg-slate-700 w-11/12 text-white py-2" placeholder = "type message"
            type ="text" value = {text} onChange = {updateText} />
            <button onClick = {sendMessage} className = "h-full w-12  ml-8"> 
            <FontAwesomeIcon className = "h-8 mt-2 " icon={faRocket} /> </button>
            </div>
            </div>
        </div>
    )
}