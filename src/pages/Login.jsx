import { useState } from "react";
import { useLocation } from "wouter";
import { logIn } from "../services/auth";
import { useAuthStore } from "../store/auth";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [, navigate] = useLocation();
  const loginStore = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    const { emailOrUsername, password } = formData;
    if (!emailOrUsername) {
      newErrors.emailOrUsername = "Usuario o email es requerido";
    } else if (
      emailOrUsername.includes("@") &&
      !/\S+@\S+\.\S+/.test(emailOrUsername)
    ) {
      newErrors.emailOrUsername = "Email no válido";
    }

    if (!password) newErrors.password = "Contraseña es requerida";
    return newErrors;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpia error del campo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setFormError("");
      setLoading(true);
      const data = await logIn(formData); // backend devuelve { token, user }
      loginStore(data); // guarda token + user en zustand
      navigate("/movies");
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo iniciar sesión";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-md mt-33">
        <div className="bg-[#0f1228]/80 backdrop-blur-lg border min-h-[200px] border-cyan-500/30 rounded-2xl p-8 shadow-2xl neon-glow">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Iniciar Sesión
          </h1>
          <p className="text-center text-gray-400 mb-8">Bienvenido a Cinedex</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="emailOrUsername"
                placeholder="Usuario o Email"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border ${
                  errors.emailOrUsername
                    ? "border-red-500"
                    : "border-cyan-500/30"
                } text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all`}
              />
              {errors.emailOrUsername && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.emailOrUsername}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border ${
                  errors.password ? "border-red-500" : "border-cyan-500/30"
                } text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all`}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300"
            >
              {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>
          {formError && (
            <p className="text-red-400 text-sm text-center mt-2">{formError}</p>
          )}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            <span className="text-gray-400 text-sm">o</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          </div>

          <p className="text-center mt-6 text-gray-400">
            ¿No tienes cuenta?{" "}
            <a
              href="/signin"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Registrarse
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
