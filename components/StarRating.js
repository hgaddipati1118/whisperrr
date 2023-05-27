import {useState} from "react";
export default function StarRating ({rating, setRating, size, fixed}){
    const [hover, setHover] = useState(0);
    if(fixed){
        return(
            <div className="star-rating">
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
              <span className={(index <= rating? "text-yellow-300" :  "text-gray-500") +
               " " + size}>&#9733;</span>

          );
        })}
      </div>
        ) 
    }
    return (
      <div className="star-rating text-center">
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              onClick={() => setRating(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(rating)}
            >
              <span className={(((index <= rating) && (index <= hover)) ? "text-yellow-300" : 
              (((index <= hover) || (index <= rating)) ? "text-gray-300": "text-gray-500")) +
               " " + size}>&#9733;</span>
            </button>
          );
        })}
      </div>
    );
  };