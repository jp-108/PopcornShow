import React, { useEffect, useState, useCallback } from "react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import fetchApi, { fetchData } from "../../store/fetchApi";
import HeroBanner from "./heroSection/HeroBanner";
import CardCarousel from "../../components/cardCarousel/CardCarousel";
import Card from "../../components/cards/Card";
import Skelton from "../../components/skelton/Skelton";

// ── Skeleton placeholder row ──────────────────────────────────────────────────
const CarouselSkeleton = () => (
  <Skelton minWidth="160px" height="240px" skeltonCount={9} margin="0 14px 0 0" />
);

// ── Carousel sections config — easy to extend ─────────────────────────────────
const SECTIONS = [
  { key: "trending", heading: "🔥 Trending Today", mediaType: "movie" },
  { key: "topRated", heading: "⭐ Top Rated", mediaType: "movie" },
  { key: "popular", heading: "🎬 Popular", mediaType: "movie" },
  { key: "upcoming", heading: "🗓️ Upcoming", mediaType: "movie" },
];

function Home() {
  const dispatch = useDispatch();
  const trending = useSelector((state) => state.home.data);

  const [lists, setLists] = useState({
    topRated: [],
    popular: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch all data in parallel ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // Hero banner data via Redux
        dispatch(fetchApi("/trending/movie/day"));

        // Carousel data in parallel — no artificial delay needed
        const [topRated, popular, upcoming] = await Promise.all([
          fetchData("/movie/top_rated"),
          fetchData("/movie/popular"),
          fetchData("/movie/upcoming"),
        ]);

        if (cancelled) return;

        setLists({
          topRated: topRated.results,
          popular: popular.results,
          upcoming: upcoming.results,
        });
      } catch (err) {
        if (!cancelled) setError("Failed to load content. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };   // cleanup: ignore stale responses
  }, [dispatch]);

  // ── Resolve data for each section ─────────────────────────────────────────
  const getList = useCallback((key) => {
    if (key === "trending") return trending;
    return lists[key] ?? [];
  }, [trending, lists]);

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="home home--error">
        <p className="home__error-msg">{error}</p>
      </section>
    );
  }

  return (
    <section className="home">
      {/* ── Hero slider ── */}
      <HeroBanner loading={loading} />

      {/* ── Carousel rows ── */}
      <div className="home__carousels">
        {SECTIONS.map(({ key, heading, mediaType }) => (
          <CardCarousel key={key} heading={heading}>
            {loading ? (
              <CarouselSkeleton />
            ) : (
              getList(key).map((item) => (
                <Card key={item.id} data={item} mediaType={mediaType} />
              ))
            )}
          </CardCarousel>
        ))}
      </div>
    </section>
  );
}

export default Home;