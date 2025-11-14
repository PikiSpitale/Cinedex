import HomeCards from "../components/HomeCards";
import { Link } from "wouter";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-[#0a0e27] via-[#0f1228] to-[#12152f] w-full min-h-screen flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-20">
          <div className="relative">
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "80%",
                background: "linear-gradient(135deg, #00d9ff 0%, #ff0080 100%)",
                filter: "blur(60px)",
                opacity: 0.12,
                borderRadius: "50%",
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                BIENVENIDOS A CINEDEX
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-light mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                Tu plataforma definitiva para explorar, calificar y descubrir
                películas. Conecta con cinéfilos y participa en la comunidad más
                apasionada del cine.
              </p>
              <div className="flex gap-2 sm:gap-4 justify-center flex-wrap px-2">
                <Link href="/movies">
                  <button className="px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base border-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
                    Explorar Películas
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white px-2">
            Explora Cinedex
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-transparent rounded ml-2"></div>
        </div>

        <HomeCards />
      </div>
    </div>
  );
};

export default Home;
