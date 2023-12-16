import React from 'react'
import "./style.scss"
import avatar from "../../assets/avatar.png"



function Cast({data}) {
  const randomColor = Math.floor(Math.random()*255)


  return (
    <div className='cast-container'>
        <div className='cast-details' style={{backgroundColor:`rgba(${randomColor},105,45,0.9)`}} >
            <img className='cast-image' src={data.profile_path?`https://image.tmdb.org/t/p/original${data.profile_path}`:avatar} alt="" />
            <h4 className='cast-name'>{data.original_name}</h4>
            <p className='cast-character'>{data.character}</p>
        </div>
    </div>
  )
}

export default Cast