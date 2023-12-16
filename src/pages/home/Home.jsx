import React, { useEffect, useState } from "react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import fetchApi, { fetchData } from "../../store/fetchApi";
import HeroBanner from "./heroSection/HeroBanner";
import CardCarousel from "../../components/cardCarousel/CardCarousel";
import Card from "../../components/cards/Card";
import Skelton from "../../components/skelton/Skelton";

function Home() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.home.data);
  const fetchPopular = fetchData("/movie/popular");
  const fetchTopRated = fetchData("/movie/top_rated");
  const fetchUpcoming = fetchData("/movie/upcoming");

  useEffect(() => {
    fetchPopular.then((res) => setPopular(res.results));
    fetchTopRated.then((res) => setTopRated(res.results));
    fetchUpcoming.then((res) => setUpcoming(res.results));
    dispatch(fetchApi("/trending/movie/day"));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      <section className='home'>
        <HeroBanner loading={loading} />
        <div style={{ marginTop: "20px" }}>
          <CardCarousel heading='Trending'>
            {loading ? (
              <>
                <Skelton minWidth='160px' height='200px' skeltonCount={9} margin="0 20px 0 0" />
              </>
            ) : (
              data.map((data) => <Card data={data} key={data.id} mediaType="movie" />)
            )}
          </CardCarousel>
          <CardCarousel heading='Top Rated'>
            {loading ? (
              <>
                <Skelton minWidth='160px' height='200px' skeltonCount={9} margin="0 20px 0 0" />
              </>
            ) : (
              topRated.map((data) => <Card data={data} key={data.id} mediaType="movie" />)
            )}
          </CardCarousel>
          <CardCarousel heading='Popular'>
            {loading ? (
              <>
                <Skelton minWidth='160px' height='200px' skeltonCount={9} margin="0 20px 0 0" />
              </>
            ) : (
              popular.map((data) => <Card data={data} key={data.id} mediaType="movie" />)
            )}
          </CardCarousel>
          <CardCarousel heading='Upcoming'>
            {loading ? (
              <>
                <Skelton minWidth='160px' height='200px' skeltonCount={9} margin="0 20px 0 0" />
              </>
            ) : (
              upcoming.map((data) => <Card data={data} key={data.id} mediaType="movie" />)
            )}
          </CardCarousel>
        </div>
      </section>
    </>
  );
}

export default Home;
