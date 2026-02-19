import React, { useRef } from "react";
import { BsPlayCircle, BsPlusSquare, BsHandThumbsUp } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
import "./style.scss";
import { languageNames } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import noPoster from "../../assets/no-poster.png";

function Card({ data, mediaType }) {
  const myRef = useRef(null);
  const navigate = useNavigate();

  const year = data.release_date || data.first_air_date
    ? new Date(data.release_date || data.first_air_date).getFullYear()
    : null;

  const title = data.original_title || data.original_name || "Untitled";
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : noPoster;
  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}`
    : null;

  const handleClick = () => {
    navigate(`/${data.media_type || mediaType}/${data.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") handleClick();
  };

  // Genre badge: first genre only to keep it clean
  const topGenre = Array.isArray(data.genre_ids) && data.genre_ids[0];

  return (
    <div
      ref={myRef}
      className="card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex="0"
      role="button"
      aria-label={`View details for ${title}`}
    >
      {/* ── Poster ── */}
      <div className="card__poster">
        <img
          className="card__poster-img"
          src={posterUrl}
          alt={title}
          loading="lazy"
          draggable="false"
        />

        {/* Rating pill — always visible */}
        {data.vote_average > 0 && (
          <div className="card__rating">
            <FaStar />
            {data.vote_average.toFixed(1)}
          </div>
        )}

        {/* Media type badge */}
        <div className="card__type-badge">
          {data.media_type === "tv" || mediaType === "tv" ? "Series" : "Movie"}
        </div>
      </div>

      {/* ── Hover overlay ── */}
      <div className="card__overlay">
        {/* Backdrop as overlay bg if available */}
        {backdropUrl && (
          <img
            className="card__overlay-bg"
            src={backdropUrl}
            alt=""
            loading="lazy"
            draggable="false"
          />
        )}
        <div className="card__overlay-gradient" />

        <div className="card__overlay-content">
          {/* Action buttons */}
          <div className="card__actions">
            <button
              className="card__action-btn card__action-btn--play"
              aria-label={`Play ${title}`}
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
            >
              <BsPlayCircle />
            </button>
            <button
              className="card__action-btn"
              aria-label="Add to my list"
              onClick={(e) => e.stopPropagation()}
            >
              <BsPlusSquare />
            </button>
            <button
              className="card__action-btn"
              aria-label="Like"
              onClick={(e) => e.stopPropagation()}
            >
              <BsHandThumbsUp />
            </button>
          </div>

          {/* Info */}
          <p className="card__title">{title}</p>

          <div className="card__meta">
            {data.vote_average > 0 && (
              <span className="card__meta-rating">
                <FaStar /> {data.vote_average.toFixed(1)}
              </span>
            )}
            {year && <span>{year}</span>}
            {data.original_language && (
              <span>{languageNames(data.original_language)}</span>
            )}
          </div>

          {data.overview && (
            <p className="card__overview">
              {data.overview.length > 110
                ? data.overview.slice(0, 110) + "…"
                : data.overview}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;