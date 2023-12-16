import React, { useEffect } from "react";
import ContentWraper from "../contentWraper/ContentWraper";
import "./style.scss";
import logo from "../../assets/app_logo.svg";
import { useDispatch, useSelector } from "react-redux";
import fetchApi from "../../store/fetchApi";




function Footer() {
  const genres = useSelector(state=>state.home.genres)
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(fetchApi("/genre/tv/list"));
    dispatch(fetchApi("/genre/movie/list"));
  },[])


  return (
    <footer>
      <ContentWraper>
        <div className='footer-container'>
          <div className='footer-content'>
            <img src={logo} alt="" />
            <p className="footer-para">Popcorn Show is your one-stop destination for all your entertainment such as latest movies, most popular web shows, Live TV channels etc</p>
          </div>
          <div className='footer-content'>
            <h2>Movie</h2>
            <ul className="genre-list">
             {genres.movie.map((data)=> <li key={data.id}>{data.name}</li>)}
            </ul>
          </div>
          <div className='footer-content'>
          <h2>TV</h2>
            <ul className="genre-list">
             {genres.tv.map((data)=> <li key={data.id}>{data.name}</li>)}
            </ul>
          </div>
          <div className='footer-content last-item'>
            <p className="footer-menu-item">Privacy & Policy</p>
            <p className="footer-menu-item">Terms of use</p>
            <p className="footer-menu-item">About Us</p>
            <p className="footer-menu-item">Contact Us</p>
          </div>
        </div>
      </ContentWraper>
      <div className="bottom-line">
        <p>Copyright © 2023 Popcorn Show.</p>
      </div>
    </footer>
  );
}

export default Footer;
