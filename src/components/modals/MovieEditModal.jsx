export default function MovieEditModal({
  isOpen,
  onClose,
  editFormError,
  editSuccessMessage,
  editSubmitting,
  movies,
  moviesLoading,
  editSelectedMovie,
  editSelectedMovieId,
  handleSelectMovieForEdit,
  editMovieDropdownRef,
  editMovieDropdownOpen,
  setEditMovieDropdownOpen,
  registerEdit,
  handleEditSubmit,
  onEditSubmit,
  editErrors,
  genres,
  genresLoading,
  genresError,
  editSelectedGenres,
  toggleEditGenre,
  editGenreDropdownRef,
  editGenreDropdownOpen,
  setEditGenreDropdownOpen,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-start justify-center 
                overflow-y-auto z-50 px-3 sm:px-6 py-6"
    >
      <div className="bg-[#0f1228] border border-amber-500/40 rounded-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
          onClick={onClose}
          disabled={editSubmitting}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2 text-white">Editar película</h2>
        <p className="text-gray-400 text-sm mb-4">
          Seleccioná una película para precargar sus datos y actualizá los
          campos necesarios.
        </p>

        {editFormError && (
          <p className="text-red-400 text-sm mb-3">{editFormError}</p>
        )}
        {editSuccessMessage && (
          <p className="text-emerald-400 text-sm mb-3">{editSuccessMessage}</p>
        )}

        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-1 block">
            Película a editar
          </label>
          <div ref={editMovieDropdownRef} className="relative">
            <button
              type="button"
              disabled={moviesLoading}
              onClick={() =>
                setEditMovieDropdownOpen((prev) => !prev && !!movies.length)
              }
              className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-amber-400 focus:outline-none disabled:opacity-60"
            >
              <span>
                {editSelectedMovie
                  ? editSelectedMovie.title ?? "Película seleccionada"
                  : moviesLoading
                  ? "Cargando películas..."
                  : movies.length
                  ? "Seleccioná una película"
                  : "No hay películas disponibles"}
              </span>
              <span>{editMovieDropdownOpen ? "▲" : "▼"}</span>
            </button>
            {editMovieDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-amber-500/40 rounded-lg shadow-xl">
                {moviesLoading ? (
                  <p className="text-xs text-gray-400 px-4 py-2">
                    Cargando películas...
                  </p>
                ) : movies.length ? (
                  movies.map((movieItem) => {
                    const active = editSelectedMovieId === movieItem.id;
                    return (
                      <button
                        type="button"
                        key={movieItem.id}
                        onClick={() => handleSelectMovieForEdit(movieItem)}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          active
                            ? "bg-amber-500/20 text-amber-100"
                            : "text-gray-200 hover:bg-amber-500/10"
                        }`}
                      >
                        {movieItem.title ?? `Película ${movieItem.id}`}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 px-4 py-2">
                    No hay películas cargadas.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleEditSubmit(onEditSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Título</label>
              <input
                {...registerEdit("title")}
                className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-50"
                placeholder="Título de la película"
                disabled={!editSelectedMovie || editSubmitting}
              />
              {editErrors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {editErrors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">
                Fecha de estreno
              </label>
              <input
                type="date"
                {...registerEdit("releaseDate")}
                className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-50"
                disabled={!editSelectedMovie || editSubmitting}
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Descripción
            </label>
            <textarea
              {...registerEdit("description")}
              rows={3}
              className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-50"
              placeholder="Actualizá la descripción"
              disabled={!editSelectedMovie || editSubmitting}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">
                Poster URL
              </label>
              <input
                {...registerEdit("posterPath")}
                className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-50"
                placeholder="https://..."
                disabled={!editSelectedMovie || editSubmitting}
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Rating</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                {...registerEdit("rating")}
                className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-50"
                disabled={!editSelectedMovie || editSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Géneros</label>
            <div ref={editGenreDropdownRef} className="relative">
              <button
                type="button"
                disabled={!editSelectedMovie || genresLoading || !!genresError}
                onClick={() =>
                  setEditGenreDropdownOpen(
                    (prev) => !prev && !!editSelectedMovie && !genresLoading
                  )
                }
                className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-amber-400 focus:outline-none disabled:opacity-60"
              >
                <span>
                  {editSelectedGenres.length
                    ? "Editar géneros seleccionados"
                    : "Seleccioná géneros"}
                </span>
                <span>{editGenreDropdownOpen ? "▲" : "▼"}</span>
              </button>
              {editGenreDropdownOpen && !genresLoading && !genresError && (
                <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-amber-500/40 rounded-lg shadow-xl">
                  {genres.length ? (
                    genres.map((genre) => {
                      const genreId = Number(genre.id ?? genre.Id);
                      if (!Number.isFinite(genreId)) return null;
                      const active = editSelectedGenres.includes(genreId);
                      return (
                        <button
                          type="button"
                          key={genreId}
                          onClick={() => toggleEditGenre(genreId)}
                          className={`w-full text-left px-4 py-2 text-sm transition ${
                            active
                              ? "bg-amber-500/20 text-amber-100"
                              : "text-gray-200 hover:bg-amber-500/10"
                          }`}
                        >
                          {genre?.name ?? genre?.Nombre ?? `ID ${genreId}`}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 px-4 py-2">
                      No hay géneros cargados.
                    </p>
                  )}
                </div>
              )}
            </div>
            {editSelectedGenres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {editSelectedGenres.map((id) => {
                  const genre = genres.find((g) => Number(g.id ?? g.Id) === id);
                  return (
                    <span
                      key={id}
                      className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-100 text-xs flex items-center gap-2 border border-amber-500/30"
                    >
                      {genre?.name ?? `ID ${id}`}
                      <button
                        type="button"
                        className="text-amber-200 hover:text-white"
                        onClick={() => toggleEditGenre(id)}
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            {editErrors.genreIds && (
              <p className="text-red-400 text-sm mt-1">
                {editErrors.genreIds.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700/40 transition disabled:opacity-50"
              disabled={editSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!editSelectedMovie || editSubmitting}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition font-semibold text-white disabled:opacity-50"
            >
              {editSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
