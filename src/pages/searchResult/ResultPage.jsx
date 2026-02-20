import React, { useEffect, useState, useRef, useCallback } from "react";
import "./style.scss";
import Card from "../../components/cards/Card";
import { fetchData } from "../../store/fetchApi";
import { useParams, useNavigate } from "react-router-dom";
import { FaSpinner, FaMagnifyingGlass } from "react-icons/fa6";
import { BsCollectionPlay, BsCameraReels, BsSearch } from "react-icons/bs";

// ── Media type filter tabs ────────────────────────────────────────────────────
const TABS = [
  { label: "All",     value: "all" },
  { label: "Movies",  value: "movie" },
  { label: "TV Shows",value: "tv" },
];

function ResultPage() {
  const { query }    = useParams();
  const navigate     = useNavigate();

  const [data,        setData]        = useState([]);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalResults,setTotalResults]= useState(0);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [activeTab,   setActiveTab]   = useState("all");

  const sentinelRef = useRef(null);

  // ── Reset on new query ────────────────────────────────────────────────────
  useEffect(() => {
    setData([]);
    setPage(1);
    setTotalPages(1);
    setTotalResults(0);
    setError(null);
  }, [query, activeTab]);

  // ── Fetch results ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!query?.trim()) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchData(
          `/search/multi?query=${encodeURIComponent(query)}&page=${page}`
        );
        if (cancelled) return;

        // Filter out persons + apply tab filter
        const filtered = res.results.filter((item) => {
          if (item.media_type === "person") return false;
          if (activeTab === "all") return true;
          return item.media_type === activeTab;
        });

        setData((prev) => page === 1 ? filtered : [...prev, ...filtered]);
        setTotalPages(res.total_pages);
        setTotalResults(res.total_results);
      } catch (err) {
        if (!cancelled) setError("Something went wrong. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [query, page, activeTab]);

  // ── Infinite scroll ───────────────────────────────────────────────────────
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

  // ── Tab change ────────────────────────────────────────────────────────────
  const handleTab = useCallback((val) => {
    setActiveTab(val);
  }, []);

  const hasResults  = data.length > 0;
  const isEmpty     = !loading && !error && !hasResults;

  return (
    <div className="results">

      {/* ── Header ── */}
      <div className="results__header">
        <div className="results__title-row">
          <BsSearch className="results__icon" />
          <div>
            <p className="results__label">Search results for</p>
            <h1 className="results__query">"{query}"</h1>
          </div>
          {totalResults > 0 && (
            <span className="results__count">
              {totalResults.toLocaleString()} results
            </span>
          )}
        </div>

        {/* ── Filter tabs ── */}
        <div className="results__tabs">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={`results__tab ${activeTab === tab.value ? "active" : ""}`}
              onClick={() => handleTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="results__error">
          <p>{error}</p>
          <button onClick={() => setPage((p) => p)}>Retry</button>
        </div>
      )}

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="results__empty">
          <FaMagnifyingGlass className="results__empty-icon" />
          <h2 className="results__empty-title">No results found</h2>
          <p className="results__empty-sub">
            We couldn't find anything for <strong>"{query}"</strong>.
            <br />Try different keywords or browse our catalogue.
          </p>
          <div className="results__empty-actions">
            <button
              className="results__empty-btn results__empty-btn--primary"
              onClick={() => navigate("/explore/movie")}
            >
              <BsCameraReels /> Browse Movies
            </button>
            <button
              className="results__empty-btn results__empty-btn--secondary"
              onClick={() => navigate("/explore/tv")}
            >
              <BsCollectionPlay /> Browse TV Shows
            </button>
          </div>
        </div>
      )}

      {/* ── Results grid ── */}
      {!error && (
        <div className="results__grid">
          {data.map((item) => (
            <Card
              key={`${item.id}-${item.media_type}`}
              data={item}
              mediaType={item.media_type}
            />
          ))}

          {/* Skeleton on first page load */}
          {loading && page === 1 &&
            Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="results__skeleton" />
            ))
          }
        </div>
      )}

      {/* ── Load more spinner ── */}
      {loading && page > 1 && (
        <div className="results__spinner">
          <FaSpinner className="spinning" />
          <span>Loading more…</span>
        </div>
      )}

      {/* ── End of results ── */}
      {!loading && page >= totalPages && hasResults && (
        <p className="results__end">End of results</p>
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} className="results__sentinel" />
    </div>
  );
}

export default ResultPage;