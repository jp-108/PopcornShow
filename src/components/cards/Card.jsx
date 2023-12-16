import React, { useRef } from "react";
import { BsPlayCircle, BsPlusSquare } from "react-icons/bs";
import "./style.scss";
import { languageNames } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import noPoster from "../../assets/no-poster.png"


function Card(props) { 
  const myRef = useRef(null);
  const navigate = useNavigate()
  const { data, mediaType } = props;

  const date = new Date(data.release_date);
  const year = date.getFullYear();
console.log(data)

  return (
    <div ref={myRef} key={data.id} onClick={()=>navigate(`/${data.media_type || mediaType}/${data.id}`)} tabIndex='0' role='button' aria-label='carousel item' className='item-container'>
      <img className='item-img' src={data.poster_path?`https://image.tmdb.org/t/p/w500${data.poster_path}`: noPoster} alt={data.original_title} />
      <div className='item-details'>
        <div className='details-buttons'>
          <BsPlayCircle className='details-button details-play' />
          <BsPlusSquare className='details-add' />
        </div>

        <p className='details-title'>{data.original_title}</p>
        <p className='details-info'>{`${year} ${languageNames(data.original_language)}`}</p>
        <p className='details-overview'>{data.overview}</p>
      </div>
    </div>
  );
}

export default Card;
