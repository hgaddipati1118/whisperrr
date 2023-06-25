import StarRating from "@/components/StarRating.js";
import Loading from '@/components/Loading';
import {supabase} from "@/helpers/supabaseHelpers.js";
import {useState} from "react";

export default function GiveFeedback({user, pNum, setStage}){
    const[feedback, setFeedback] = useState();
    const[feedbackError, setFeedbackError] = useState();
    const[loading, setLoading] = useState(false);
    const[rating, setRating] = useState(0);
    console.log(pNum)
    async function submitFeedback(){
        if(rating == 0){
            setFeedbackError("Please give a star rating");
        }else if((feedback == null) || feedback.trim().split(/\s+/).length < 10){
            setFeedbackError("Write a review of at least 10 words");
        }else{
            setFeedbackError();
            setLoading(true);
            let convID = user["conv_id"];
            console.log(convID)
            console.log(pNum)
            if(pNum == 1){
                const{data,error} = await supabase.from("history")
                                .update({"rating_1":rating,
                                         "feedback_1": feedback})
                                .eq("conv_id",convID);

                await supabase.from("profiles")
                .update({"in_conversation":false,
                "conv_id": null})
                .eq("id",user["id"]);
                setStage(1);

                console.log(data, error);

            } else if(pNum == 2){
                console.log("HERE")
                console.log(convID)
                await supabase.from("history")
                                .update({"rating_2":rating,
                                         "feedback_2": feedback})
                                .eq("conv_id",convID);
                const{data,error} = await supabase.from("profiles")
                .update({"in_conversation":false,
                         "conv_id": null})
                .eq("id",user["id"]);
                setStage(1);

            }
            setLoading(false);
        }
    }

    if(loading){
        return(
            <div>
        <Loading />
        </div>);
    }
    return(
        <div>
            <div className = "flex w-full place-content-center">
                <div className = "text-white text-center mt-3 text-l w-2/3">
                    Your conversation has ended :( <br></br>
                     Give feedback on your match to help us provide better matches.
                </div>
            </div>
            <div>
            <StarRating rating = {rating} setRating = {setRating} size=" text-6xl md:text-8xl" />
            </div>
            <div className = "flex place-content-center w-full ">
                <textarea
                placeholder="Enter at least a 10 word review, explaining your rating" 
                value = {feedback} onChange = {(e) => setFeedback(e.target.value)} 
                className = "bg-slate-700 text-white text-l w-1/2 h-48 my-3 place-content-center p-3" />
            </div>
            <div className = "flex place-content-center w-full">
                <button className = "w-fit px-3 py-2 text-xl rounded-lg bg-orange-600 text-white" onClick = {submitFeedback} >
                     Submit Feedback 
                </button>
            </div>
            <div className = "text-center text-cyan-500">
                {feedbackError}
            </div>
        </div>
    )
}