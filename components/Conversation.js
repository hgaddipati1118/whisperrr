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
    const[messageHTML, setMessageHTML] = useState();
    const[text, setText] = useState("");
    const[input, setInput] = useState("");
    const[conv_id, setConvId] = useState();
    const[pNum, setPNum] = useState(); // Whether p1 or p2;
    const[convoHappening, setConvoHappening] = useState(true);
    const messagesEndRef = useRef(null)
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
        setConvId(user["conv_id"]);
        const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq("conv_id",user["conv_id"]);
        //Now to turn messages data into html
        if(data != null){
            let temp = data.map((msg, i)=>{
                return <Message  key={msg.sent_at} message = {msg} user = {user} />
            });
            if(messageHTML != temp){
                setMessageHTML(temp);
            }
        }
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

    useEffect(()=>{findPNum()}, []);
    if(loading){
        return(
            <Loading />
        )
    }
    if(convoHappening){
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
    } else {
        return(
            <div>
                <GiveFeedback user = {user} pNum = {pNum} setStage = {(stage) => setStage(stage)} />
            </div>
        )
    }
}