import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getAllMovies } from "../services/movies";
import { useAuthStore } from "../store/auth";
import { getFavorites, addFavorite, removeFavorite } from "../services/favorites";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());

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
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8">
        {movies.map((movie) => (
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
    </div>
  );
}
