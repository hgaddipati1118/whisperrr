import {useState} from "react";
export default function StarRating ({rating, setRating}){
    const [hover, setHover] = useState(0);
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
               " text-8xl"}>&#9733;</span>
            </button>
          );
        })}
      </div>
    );
  };