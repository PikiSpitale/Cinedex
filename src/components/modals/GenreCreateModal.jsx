export default function GenreCreateModal({
  isOpen,
  onClose,
  registerGenreCreate,
  handleGenreCreateSubmit,
  onCreateGenreSubmit,
  genreCreateErrors,
  genreCreateError,
  genreCreateSuccess,
  genreCreateSubmitting,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-start justify-center 
                overflow-y-auto z-50 px-3 sm:px-6 py-6"
    >
      <div className="bg-[#0f1228] border border-emerald-500/40 rounded-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
          onClick={onClose}
          disabled={genreCreateSubmitting}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2 text-white">Agregar género</h2>
        <p className="text-gray-400 text-sm mb-4">
          Creá una nueva categoría para clasificar las películas.
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleGenreCreateSubmit(onCreateGenreSubmit)}
        >
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Nombre</label>
            <input
              {...registerGenreCreate("name")}
              disabled={genreCreateSubmitting}
              className="w-full bg-[#1a1f3a] border border-emerald-500/30 rounded-lg px-4 py-2 text-white focus:border-emerald-400 focus:outline-none disabled:opacity-50"
              placeholder="Ej: Ciencia ficción"
            />
            {genreCreateErrors.name && (
              <p className="text-red-400 text-sm mt-1">
                {genreCreateErrors.name.message}
              </p>
            )}
          </div>

          {genreCreateError && (
            <p className="text-red-400 text-sm">{genreCreateError}</p>
          )}
          {genreCreateSuccess && (
            <p className="text-emerald-400 text-sm">{genreCreateSuccess}</p>
          )}
          <button
            type="submit"
            disabled={genreCreateSubmitting}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
          >
            {genreCreateSubmitting ? "Guardando..." : "Crear género"}
          </button>
        </form>
      </div>
    </div>
  );
}
