export default function Arrow({direction, tailwind}){
    //left arrow
    if(direction == "l"){
        return(
            <div className= {`left-0 top-1/2 transform -translate-x-1/2 translate-y-1/2 
            rotate-45 w-4 h-4 bg-white border-l 
            border-b border-indigo-500  ${tailwind} `}>

            </div>
        )
    }
    
    //right arrow
    if(direction == "r"){
        <svg xmlns="http://www.w3.org/2000/svg" className = {tailwind}><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/></svg>
    }

    //up arrow
    if(direction == "u"){
        <svg xmlns="http://www.w3.org/2000/svg" className = {tailwind}><path d="m12 6.586-8.707 8.707 1.414 1.414L12 9.414l7.293 7.293 1.414-1.414L12 6.586z"/></svg>
    }

    //down arrow
    if(direction == "d"){
        <svg xmlns="http://www.w3.org/2000/svg" className = {tailwind}><path d="m12 6.586-8.707 8.707 1.414 1.414L12 9.414l7.293 7.293 1.414-1.414L12 6.586z"/></svg>
    }

}