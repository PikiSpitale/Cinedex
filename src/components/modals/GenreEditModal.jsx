export default function GenreEditModal({
  isOpen,
  onClose,
  genres,
  genresLoading,
  genresError,
  loadGenres,
  genreEditPickerRef,
  genreEditPickerOpen,
  setGenreEditPickerOpen,
  genreSelectedForEdit,
  genreEditSelectedId,
  handleSelectGenreForEdit,
  registerGenreEdit,
  handleGenreEditSubmit,
  onEditGenreSubmit,
  genreEditErrors,
  genreEditFormError,
  genreEditSuccessMessage,
  genreEditSubmitting,
  getGenreNumericId,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#0f1228] border border-purple-500/40 rounded-2xl w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
          onClick={onClose}
          disabled={genreEditSubmitting}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2 text-white">Editar género</h2>
        <p className="text-gray-400 text-sm mb-4">
          Seleccioná un género del catálogo y actualizá su información.
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
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Género a editar
          </label>
          <div ref={genreEditPickerRef} className="relative">
            <button
              type="button"
              disabled={genresLoading || !!genresError}
              onClick={() =>
                setGenreEditPickerOpen(
                  (prev) => !prev && !genresLoading && !genresError
                )
              }
              className="w-full bg-[#1a1f3a] border border-purple-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-purple-400 focus:outline-none disabled:opacity-60"
            >
              <span>
                {genreSelectedForEdit
                  ? genreSelectedForEdit.name ??
                    genreSelectedForEdit.Nombre ??
                    `ID ${genreEditSelectedId}`
                  : genresLoading
                  ? "Cargando géneros..."
                  : "Seleccioná un género"}
              </span>
              <span>{genreEditPickerOpen ? "▲" : "▼"}</span>
            </button>
            {genreEditPickerOpen && !genresLoading && !genresError && (
              <div className="absolute z-50 mt-2 w-full max-h-56 overflow-y-auto bg-[#0f1228] border border-purple-500/40 rounded-lg shadow-xl">
                {genres.length ? (
                  genres.map((genre) => {
                    const id = getGenreNumericId(genre);
                    if (id === null) return null;
                    const active = genreEditSelectedId === id;
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => handleSelectGenreForEdit(genre)}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          active
                            ? "bg-purple-500/20 text-purple-100"
                            : "text-gray-200 hover:bg-purple-500/10"
                        }`}
                      >
                        {genre?.name ?? genre?.Nombre ?? `ID ${id}`}
                      </button>
                    );
                  })
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-400">
                    No hay géneros cargados.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleGenreEditSubmit(onEditGenreSubmit)}
        >
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Nombre</label>
            <input
              {...registerGenreEdit("name")}
              disabled={!genreEditSelectedId || genreEditSubmitting}
              className="w-full bg-[#1a1f3a] border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none disabled:opacity-60"
              placeholder="Nombre del género"
            />
            {genreEditErrors.name && (
              <p className="text-red-400 text-sm mt-1">
                {genreEditErrors.name.message}
              </p>
            )}
          </div>
          <div></div>
          {genreEditFormError && (
            <p className="text-red-400 text-sm">{genreEditFormError}</p>
          )}
          {genreEditSuccessMessage && (
            <p className="text-purple-300 text-sm">
              {genreEditSuccessMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={!genreEditSelectedId || genreEditSubmitting}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
          >
            {genreEditSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
