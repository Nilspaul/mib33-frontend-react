import React, { useEffect, useRef, useState } from 'react';
import { formatPrice } from '../../utils/format';
import './style.scss';
import StarRating from '../StarRating';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CSSTransition } from 'react-transition-group';

import { isInBasket } from '../../utils/localBasket';
import { truncate } from '../../utils/string';

const ProductCard = ({ id, name, manufacturer, description, price, stock = 0, image_url, rating = 3.5, handleSave, activeStep}) => {
  const [isSaved, setIsSaved] = useState(isInBasket(id, activeStep));
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  const nodeAnimationRef = useRef(null);

  useEffect(() => {
    if(stock == 0) {
      setIsOutOfStock(true);
    }
  }, [stock]);

  const toggleSave = () => {
    if(!isOutOfStock) {
      handleSave(id)
      setIsSaved(!isSaved);
    }
  }

  
  return (
    <div className={`product-card ${isOutOfStock ? 'not-avail' : ''}`}>
      <div className="image">
        {image_url && (
          <img src={image_url} />
        )}
      </div>

      <div className="body">
        <div className="header">
          <h5 className='headline'>{manufacturer}</h5>
          <h3 className='headline'>{name}</h3>
          <StarRating stars={rating} />
          <div className={`save ${isSaved ? 'is-saved' : ''}`} onClick={toggleSave}>
            <CSSTransition in={isSaved} timeout={100} nodeRef={nodeAnimationRef} classNames="icon">
              <span className="icon" ref={nodeAnimationRef}>{isSaved ? <CheckCircleIcon /> : <AddCircleOutlineIcon />}</span>
            </CSSTransition>
          </div>
        </div>
        <div className="content">
          <p>{truncate(description, 200)}</p>
        </div>
        <div className="footer">
          <span className="stock">{isOutOfStock ? `Out of stock` : stock <= 3 ? `Just ${stock} left!` : `Available`}</span>
          <span className="price">{formatPrice(price)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;