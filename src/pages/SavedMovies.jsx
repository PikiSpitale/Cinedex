import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getFavorites, removeFavorite } from "../services/favorites";

export default function SavedMovies() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getFavorites();
        setFavorites(data ?? []);
      } catch (err) {
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "No se pudieron cargar tus películas guardadas";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (movieId) => {
    try {
      await removeFavorite(movieId);
      setFavorites((prev) =>
        prev.filter((fav) => (fav.movieId ?? fav.MovieId ?? fav.id) !== movieId)
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo eliminar la película guardada";
      alert(message);
    }
  };

  const savedList = (favorites ?? []).map((fav) => ({
    id: fav?.movieId ?? fav?.MovieId ?? fav?.id,
    title: fav?.title ?? fav?.Title ?? "Sin título",
    poster_path: fav?.posterUrl ?? fav?.PosterUrl ?? "",
    release_date: fav?.releaseDate ?? fav?.ReleaseDate ?? null,
    rating: fav?.rating ?? fav?.Rating ?? "N/A",
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando tus películas guardadas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-center px-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0d1117] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
          Películas Guardadas
        </h1>
        <p className="text-cyan-400/60 mb-8">Tu colección personal</p>

        {savedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-cyan-500/30 rounded-lg backdrop-blur-md bg-cyan-500/5">
            <p className="text-gray-300 text-lg">
              No tienes películas guardadas aún.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Comienza a guardar tus películas favoritas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedList.map((m) => (
              <div key={m.id} className="group relative">
                <MovieCard
                  movie={m}
                  compact={true}
                  disableLink={true}
                  saved={true}
                  onToggleSave={() => handleRemove(m.id)}
                ></MovieCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
