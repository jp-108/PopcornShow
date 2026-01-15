import React, { useEffect, useState, useRef, useMemo } from "react";
import "./style.scss";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa6";
import { debounce } from "../../../utils/utils";
import Skelton from "../../../components/skelton/Skelton";

function HeroBanner({ loading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const data = useSelector((state) => state.home.data);
  let genres = useSelector((state) => state.home.genres);
  let genre = [...genres.tv, ...genres.movie];
  const IMAGE_PATH = import.meta.env.VITE_APP_IMAGE_PATH;
  const ref = useRef();

  // Memoize genreIdToName and updatedData for performance
  const genreIdToName = useMemo(() => {
    const map = {};
    genre.forEach((genre) => {
      map[genre.id] = genre.name;
    });
    return map;
  }, [genre]);

  const updatedData = useMemo(() => data.map((item) => {
    return { ...item, genre_ids: item.genre_ids.map((genreId) => genreIdToName[genreId]) };
  }).slice(0,5), [data, genreIdToName]);

  // Carousel Actions
  const startAutoplay = () => {
    setIsAutoplay(true);
  };

  const stopAutoplay = () => {
    setIsAutoplay(false);
  };

  const resetAutoplay = () => {
    if (isAutoplay) {
      stopAutoplay();
      startAutoplay();
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetAutoplay();
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (currentIndex === data.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    let interval;
    if (isAutoplay) {
      interval = setTimeout(() => {
        goToNextSlide();
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
    clearInterval(interval);
  }, [isAutoplay, currentIndex, goToNextSlide]);

  // Go to slides based on index
  useEffect(() => {
    ref.current?.scrollTo({ left: ref.current?.clientWidth * currentIndex });
  }, [data, goToNextSlide, goToPrevSlide]);

  useEffect(() => {
    // Debounce the update to avoid frequent updates
    const handleScroll = debounce(() => {
      // Set currentIndex based on scrolling
      setCurrentIndex(Math.floor(ref.current?.scrollLeft / ref.current?.clientWidth));
    }, 200);

    ref.current?.addEventListener("scroll", handleScroll);

    return () => {
      ref.current?.removeEventListener("scroll", handleScroll);
    };
  }, [ref.current?.scrollLeft]);

  return (
    <>
      <div ref={ref} className='hero'>
        {loading ? (
          <div className='background-image'>
            <div className='info'>
              <h1>
                <Skelton minWidth='100%' height='70px' />
              </h1>
              <div className='details'>
                <Skelton minWidth='300px' height='30px' />
              </div>
              <div className='btn-section' style={{ display: "flex" }}>
                <span className='btn'>
                  <Skelton minWidth='106px' height='50px' />
                </span>
                <span className='btn'>
                  <Skelton minWidth='106px' height='50px' margin='0 0 0 15px' />
                </span>
              </div>
            </div>
          </div>
        ) : (
          updatedData.map((data, index) => {
            if (Math.abs(currentIndex - index) > 1) return null; // Only render current, prev, next
            return (
              <div id={index} className={`slides ${currentIndex === index ? "active" : ""}`} key={data.id}>
                <div>
                  <img src={IMAGE_PATH + data.backdrop_path} className='background-image' alt='' loading="lazy" />
                  <div className='info'>
                    <h1 className='title'>{data.original_title}</h1>
                    <div className='details'>
                      <span className='rating'>
                        <FaStar /> {data.vote_average.toFixed(2)}
                      </span>
                      | <span> {data.genre_ids.toString().replaceAll(",", ", ")}</span>
                    </div>
                    <div className='btn-section'>
                      <button className='playnow-btn btn'>Play Now</button>
                      <button className='moreinfo-btn btn'>More Info</button>
                    </div>
                  </div>
                  <div className='opacity-layer'></div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className='dots'>
        {updatedData.map((_, index) => (
          <div key={index} onClick={() => goToSlide(index)} className={`dot ${currentIndex === index ? "active" : ""} `}></div>
        ))}
      </div>
    </>
  );
}

export default HeroBanner;
