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
            <div className = "bg-amber-700 w-2/3 md:w-1/2 rounded-lg mb-6 px-8">
                <div className = "mt-2">
                    <div className = "" >
                        <div className = "text-m md:text-2xl">
                        {format(new Date(data.start_time), "PP")}&nbsp;-&nbsp;
                        {format(new Date(data.end_time), "PP")}&nbsp; <span className="text-stone-400">
                        ({data.messages_sent.toLocaleString("en-US")} messages)
                        </span>
                        </div>
                    </div>
                </div>
                <div className="">
                <StarRating fixed = {true} rating = {ratingGiven} size="text-4xl md:text-8xl"  />
                </div>
                <div className = "mb-2 mt-2">
                    {feedbackGiven}
                </div>
            </div>
        </div>
    )
}