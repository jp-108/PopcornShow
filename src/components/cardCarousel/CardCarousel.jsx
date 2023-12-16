import React, { useRef } from "react";
import "./style.scss";
import { BsArrowRight } from "react-icons/bs";

export default function CardCarousel({ children, heading }) {
  const carousel = useRef(null);

  const handleMoveLeft = () => {
    carousel.current.scrollLeft -= 420;
  };
  const hanldeMoveRight = () => {
    carousel.current.scrollLeft += 420;
  };

  return (
    <div className='carousel-section'>
      <h1 className='heading'>{heading}</h1>
      <div ref={carousel} className='carousel-container'>
        <div className='carousel-items'>{children}</div>
        <div className='carousel__buttons'>
          <div
            aria-label='move carousel to left'
            role='button'
            tabIndex='0'
            onClick={() => {
              handleMoveLeft();
            }}
            id='btn-left'
            name='btn-left'
            className='carousel__button carousel__button-left'
          ><BsArrowRight/></div>

          <div
            aria-label='move carousel to right'
            role='button'
            tabIndex='0'
            onClick={() => {
              hanldeMoveRight();
            }}
            id='btn-right'
            name='btn-right'
            className='carousel__button carousel__button-right'
            ><BsArrowRight/></div>
        </div>
      </div>
    </div>
  );
}
