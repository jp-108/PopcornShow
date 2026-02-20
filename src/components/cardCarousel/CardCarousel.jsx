import React, { useRef, useState, useEffect, useCallback } from "react";
import "./style.scss";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function CardCarousel({ children, heading }) {
  const carousel = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);
  const navigate = useNavigate();

  // Update arrow visibility based on scroll position
  const updateArrows = useCallback(() => {
    const el = carousel.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = carousel.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    // Also update on resize (window width change)
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const handleMoveLeft = () => {
    carousel.current?.scrollBy({ left: -420, behavior: "smooth" });
  };

  const handleMoveRight = () => {
    carousel.current?.scrollBy({ left: 420, behavior: "smooth" });
  };

  // ── Mouse drag-to-scroll ──────────────────────────────────────────────────
  const onMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = e.pageX;
    scrollStart.current = carousel.current.scrollLeft;
    carousel.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.pageX - dragStart.current;
    carousel.current.scrollLeft = scrollStart.current - delta;
  };

  const onMouseUp = () => {
    setIsDragging(false);
    if (carousel.current) carousel.current.style.cursor = "grab";
  };

  return (
    <div className="carousel-section">
      {/* Heading row */}
      <div className="carousel-header">
        <h2 className="carousel-heading">{heading}</h2>
        <button onClick={()=>navigate(`/discover/movie`)} className="carousel-see-all">
          See All <BsArrowRight />
        </button>
      </div>

      {/* Scroll container */}
      <div className="carousel-wrapper">
        <div
          ref={carousel}
          className={`carousel-container ${isDragging ? "dragging" : ""}`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div className="carousel-items">{children}</div>
        </div>

        {/* Left fade + arrow */}
        <div className={`carousel-edge carousel-edge--left ${canScrollLeft ? "visible" : ""}`}>
          <button
            aria-label="Scroll carousel left"
            className="carousel__button carousel__button--left"
            onClick={handleMoveLeft}
            disabled={!canScrollLeft}
          >
            <BsArrowLeft />
          </button>
        </div>

        {/* Right fade + arrow */}
        <div className={`carousel-edge carousel-edge--right ${canScrollRight ? "visible" : ""}`}>
          <button
            aria-label="Scroll carousel right"
            className="carousel__button carousel__button--right"
            onClick={handleMoveRight}
            disabled={!canScrollRight}
          >
            <BsArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}