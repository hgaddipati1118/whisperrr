import Header from "@/components/Header";
import HistoryItem from "@/components/HistoryItem"
import {supabase, getUserProfileData} from "@/helpers/supabaseHelpers";
import {useEffect, useState} from "react";
export default function History(){
    const[historyHTML, setHistoryHTML] = useState();
    async function getHistory(){
        let uuid = await getUserProfileData(supabase)["id"];
        const {data, error} = await supabase.from("history").select("*").order('end_time', { ascending: false });
        setHistoryHTML(data.map((element,i) => <HistoryItem data = {element} uuid = {uuid} key={i} />));
    }

    useEffect(() => {
        getHistory()
    }, []);
    return(
        <div>
            <Header />
            <div className = "text-white text-4xl text-center my-3">
            History
            </div>
            <div>
            {historyHTML}
            </div>
        </div>
    )
}