import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getAllMovies } from "../services/movies";
import { useAuthStore } from "../store/auth";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favorites";
import { getAllGenres } from "../services/genres";

const MOVIES_PAGE_SIZE = 20;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(() => new Set());
  const [visibleCount, setVisibleCount] = useState(MOVIES_PAGE_SIZE);
  const sentinelRef = useRef(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getAllMovies();
        setMovies(data ?? []);
      } catch (err) {
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Error al obtener películas";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setGenres(data ?? []);
      } catch (err) {
        console.error("No se pudieron obtener los géneros", err);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      return;
    }

    let isMounted = true;

    const fetchFavorites = async () => {
      try {
        const favorites = await getFavorites();
        if (!isMounted) return;
        const ids = new Set(
          (favorites ?? []).map(
            (fav) => fav?.movieId ?? fav?.MovieId ?? fav?.id
          )
        );
        setFavoriteIds(ids);
      } catch (err) {
        console.error("No se pudieron obtener los favoritos", err);
      }
    };

    fetchFavorites();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleToggleFavorite = async (movieId) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para guardar películas");
      return;
    }

    const wasFavorite = favoriteIds.has(movieId);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorite) {
        next.delete(movieId);
      } else {
        next.add(movieId);
      }
      return next;
    });

    try {
      if (wasFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
    } catch (err) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) {
          next.add(movieId);
        } else {
          next.delete(movieId);
        }
        return next;
      });

      const status = err?.response?.status;
      if (!wasFavorite && status === 400) {
        alert(err?.response?.data?.message ?? "La película ya está guardada");
      } else if (status === 401 || status === 403) {
        alert("Tu sesión expiró, vuelve a iniciar sesión.");
      } else {
        alert("No se pudo actualizar tus favoritos. Inténtalo nuevamente.");
      }
    }
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genreId)) {
        next.delete(genreId);
      } else {
        next.add(genreId);
      }
      return next;
    });
  };

  const clearGenres = () => setSelectedGenres(new Set());

  const filteredMovies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return movies.filter((movie) => {
      const title = movie.title?.toLowerCase() ?? "";
      const description = movie.description?.toLowerCase() ?? "";
      const matchesSearch =
        !query || title.includes(query) || description.includes(query);

      if (selectedGenres.size === 0) return matchesSearch;

      const movieGenres = movie.genres ?? [];
      const movieGenreIds = movieGenres.map((g) =>
        Number(g.id ?? g.genreId ?? g.genreID)
      );

      const matchesAllGenres = Array.from(selectedGenres).every((genreId) =>
        movieGenreIds.includes(genreId)
      );

      return matchesSearch && matchesAllGenres;
    });
  }, [movies, search, selectedGenres]);

  useEffect(() => {
    setVisibleCount(Math.min(MOVIES_PAGE_SIZE, filteredMovies.length));
  }, [search, selectedGenres, filteredMovies.length]);

  const visibleMovies = filteredMovies.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMovies.length;

  const loadMoreMovies = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(filteredMovies.length, prev + MOVIES_PAGE_SIZE)
    );
  }, [filteredMovies.length]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          loadMoreMovies();
        }
      },
      {
        rootMargin: "400px",
      }
    );

    const current = sentinelRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
      observer.disconnect();
    };
  }, [hasMore, loadMoreMovies]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando películas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#0a0e27] via-[#0f1228] to-[#12152f] p-4 sm:p-8">
      <div className="text-center p-4 sm:p-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold mb-6 sm:mb-10">
          CATÁLOGO DE PELÍCULAS
        </h1>
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o descripción"
            className="w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/40 transition"
            aria-label="Buscar películas"
          />
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={clearGenres}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                selectedGenres.size === 0
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                  : "border-cyan-500/30 text-gray-300 hover:border-cyan-400"
              }`}
            >
              Todos los géneros
            </button>
            {genres.map((genre) => {
              const id = Number(genre.id ?? genre.Id);
              const isActive = selectedGenres.has(id);
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => toggleGenre(id)}
                  className={`px-4 py-2 rounded-full border text-sm transition ${
                    isActive
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                      : "border-cyan-500/30 text-gray-300 hover:border-cyan-400"
                  }`}
                >
                  {genre.name ?? genre.Name ?? "Género"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8">
        {visibleMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{
              id: movie.id,
              title: movie.title,
              poster_path: movie.posterPath,
              release_date: movie.releaseDate,
              genres: movie.genres ?? [],
              rating: movie.rating ?? "N/A",
            }}
            saved={favoriteIds.has(movie.id)}
            onToggleSave={() => handleToggleFavorite(movie.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="mt-8 text-center text-sm text-cyan-300"
          aria-live="polite"
        >
          Cargando más películas...
        </div>
      )}
    </div>
  );
}
