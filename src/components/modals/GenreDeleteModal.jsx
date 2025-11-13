export default function GenreDeleteModal({
  isOpen,
  onClose,
  genres,
  genresLoading,
  genresError,
  loadGenres,
  genreDeletePickerRef,
  genreDeletePickerOpen,
  setGenreDeletePickerOpen,
  genreSelectedForDelete,
  selectedGenreToDeleteId,
  handleSelectGenreForDelete,
  deleteGenreLoadingId,
  handleDeleteGenreSubmit,
  genreDeleteError,
  getGenreNumericId,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3 sm:px-6 py-6 overflow-y-auto">
      <div className="bg-[#0f1228] border border-rose-500/40 rounded-2xl w-full max-w-[300px] sm:max-w-lg p-4 sm:p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
          onClick={onClose}
          disabled={!!deleteGenreLoadingId}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-1 text-white">Eliminar género</h2>
        <p className="text-gray-400 text-sm mb-4">
          Seleccioná el género que querés eliminar del catálogo.
        </p>
        {genresError && (
          <div className="text-red-400 text-sm mb-3 flex flex-col gap-2">
            <span>{genresError}</span>
            <button
              type="button"
              onClick={loadGenres}
              disabled={genresLoading}
              className="self-start px-3 py-1 rounded bg-red-500/30 hover:bg-red-500/50 text-red-100 transition disabled:opacity-60"
            >
              {genresLoading ? "Reintentando..." : "Reintentar"}
            </button>
          </div>
        )}
        {genreDeleteError && (
          <p className="text-red-400 text-sm mb-3">{genreDeleteError}</p>
        )}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">Género</label>
          <div ref={genreDeletePickerRef} className="relative">
            <button
              type="button"
              disabled={genresLoading || !!genresError}
              onClick={() =>
                setGenreDeletePickerOpen(
                  (prev) => !prev && !genresLoading && !genresError
                )
              }
              className="w-full bg-[#1a1f3a] border border-rose-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-rose-400 focus:outline-none disabled:opacity-60"
            >
              <span>
                {genreSelectedForDelete
                  ? genreSelectedForDelete.name ??
                    genreSelectedForDelete.Nombre ??
                    `ID ${selectedGenreToDeleteId}`
                  : genresLoading
                  ? "Cargando géneros..."
                  : genres.length
                  ? "Seleccioná un género"
                  : "No hay géneros cargados"}
              </span>
              <span>{genreDeletePickerOpen ? "▲" : "▼"}</span>
            </button>
            {genreDeletePickerOpen && !genresLoading && (
              <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-rose-500/40 rounded-lg shadow-xl">
                {genres.length ? (
                  genres.map((genre) => {
                    const id = getGenreNumericId(genre);
                    if (id === null) return null;
                    const active = selectedGenreToDeleteId === id;
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => handleSelectGenreForDelete(genre)}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          active
                            ? "bg-rose-500/20 text-rose-100"
                            : "text-gray-200 hover:bg-rose-500/10"
                        }`}
                      >
                        {genre?.name ?? genre?.Nombre ?? `ID ${id}`}
                      </button>
                    );
                  })
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-400">
                    No hay géneros disponibles.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={!!deleteGenreLoadingId}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700/40 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDeleteGenreSubmit}
            disabled={!selectedGenreToDeleteId || !!deleteGenreLoadingId}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 font-semibold disabled:opacity-50"
          >
            {deleteGenreLoadingId ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
