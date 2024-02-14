import './style.scss';

import React, { forwardRef } from 'react';
import SlickSlider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Slider = forwardRef(({ children, ...props }, ref) => {
  return (
    <SlickSlider ref={ref} {...props}>
      {children}
    </SlickSlider>
  );
});

export default Slider;