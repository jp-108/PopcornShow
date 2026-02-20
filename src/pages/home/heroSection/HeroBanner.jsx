import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import "./style.scss";
import { useSelector } from "react-redux";
import { FaStar, FaPlay, FaCircleInfo, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { debounce } from "../../../utils/utils";
import Skelton from "../../../components/skelton/Skelton";
import { useNavigate } from "react-router-dom";

function HeroBanner({ loading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const data = useSelector((state) => state.home.data);
  let genres = useSelector((state) => state.home.genres);
  let genre = [...genres.tv, ...genres.movie];
  const IMAGE_PATH = import.meta.env.VITE_APP_IMAGE_PATH;
  const ref = useRef();
  const navigate = useNavigate();

  // Memoize genreIdToName and updatedData for performance
  const genreIdToName = useMemo(() => {
    const map = {};
    genre.forEach((genre) => {
      map[genre.id] = genre.name;
    });
    return map;
  }, [genre]);

  const updatedData = useMemo(
    () =>
      data
        .map((item) => ({
          ...item,
          genre_ids: item.genre_ids.map((genreId) => genreIdToName[genreId]),
        }))
        .slice(0, 5),
    [data, genreIdToName]
  );

  // Carousel Actions
  const startAutoplay = () => setIsAutoplay(true);
  const stopAutoplay = () => setIsAutoplay(false);

  const resetAutoplay = () => {
    if (isAutoplay) {
      stopAutoplay();
      startAutoplay();
    }
  };

  const triggerTransition = (cb) => {
    setIsTransitioning(true);
    setTimeout(() => {
      cb();
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index) => {
    triggerTransition(() => setCurrentIndex(index));
    resetAutoplay();
  };

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === updatedData.length - 1 ? 0 : prev + 1));
  }, [updatedData.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? updatedData.length - 1 : prev - 1));
  }, [updatedData.length]);

  useEffect(() => {
    let interval;
    if (isAutoplay) {
      interval = setTimeout(goToNextSlide, 6000);
      return () => clearTimeout(interval);
    }
  }, [isAutoplay, currentIndex, goToNextSlide]);

  useEffect(() => {
    const el = ref.current; // capture it
    const handleScroll = debounce(() => {
      setCurrentIndex(Math.floor(el?.scrollLeft / el?.clientWidth));
    }, 200);

    el?.addEventListener("scroll", handleScroll);

    return () => {
      el?.removeEventListener("scroll", handleScroll); // safe — el is captured
    };
  }, []); // no need to depend on ref.current?.scrollLeft

  const currentItem = updatedData[currentIndex];

  return (
    <div className="hero-wrapper">
      {/* Main hero area */}
      <div
        ref={ref}
        className="hero"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        {loading ? (
          <div className="slide active">
            <div className="slide__bg" />
            <div className="slide__content">
              <div className="slide__badge"><Skelton minWidth="120px" height="22px" /></div>
              <h1 className="slide__title"><Skelton minWidth="100%" height="72px" /></h1>
              <div className="slide__meta"><Skelton minWidth="320px" height="28px" /></div>
              <div className="slide__actions">
                <Skelton minWidth="140px" height="52px" />
                <Skelton minWidth="140px" height="52px" margin="0 0 0 14px" />
              </div>
            </div>
          </div>
        ) : (
          updatedData.map((item, index) => {
            if (Math.abs(currentIndex - index) > 1) return null;
            const isActive = currentIndex === index;
            return (
              <div
                id={index}
                className={`slide ${isActive ? "active" : ""} ${isTransitioning ? "transitioning" : ""}`}
                key={item.id}
              >
                {/* Background image with Ken Burns */}
                <img
                  src={IMAGE_PATH + item.backdrop_path}
                  className="slide__bg-img"
                  alt=""
                  loading="lazy"
                />

                {/* Gradient overlays */}
                <div className="slide__overlay slide__overlay--left" />
                <div className="slide__overlay slide__overlay--bottom" />
                <div className="slide__overlay slide__overlay--vignette" />

                {/* Content */}
                <div className="slide__content">
                  <span className="slide__badge">
                    {item.media_type === "tv" ? "TV Series" : "Movie"}
                  </span>

                  <h1 className="slide__title">
                    {item.original_title || item.original_name}
                  </h1>

                  <div className="slide__meta">
                    <span className="slide__rating">
                      <FaStar />
                      {item.vote_average.toFixed(1)}
                    </span>
                    <span className="slide__dot" />
                    <span className="slide__year">
                      {(item.release_date || item.first_air_date || "").slice(0, 4)}
                    </span>
                    <span className="slide__dot" />
                    <span className="slide__genres">
                      {item.genre_ids.filter(Boolean).slice(0, 3).join(" · ")}
                    </span>
                  </div>

                  <p className="slide__overview">
                    {item.overview?.length > 160
                      ? item.overview.slice(0, 160) + "…"
                      : item.overview}
                  </p>

                  <div className="slide__actions">
                    <button onClick={() => navigate(`/movie/${item.id}`)} className="slide__btn slide__btn--play">
                      <FaPlay /> Play Now
                    </button>
                    <button onClick={() => navigate(`/movie/${item.id}`)} className="slide__btn slide__btn--info">
                      <FaCircleInfo /> More Info
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Prev / Next arrows */}
        {!loading && (
          <>
            <button
              className="hero__arrow hero__arrow--prev"
              onClick={() => { goToPrevSlide(); resetAutoplay(); }}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <button
              className="hero__arrow hero__arrow--next"
              onClick={() => { goToNextSlide(); resetAutoplay(); }}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Thumbnail strip */}
        {!loading && (
          <div className="hero__thumbs">
            {updatedData.map((item, index) => (
              <div
                key={item.id}
                className={`hero__thumb ${currentIndex === index ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              >
                <img
                  src={IMAGE_PATH + item.poster_path}
                  alt={item.original_title || item.original_name}
                  loading="lazy"
                />
                <div className="hero__thumb-glow" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress indicators */}
      <div className="hero__indicators">
        {updatedData.map((_, index) => (
          <button
            key={index}
            className={`hero__indicator ${currentIndex === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;