import { movies } from "../data/movies";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function SavedMovies() {
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("savedMovies");
    setSavedIds(raw ? JSON.parse(raw) : []);
  }, []);

  function remove(id) {
    const next = savedIds.filter((s) => s !== id);
    setSavedIds(next);
    localStorage.setItem("savedMovies", JSON.stringify(next));
  }

  const savedList = movies.filter((m) => savedIds.includes(m.id));

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
                <MovieCard movie={m} compact={true} disableLink={true}>
                  <button
                    onClick={() => remove(m.id)}
                    className="w-full px-3 py-2 mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-md text-sm font-medium transition-all duration-300 border border-red-400/30 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/50"
                  >
                    Eliminar
                  </button>
                </MovieCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
