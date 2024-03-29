import {supabase, refreshSession, getUserProfileData} from '@/helpers/supabaseHelpers';
import {useState, useEffect, useRef} from "react";
import { profanity } from '@2toad/profanity';
// get our fontawesome imports
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "@/components/Loading";
import Message from "@/components/Message";
import GiveFeedback from '@/components/GiveFeedback';

export default function Conversation({user, setStage}){
    const[loading, setLoading] = useState(true);
    const[messageHTML, setMessageHTML] = useState([]);
    const[text, setText] = useState("");
    const[input, setInput] = useState("");
    const[conv_id, setConvId] = useState();
    const[pNum, setPNum] = useState(); // Whether p1 or p2;
    const[convoHappening, setConvoHappening] = useState(true);
    const messagesEndRef = useRef(null)
    const messageHTMLRef = useRef();
    messageHTMLRef.current = messageHTML;
    //To autoscroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    
    async function findPNum(){
        console.log("HERE")
        const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq("id",user["conv_id"]).single();
        if(user["id"] == data["uuid_1"]){
            setPNum(1);
        }
        if(user["id"] == data["uuid_2"]){
            setPNum(2);
        }
        setConvoHappening(!data["is_over"]);
    }

    function updateText(e){
        setText(e.target.value);
        setInput(profanity.censor(e.target.value));
    }

    function handleKeyPress(e){
        console.log(e);
        if(e.key == "Enter"){
            sendMessage();
        }
    }

    async function sendMessage(){
        if(text != ""){
            setText("");
            const{data} = await supabase
            .from('messages')
            .insert({text: input, conv_id: conv_id, m_id: user["id"]})
            .select().single();
            console.log(pNum);
            if(pNum == 1){
                const{error} = await supabase
                .from('conversations')
                .update({"last_msg_1": data.sent_at})
                .eq("id",user["conv_id"]);
                console.log(error);
            }

            if(pNum == 2){
                await supabase
                .from('conversations')
                .update({"last_msg_2": data.sent_at})
                .eq("id",user["conv_id"]);
            }

            const {error } = await supabase
            .rpc('increment_message_count', { row_id: user["conv_id"] }); //Increases messages sent by 1
            console.log(error);
            getMessages();
            refreshSession(supabase);
            

        }
    }

    async function getMessages(){
        if(!convoHappening){
            return;
        }
        setConvId(user["conv_id"]);
        const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq("conv_id",user["conv_id"]).order('sent_at', { ascending: true });
        //Now to turn messages data into html
        if(data != null){
            let temp = data.map((msg, i)=>{
                return <Message  key={msg.sent_at} message = {msg} user = {user} />
            });
            console.log(messageHTMLRef.current, temp)
            if(messageHTMLRef.current && (messageHTMLRef.current.length < temp.length)){
                console.log("hi")
                setMessageHTML(temp);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        const interval = setInterval(() => getMessages(), 3000);
        return () => {
        clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        scrollToBottom()
      }, [messageHTML]);

    useEffect(()=>{findPNum()}, []);
    if(loading){
        return(
            <Loading />
        )
    }
    if(convoHappening){
        return(
            <div className = "grid-cols-1 h-screen">
            <div className = "flex h-4/5 justify-center">
                <div className = "w-5/6">
                <div className=" mt-6  h-full max-h-full overflow-y-scroll overflow-x-hidden flex flex-col">
                {messageHTML}
                <div ref={messagesEndRef} />
                </div>
                </div>
            </div>
            <div className = "flex place-self-end justify-center w-full py-6">
                <div className ="bg-slate-700 pl-2 w-5/6 flex">
                <input className = "bg-slate-700 w-full text-white py-2" placeholder = "type message"
                type ="text" value = {text} onChange = {updateText} onKeyUp = {handleKeyPress} />
                <button onClick = {sendMessage} className = "h-full w-12  ml-8"> 
                <FontAwesomeIcon className = "h-8 mt-2 " icon={faRocket} /> </button>
                </div>
                </div>
            </div>
        )
    } else {
        return(
            <div>
                <GiveFeedback user = {user} pNum = {pNum} setStage = {(stage) => setStage(stage)} />
            </div>
        )
    }
}