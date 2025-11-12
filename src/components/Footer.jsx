export default function Footer() {
  return (
    <footer className="w-full bg-[#071226] border border-gray-700 mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="text-sm text-gray-300">
          © {new Date().getFullYear()} Cinedex. Todos los derechos reservados.
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-gray-400 mr-4">
            Seguinos
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Facebook"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent text-gray-300 hover:bg-indigo-600 hover:text-white transition transform hover:scale-110 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.98 3.66 9.12 8.44 9.94v-7.04H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34v7.04C18.34 21.19 22 17.05 22 12.07z" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent text-gray-300 hover:bg-pink-500 hover:text-white transition transform hover:scale-110 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A4.8 4.8 0 1 0 16.8 13 4.8 4.8 0 0 0 12 8.2zm6.4-2.6a1.12 1.12 0 1 0 1.12 1.12A1.12 1.12 0 0 0 18.4 5.6zM12 10.5A1.5 1.5 0 1 1 10.5 12 1.5 1.5 0 0 1 12 10.5z" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="X"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent text-gray-300 hover:bg-sky-600 hover:text-white transition transform hover:scale-110 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.36 5.64a1 1 0 0 0-1.41 0L12 10.59 7.05 5.64A1 1 0 0 0 5.64 7.05L10.59 12l-4.95 4.95a1 1 0 1 0 1.41 1.41L12 13.41l4.95 4.95a1 1 0 0 0 1.41-1.41L13.41 12l4.95-4.95a1 1 0 0 0 0-1.41z" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="GitHub"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent text-gray-300 hover:bg-gray-600 hover:text-white transition transform hover:scale-110 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.95c.58.1.79-.25.79-.56v-2.06c-3.2.7-3.87-1.38-3.87-1.38-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.28 5.68.42.36.79 1.07.79 2.15v3.19c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
