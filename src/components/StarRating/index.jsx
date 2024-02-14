import { useEffect } from "react";
import './style.scss';

const StarRating = ({stars = 0}) => {

  const maxRating = 5;

  const fullStars = Math.floor(stars);
  const halfStar = stars % 1 !== 0 ? 1 : 0;
  const emptyStars = maxRating - fullStars - halfStar;

  return (
    <span className="rating" title={`Rating: ${stars} / ${maxRating}`}>
      {Array.from({ length: fullStars }, (star, index) => (
        <span key={`full-${index}`} className="star full"></span>
      ))}
      {halfStar > 0 && <span key="half" className="star half"></span>}
      {Array.from({ length: emptyStars }, (star, index) => (
        <span key={`empty-${index}`} className="star empty"></span>
      ))}
    </span>
  );
};

export default StarRating;