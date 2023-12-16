import React, { useEffect, useState } from "react";
import "./style.scss";
import { FaSistrix } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Searchbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  console.log(query);

  const handlekeyPress = (e) => {
    if (e.key === "Enter" && query.trim().length > 0) {
      navigate(`/search/${query.trim()}`);
      setQuery("");
    }
  };

  const handleClick = () => {
    if (query.trim().length > 0) {
      navigate(`/search/${query.trim()}`);
      setQuery("");
    }
  };

  return (
    <>
      <input className='search-input' onKeyDown={handlekeyPress} onChange={(e) => setQuery(e.target.value)} name='search' value={query} type='text' placeholder='Search Movies or TV shows' />
      <button className='search-btn' onClick={handleClick}>
        <FaSistrix className='search-icon' /> Search
      </button>
    </>
  );
}

export default Searchbar;
