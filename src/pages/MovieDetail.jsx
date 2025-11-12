import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { getMovieById } from "../services/movies";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getMovieById(id);
        setMovie(data);
        // cargar rating guardado
        const raw = localStorage.getItem("ratings");
        const obj = raw ? JSON.parse(raw) : {};
        if (obj && obj[data?.id]) {
          setRating(obj[data.id]);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "No se pudo cargar la película";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  useEffect(() => {
    try {
      if (!movie) return;
      const raw = localStorage.getItem("ratings");
      const obj = raw ? JSON.parse(raw) : {};
      obj[movie.id] = rating;
      localStorage.setItem("ratings", JSON.stringify(obj));
    } catch {
      // ignore
    }
  }, [rating, movie]);

  const handleSave = () => setSaved(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando información...
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1228] to-[#12152f] text-gray-100 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-[#0f1228]/80 backdrop-blur-lg border border-cyan-500/30 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-6 neon-glow">
        {movie ? (
          <>
            <img
              src={movie.posterPath || "/placeholder.svg"}
              alt={movie.title}
              className="w-full md:w-1/2 rounded-xl shadow-lg object-cover border border-cyan-500/30"
            />

            <div className="flex flex-col gap-4 w-full">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {movie.title}
              </h1>
              <p className="text-gray-300 leading-relaxed">
                {movie.description}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                <span>Estreno: {movie.releaseDate}</span>
                {movie.rating && <span>⭐ {movie.rating}</span>}
              </div>
              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id ?? genre.name}
                      className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-cyan-500/30">
                <p className="font-semibold text-white mb-3">Tu puntuación:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer text-4xl transition ${
                        rating >= star ? "text-cyan-400" : "text-gray-600"
                      } hover:text-cyan-300`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-white mb-2">Dejá tu reseña:</p>
                <textarea
                  className="w-full bg-[#1a1f3a] p-4 rounded-lg text-gray-100 border border-cyan-500/30 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 focus:outline-none transition-all"
                  rows="4"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Escribí tu opinión sobre la película..."
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saved}
                className={`mt-6 py-3 px-6 rounded-lg font-semibold transition ${
                  saved
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg hover:shadow-cyan-500/50"
                }`}
              >
                {saved ? "✓ Guardada en tu lista" : "Guardar en mi lista"}
              </button>
            </div>
          </>
        ) : (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-white">
              Película no encontrada
            </h2>
            <p className="text-gray-400 mt-2">
              No hay datos para la película con id «{id}».
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
