import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getAllMovies } from "../services/movies";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     try {
  //       setError("");
  //       setLoading(true);
  //       const data = await getAllMovies();
  //       setMovies(data ?? []);
  //     } catch (err) {
  //       const message =
  //         err?.response?.data?.message ??
  //         err?.message ??
  //         "Error al obtener películas";
  //       setError(message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMovies();
  // }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getAllMovies();
        console.log(movies.map((m) => m.posterUrl));
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
          />
        ))}
      </div>
    </div>
  );
}
