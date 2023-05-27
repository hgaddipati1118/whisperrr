import { format } from 'date-fns';
import StarRating from "@/components/StarRating.js";
export default function HistoryItem({data, uuid}){
    let ratingGiven = data.rating_1;
    let feedbackGiven = data.feedback_1;
    if(uuid == data.uuid_1){
        ratingGiven = data.rating_2;
        feedbackGiven = data.feedback_2; 
    }
    return(
        <div className = "flex place-content-center"> 
            <div className = "bg-amber-600 w-1/2 rounded-lg pl-8 mt-6">
                <div className = "mt-2">
                    <div className = "flex h-8 items-end" >
                        <div className = "text-2xl">
                        {format(new Date(data.start_time), "PP")}&nbsp;-&nbsp;
                        {format(new Date(data.end_time), "PP")}
                        </div>
                        <div className = "text-l pl-2">
                            ({data.messages_sent.toLocaleString("en-US")} messages)
                        </div>
                    </div>
                </div>
                <div className="">
                <StarRating fixed = {true} rating = {ratingGiven} size="text-8xl"  />
                </div>
                <div className = "mb-2 mt-2">
                    {feedbackGiven}
                </div>
            </div>
        </div>
    )
}