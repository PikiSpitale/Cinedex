import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function MovieCard({
  movie,
  compact = false,
  disableLink = false,
  children,
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedMovies");
      const arr = raw ? JSON.parse(raw) : [];
      setSaved(arr.includes(movie.id));
    } catch {
      setSaved(false);
    }
  }, [movie.id]);

  function toggleSave(e) {
    // prevent navigation when clicking the button inside a Link
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();

    try {
      const raw = localStorage.getItem("savedMovies");
      const arr = raw ? JSON.parse(raw) : [];
      let next;
      if (arr.includes(movie.id)) {
        next = arr.filter((id) => id !== movie.id);
        setSaved(false);
      } else {
        next = [movie.id, ...arr];
        setSaved(true);
      }
      localStorage.setItem("savedMovies", JSON.stringify(next));
    } catch (err) {
      console.error("Could not update saved movies", err);
    }
  }

  const inner = (
    <div className="bg-[#1c1c2b]/80 backdrop-blur-md overflow-hidden shadow-lg border border-[#ff004c]/20 hover:border-[#ff004c]/50 hover:shadow-[#ff004c]/30 transition">
      <img
        src={movie.poster_path}
        alt={movie.title}
        className={`w-full ${compact ? "h-48" : "h-64"} object-cover`}
      />
      <div className="p-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-300 mb-1">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-400">⭐ {movie.rating}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2">
          <h5 className="text-sm text-gray-400">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </h5>
          <button
            onClick={(e) => toggleSave(e)}
            className={`px-4 py-2 text-sm rounded-md ${
              saved ? "bg-[#031D44] text-white" : "bg-[#89023E] text-white"
            }`}
            aria-pressed={saved}
          >
            {saved ? "Guardada" : "Guardar"}
          </button>
          {children}
        </div>
      </div>
    </div>
  );

  if (disableLink) {
    return (
      <div className="block transform hover:scale-105 transition relative">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="block transform hover:scale-105 transition relative"
    >
      {inner}
    </Link>
  );
}
