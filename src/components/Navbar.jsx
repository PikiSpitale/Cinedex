import { Link, useLocation } from "wouter";
import logo from "../images/CinedexLogo.png";
import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { logOut } from "../services/auth";

export default function Navbar() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logoutStore = useAuthStore((s) => s.logout);
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const user = useAuthStore((s) => s.user);

  const hasAdminRole = user?.roles?.some((r) =>
    typeof r === "string" ? r === "Admin" : r?.name === "Admin"
  );
  const hasModRole = user?.roles?.some((r) =>
    typeof r === "string" ? r === "Mod" : r?.name === "Mod"
  );

  const linkClass = (path) =>
    `px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
      location === path
        ? "bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/50"
        : "text-gray-300 hover:text-[#00d9ff] hover:bg-[#00d9ff]/10"
    }`;

  const handleLogout = async (closeMenu = false) => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logOut();
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    } finally {
      logoutStore();
      if (closeMenu) setMobileMenuOpen(false);
      setLoggingOut(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#0f1228] to-[#12152f] border-b border-[#00d9ff]/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex justify-between items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1 sm:gap-2 select-none hover:opacity-80 transition-opacity flex-shrink-0"
          style={{ textDecoration: "none" }}
        >
          <img
            src={logo || "/placeholder.svg"}
            alt="Cinedex Logo"
            className="h-6 sm:h-8 w-6 sm:w-8 object-contain"
          />
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#00d9ff] to-[#ff0080] bg-clip-text text-transparent">
            Cinedex
          </span>
        </Link>

        <div className="hidden sm:flex gap-1 md:gap-2 flex-wrap justify-center">
          <Link href="/" className={linkClass("/")}>
            Inicio
          </Link>
          <Link href="/movies" className={linkClass("/movies")}>
            Películas
          </Link>
          <Link href="/saved" className={linkClass("/saved")}>
            Guardadas
          </Link>
          {!hasModRole ||
            (!hasAdminRole && (
              <Link href="/admin" className={linkClass("/admin")}>
                Admin
              </Link>
            ))}
          {isAuthenticated ? (
            <button
              onClick={() => handleLogout(false)}
              disabled={loggingOut}
              className="px-4 py-2 rounded-md bg-[#ff004c]/80 hover:bg-[#ff004c] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingOut ? "Cerrando..." : "Cerrar sesión"}
            </button>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Iniciar sesión
              </Link>
              <Link href="/signin" className={linkClass("/signin")}>
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden text-[#00d9ff] hover:bg-[#00d9ff]/10 p-2 rounded-lg transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#00d9ff]/20 bg-[#0f1228]/95 backdrop-blur-sm">
          <div className="flex flex-col gap-1 px-2 py-2">
            <Link
              href="/"
              className={linkClass("/")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/movies"
              className={linkClass("/movies")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Películas
            </Link>

            <Link
              href="/saved"
              className={linkClass("/saved")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Guardadas
            </Link>
            <Link
              href="/add-movie"
              className={linkClass("/add-movie")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Cargar
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => handleLogout(true)}
                disabled={loggingOut}
                className="w-full text-left px-2 py-2 rounded-md bg-[#ff004c]/80 text-white hover:bg-[#ff004c] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? "Cerrando..." : "Cerrar sesión"}
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className={linkClass("/login")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/signin"
                  className={linkClass("/signin")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
