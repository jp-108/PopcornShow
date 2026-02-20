import React, { useEffect, useState, useRef, useCallback } from "react";
import "./style.scss";
import Card from "../../components/cards/Card";
import { fetchData } from "../../store/fetchApi";
import { useParams } from "react-router-dom";
import { FaChevronDown, FaSpinner } from "react-icons/fa6";
import { BsCollectionPlay, BsCameraReels } from "react-icons/bs";

// ── Constants ─────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { label: "Popularity",    value: "popularity.desc" },
  { label: "Top Rated",     value: "vote_average.desc" },
  { label: "Latest",        value: "primary_release_date.desc" },
  { label: "Oldest",        value: "primary_release_date.asc" },
];

const GENRES = {
  movie: [
    { id: 28,    name: "Action" },
    { id: 12,    name: "Adventure" },
    { id: 16,    name: "Animation" },
    { id: 35,    name: "Comedy" },
    { id: 80,    name: "Crime" },
    { id: 99,    name: "Documentary" },
    { id: 18,    name: "Drama" },
    { id: 14,    name: "Fantasy" },
    { id: 27,    name: "Horror" },
    { id: 9648,  name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878,   name: "Sci-Fi" },
    { id: 53,    name: "Thriller" },
  ],
  tv: [
    { id: 10759, name: "Action & Adventure" },
    { id: 16,    name: "Animation" },
    { id: 35,    name: "Comedy" },
    { id: 80,    name: "Crime" },
    { id: 99,    name: "Documentary" },
    { id: 18,    name: "Drama" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 9648,  name: "Mystery" },
    { id: 10768, name: "War & Politics" },
    { id: 37,    name: "Western" },
  ],
};

function ExplorePage() {
  const { mediaType } = useParams();

  const [data,        setData]        = useState([]);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [sortBy,      setSortBy]      = useState("popularity.desc");
  const [activeGenres,setActiveGenres]= useState([]);

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);
  const isTV = mediaType === "tv";

  // ── Reset whenever mediaType / sort / genres change ───────────────────────
  useEffect(() => {
    setData([]);
    setPage(1);
    setTotalPages(1);
    setError(null);
  }, [mediaType, sortBy, activeGenres]);

  // ── Fetch page ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const genreParam = activeGenres.length ? `&with_genres=${activeGenres.join(",")}` : "";
        const res = await fetchData(
          `/discover/${mediaType}?sort_by=${sortBy}&page=${page}${genreParam}`
        );
        if (cancelled) return;
        setData((prev) => page === 1 ? res.results : [...prev, ...res.results]);
        setTotalPages(res.total_pages);
      } catch (err) {
        if (!cancelled) setError("Failed to load content. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [mediaType, sortBy, activeGenres, page]);

  // ── Infinite scroll via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && page < totalPages) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  // ── Genre toggle ──────────────────────────────────────────────────────────
  const toggleGenre = useCallback((id) => {
    setActiveGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }, []);

  const genreList = GENRES[mediaType] ?? [];

  // if url changes page scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mediaType]);

  return (
    <div className="explore">

      {/* ── Page header ── */}
      <div className="explore__header">
        <div className="explore__title-row">
          {isTV ? <BsCollectionPlay className="explore__icon" /> : <BsCameraReels className="explore__icon" />}
          <h1 className="explore__title">
            {isTV ? "TV Shows" : "Movies"}
          </h1>
          {data.length > 0 && (
            <span className="explore__count">{data.length} titles</span>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="explore__sort">
          <label className="explore__sort-label">Sort by</label>
          <div className="explore__select-wrap">
            <select
              className="explore__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FaChevronDown className="explore__select-icon" />
          </div>
        </div>
      </div>

      {/* ── Genre filter pills ── */}
      <div className="explore__genres">
        {genreList.map((g) => (
          <button
            key={g.id}
            className={`explore__genre-pill ${activeGenres.includes(g.id) ? "active" : ""}`}
            onClick={() => toggleGenre(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* ── Active filter summary ── */}
      {activeGenres.length > 0 && (
        <div className="explore__active-filters">
          <span className="explore__filter-label">Filtered by:</span>
          {activeGenres.map((id) => {
            const g = genreList.find((x) => x.id === id);
            return (
              <button
                key={id}
                className="explore__filter-tag"
                onClick={() => toggleGenre(id)}
              >
                {g?.name} ✕
              </button>
            );
          })}
          <button
            className="explore__filter-clear"
            onClick={() => setActiveGenres([])}
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="explore__error">
          <p>{error}</p>
          <button onClick={() => setPage((p) => p)}>Retry</button>
        </div>
      )}

      {/* ── Results grid ── */}
      {!error && (
        <div className="explore__grid">
          {data.map((item) => (
            <Card key={`${item.id}-${item.media_type}`} data={item} mediaType={mediaType} />
          ))}

          {/* Skeleton cards while loading first page */}
          {loading && page === 1 &&
            Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="explore__skeleton" />
            ))
          }
        </div>
      )}

      {/* ── Load more spinner (infinite scroll) ── */}
      {loading && page > 1 && (
        <div className="explore__spinner">
          <FaSpinner className="spinning" />
          <span>Loading more…</span>
        </div>
      )}

      {/* ── End of results ── */}
      {!loading && page >= totalPages && data.length > 0 && (
        <p className="explore__end">You've seen it all</p>
      )}

      {/* Sentinel for IntersectionObserver */}
      <div ref={sentinelRef} className="explore__sentinel" />
    </div>
  );
}

export default ExplorePage;