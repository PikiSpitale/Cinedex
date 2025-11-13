import { Link } from "wouter";
import logoMovies from "../images/FondoPelis.png";
import logoDashboard from "../images/FondoDashboard.png";
import { useAuthStore } from "../store/auth";

const Card = ({ to, img, tag, title, excerpt }) => (
  <Link href={to} className="block">
    <div className="group relative overflow-hidden bg-[#0d1b2d]/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-cyan-400/20 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
        <div className="relative overflow-hidden rounded-lg shrink-0 w-full sm:w-auto">
          <img
            src={img || "/placeholder.svg"}
            alt={title}
            className="w-full sm:w-40 h-40 sm:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <span className="inline-block text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full font-semibold mb-3">
              {tag}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {excerpt}
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105">
              Explorar →
            </button>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function HomeCards() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roles?.some((role) =>
    typeof role === "string" ? role === "Admin" : role?.name === "Admin"
  );
  const isMod = user?.roles?.some((role) =>
    typeof role === "string" ? role === "Mod" : role?.name === "Mod"
  );
  const isAdminOrMod = isAdmin || isMod;

  const cards = [
    {
      to: "/movies",
      img: logoMovies,
      tag: "Películas",
      title: "Explorá el catálogo",
      excerpt:
        "Descubrí miles de películas, filtra por género, año y calificación. Encuentra tus películas favoritas y guárdalas en tu lista personal.",
    },
    {
      to: "/admin",
      img: logoDashboard,
      tag: "Estadísticas",
      title: "Panel de administración",
      excerpt:
        "Visualiza estadísticas, gestiona contenido y accede a herramientas exclusivas para administradores de la plataforma.",
    },
  ];

  return (
    <section className="grid gap-4 sm:gap-6 mb-12 sm:mb-20 px-2">
      {cards
        .filter((c) => (c.to === "/admin" ? isAdminOrMod : true))
        .map((c) => (
          <Card key={c.title} {...c} />
        ))}
    </section>
  );
}
