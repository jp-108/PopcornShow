import React, { useEffect, useState } from "react";
import "./style.scss";
import Details from "../../components/details/Details";
import CardCarousel from "../../components/cardCarousel/CardCarousel";
import Cast from "../../components/cast/Cast";
import Card from "../../components/cards/Card";
import { fetchData } from "../../store/fetchApi";
import { useParams } from "react-router-dom";
import Skelton from "../../components/skelton/Skelton";


function DetailsPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState();
  const [movieCast, setMovieCast] = useState();
  const [recommendations, setRecommendations] = useState([]);
  const [similar, setSimilar] = useState();
  const fetchMovieDetails = fetchData(`/${params.mediaType}/${params.id}`);
  const fetchMovieCast = fetchData(`/${params.mediaType}/${params.id}/credits`);
  const fetchRecommendations = fetchData(`/${params.mediaType}/${params.id}/recommendations`);
  const fetchSimilar = fetchData(`/${params.mediaType}/${params.id}/similar`);

  useEffect(() => {
    fetchMovieDetails.then((res) => setMovieData(res));
    fetchMovieCast.then((res) => setMovieCast(res.cast));
    fetchRecommendations.then((res) => setRecommendations(res.results));
    fetchSimilar.then((res) => setSimilar(res.results));
  }, [params]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className='details-page'>
      <Details data={movieData} loading={loading} />
      <div className='details-carousel'>

        <div className="cast-carousel"> 
        <CardCarousel heading='Top Cast'>
          {loading ? (
            <>
              <Skelton minWidth='150px' height='230px' skeltonCount={9} margin="0 20px 0 0" />
            </>
          ) : (
            movieCast?.map((data) => <Cast data={data} key={data.id} />)
          )}
        </CardCarousel>
        </div>

        {recommendations.length>0 &&
        <CardCarousel heading='Recommendations'>
          {loading ? (
            <>
              <Skelton minWidth='160px' height='200px' skeltonCount={9} margin="0 20px 0 0"/>
            </>
          ) : (
            recommendations?.map((data) => <Card data={data} key={data.id} mediaType={params.mediaType} />)
          )}
        </CardCarousel>
        }

        <CardCarousel heading='Similar'>
          {loading ? (
            <>
              <Skelton minWidth='160px' height='200px' skeltonCount={9} margin="0 20px 0 0" />
            </>
          ) : (
            similar?.map((data) => <Card data={data} key={data.id} mediaType={params.mediaType} />)
          )}
        </CardCarousel>
      </div>
    </div>
  );
}

export default DetailsPage;
