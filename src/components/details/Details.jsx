import React, { useState, useEffect } from "react";
import "./style.scss";
import { languageNames } from "../../utils/utils";
import { BsPlayCircle, BsPlusSquare } from "react-icons/bs";
import Skelton from "../skelton/Skelton";
import noPoster from "../../assets/no-poster.png";

function Details({ data, loading }) {
  const runTime = (runtime) => {
    const hrs = Math.floor(runtime / 60);
    const min = runtime % 60;
    return hrs + "h " + min + "m";
  };

  return (
    <div>
      <div className='details-container'>
        <img className='backdrop-image' src={`https://image.tmdb.org/t/p/original${data?.backdrop_path}`} alt='' />
        <div className='opacity-layer'></div>
        {loading ? (
          <div className='details-wrapper'>
            <div className='poster-section'>
              <div className='poster-image'>
                <Skelton minWidth='260px' height='390px' />
              </div>
              <div className='poster-btn'>
                <Skelton minWidth='100%' height='45px' />
              </div>
              <div className='poster-btn'>
                <Skelton minWidth='100%' height='45px' />
              </div>
            </div>
            <div className='details-section'>
              <div className='details-title'>
                <Skelton minWidth='60vw' width={"100%"} height='80px' />
              </div>
              <div className='details-tagline'>
                <Skelton minWidth='100%' height='45px' />
              </div>
              <div className='details-overview'>
                <Skelton minWidth='100%' height='20px' skeltonCount={3} margin='5px 0' />
              </div>
              <div className='specifications'>
                <Skelton minWidth='50%' height='35px' skeltonCount={5} margin={"10px 0"} />
              </div>
            </div>
          </div>
        ) : (
          <div className='details-wrapper'>
            <div className='poster-section'>
              <img className='poster-image' src={data?.poster_path ? `https://image.tmdb.org/t/p/original${data?.poster_path}` : noPoster} alt='' />
              <button className='poster-btn play-btn'>
                <BsPlayCircle /> <span className='btn-text'>Play Now</span>
              </button>
              <button className='poster-btn add-btn'>
                <BsPlusSquare /> <span className='btn-text'>Add to Watchlist</span>
              </button>
            </div>
            <div className='details-section'>
              <h1 className='details-title'>{data?.original_title || data?.original_name}</h1>
              <h3 className='details-tagline'>{data?.tagline}</h3>
              <p className='details-overview'>{data?.overview}</p>
              <div className='specifications'>
              {data?.runtime && <p>
                  <span>Run time : </span>
                  <span>{runTime(data?.runtime)}</span>
                </p>}
              {data?.vote_average? <p>
                  <span>Ratings : </span>
                  <span>{data?.vote_average.toFixed(1)}/10</span>
                </p>: null}
              {data?.original_language &&  <p>
                  <span>Langauge : </span>
                  <span>{languageNames(data?.original_language)}</span>
                </p>}
              {data?.genres &&  <p>
                  <span>Genres : </span>
                  <span>{data?.genres.map((genre) => genre.name + ", ")}</span>
                </p>}
              {data?.status &&  <p>
                  <span>Status : </span>
                  <span>{data?.status}</span>
                </p>}
              {data?.release_date &&  <p>
                  <span>Release Date : </span>
                  <span>{data?.release_date}</span>
                </p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;
