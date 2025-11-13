export default function MovieDeleteModal({
  isOpen,
  onClose,
  movies,
  moviesLoading,
  moviesError,
  loadMovies,
  selectedMovie,
  selectedMovieId,
  setSelectedMovieId,
  movieDropdownRef,
  movieDropdownOpen,
  setMovieDropdownOpen,
  deleteMovieLoadingId,
  handleDeleteMovieSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3 sm:px-6 py-6 overflow-y-auto">
      <div className="bg-[#0f1228] border border-red-500/40 rounded-2xl w-full max-w-[300px] sm:max-w-lg p-4 sm:p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
          onClick={onClose}
          disabled={!!deleteMovieLoadingId}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-1 text-white">
          Eliminar película
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Seleccioná la película que querés eliminar del catálogo.
        </p>

        {moviesError && (
          <div className="text-red-400 text-sm mb-4 flex flex-col gap-2">
            <span>{moviesError}</span>
            <button
              type="button"
              onClick={() => loadMovies(true)}
              disabled={moviesLoading}
              className="self-start px-3 py-1 rounded bg-red-500/30 hover:bg-red-500/50 text-red-100 transition disabled:opacity-60"
            >
              {moviesLoading ? "Reintentando..." : "Reintentar"}
            </button>
          </div>
        )}

        <div>
          <label className="text-sm text-gray-300 mb-1 block">Película</label>
          <div ref={movieDropdownRef} className="relative">
            <button
              type="button"
              disabled={moviesLoading}
              onClick={() => setMovieDropdownOpen((prev) => !prev)}
              className="w-full bg-[#1a1f3a] border border-red-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-red-400 focus:outline-none disabled:opacity-60"
            >
              <span>
                {selectedMovie
                  ? selectedMovie.title ?? `ID ${selectedMovie.id}`
                  : moviesLoading
                  ? "Cargando películas..."
                  : movies.length
                  ? "Seleccioná una película"
                  : "No hay películas disponibles"}
              </span>
              <span>{movieDropdownOpen ? "▲" : "▼"}</span>
            </button>
            {movieDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-red-500/40 rounded-lg shadow-xl">
                {moviesLoading ? (
                  <p className="text-xs text-gray-400 px-4 py-2">
                    Cargando películas...
                  </p>
                ) : movies.length ? (
                  movies.map((movieItem) => {
                    const active = selectedMovieId === movieItem.id;
                    return (
                      <button
                        type="button"
                        key={movieItem.id}
                        onClick={() => {
                          setSelectedMovieId(movieItem.id);
                          setMovieDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          active
                            ? "bg-red-500/20 text-red-200"
                            : "text-gray-200 hover:bg-red-500/10"
                        }`}
                      >
                        {movieItem.title ?? `Película ${movieItem.id}`}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 px-4 py-2">
                    No hay películas para eliminar.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700/40 transition disabled:opacity-50"
            disabled={!!deleteMovieLoadingId}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDeleteMovieSubmit}
            disabled={!selectedMovieId || !!deleteMovieLoadingId}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 transition font-semibold text-white disabled:opacity-50"
          >
            {deleteMovieLoadingId ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
