export default function MovieCreateModal({
  isOpen,
  onClose,
  handleSubmit,
  onSubmit,
  register,
  errors,
  submitting,
  formError,
  successMessage,
  genres,
  genresLoading,
  genresError,
  selectedGenres,
  toggleGenre,
  dropdownRef,
  genreDropdownOpen,
  setGenreDropdownOpen,
  findGenreById,
  getGenreNumericId,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3 sm:px-6 py-6 overflow-y-auto">
      <div className="bg-[#0f1228] border border-cyan-500/40 rounded-2xl w-full max-w-[300px] sm:max-w-lg p-4 sm:p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
          disabled={submitting}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">Agregar Película</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Título</label>
            <input
              {...register("title")}
              className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="Nombre de la película"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Descripción
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
              rows={3}
              placeholder="Sinopsis breve"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Poster URL
            </label>
            <input
              {...register("posterPath")}
              className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">
                Fecha de estreno
              </label>
              <input
                type="date"
                {...register("releaseDate")}
                className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                {...register("rating")}
                className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {formError && <p className="text-red-400 text-sm">{formError}</p>}
          {successMessage && (
            <p className="text-green-400 text-sm">{successMessage}</p>
          )}

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Géneros</label>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                disabled={genresLoading || !!genresError}
                onClick={() => setGenreDropdownOpen((prev) => !prev)}
                className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-cyan-400 focus:outline-none disabled:opacity-60"
              >
                <span>
                  {selectedGenres.length
                    ? "Editar géneros seleccionados"
                    : "Seleccioná géneros"}
                </span>
                <span>{genreDropdownOpen ? "▲" : "▼"}</span>
              </button>
              {genreDropdownOpen && !genresLoading && !genresError && (
                <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-cyan-500/40 rounded-lg shadow-xl">
                  {genres.map((genre) => {
                    const genreId = getGenreNumericId(genre);
                    if (genreId === null) return null;
                    const active = selectedGenres.includes(genreId);
                    return (
                      <button
                        type="button"
                        key={genreId}
                        onClick={() => toggleGenre(genreId)}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          active
                            ? "bg-cyan-500/20 text-cyan-200"
                            : "text-gray-200 hover:bg-cyan-500/10"
                        }`}
                      >
                        {genre?.name ?? genre?.Nombre ?? `ID ${genreId}`}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {genresLoading ? (
              <p className="text-xs text-gray-400">Cargando géneros...</p>
            ) : genresError ? (
              <p className="text-xs text-red-400">{genresError}</p>
            ) : null}
            {selectedGenres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedGenres.map((id) => {
                  const genre = findGenreById(id);
                  return (
                    <span
                      key={id}
                      className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-100 text-xs flex items-center gap-2 border border-cyan-500/30"
                    >
                      {genre?.name ?? genre?.Nombre ?? `ID ${id}`}
                      <button
                        type="button"
                        className="text-cyan-200 hover:text-white"
                        onClick={() => toggleGenre(id)}
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            {errors.genreIds && (
              <p className="text-red-400 text-sm mt-1">
                {errors.genreIds.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
          >
            {submitting ? "Guardando..." : "Crear película"}
          </button>
        </form>
      </div>
    </div>
  );
}
