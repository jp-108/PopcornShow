import React, { useState } from "react";
import ContentWraper from "../contentWraper/ContentWraper";
import logo from "../../assets/app_logo.svg";
import "./style.scss";
import { FaSistrix } from "react-icons/fa6";
import { MdDensityMedium, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Searchbar from "../searchbar/Searchbar";

function Header() {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();

  const searchHandler = () => {
    setToggleSearch(!toggleSearch);
    setToggleMenu(false);
  };
  const menuHandler = () => {
    setToggleMenu(!toggleMenu);
    setToggleSearch(false);
  };

  return (
    <header className='header'>
      <ContentWraper>
        <div onClick={() => navigate("/")} className='logo'>
          <img src={logo} alt='logo' />
        </div>
        <div className={`searchbar ${toggleSearch ? "showSearchbar" : ""}`}>
          <Searchbar />
        </div>
        <ul className={`menuItems ${toggleMenu ? "showMenu" : ""}`}>
          <li className='menuItem' onClick={() => navigate("/discover/movie")}>
            Movies
          </li>
          <li className='menuItem' onClick={() => navigate("/discover/tv")}>
            TV Shows
          </li>
        </ul>
        <div className='mobileMenuIcon'>
          <FaSistrix onClick={searchHandler} />
          <div onClick={menuHandler}>{!toggleMenu ? <MdDensityMedium /> : <MdClose />}</div>
        </div>
      </ContentWraper>
    </header>
  );
}

export default Header;
