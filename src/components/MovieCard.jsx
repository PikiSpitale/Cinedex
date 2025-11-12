import { Link } from "wouter";

export default function MovieCard({
  movie,
  compact = false,
  disableLink = false,
  children,
  saved = false,
  onToggleSave = () => {},
}) {
  function handleToggle(e) {
    if (e?.stopPropagation) e.stopPropagation();
    if (e?.preventDefault) e.preventDefault();
    onToggleSave();
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
            onClick={handleToggle}
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
