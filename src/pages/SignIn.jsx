import { useState } from "react";
import { useLocation } from "wouter";
import { signUp, logIn } from "../services/auth";
import { useAuthStore } from "../store/auth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [, navigate] = useLocation();
  const loginStore = useAuthStore((s) => s.login);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email no válido";

    if (!formData.userName) newErrors.userName = "Usuario es requerido";
    else if (formData.userName.length < 4)
      newErrors.userName = "Min. 4 caracteres";

    if (!formData.password) newErrors.password = "Contraseña es requerida";
    else if (formData.password.length < 8)
      newErrors.password = "Min. 8 caracteres";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setFormError("");
      await signUp({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Auto login después del registro
      const data = await logIn({
        emailOrUsername: formData.email,
        password: formData.password,
      });
      loginStore(data);
      navigate("/movies");
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo completar el registro";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-md mt-17">
        <div className="bg-[#0f1228]/80 backdrop-blur-lg border min-h-[200px] border-cyan-500/30 rounded-2xl p-8 shadow-2xl neon-glow">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Registrarse
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Únete a la comunidad cinéfila
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border ${
                  errors.email ? "border-red-500" : "border-cyan-500/30"
                } text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="userName"
                placeholder="Usuario"
                value={formData.userName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border ${
                  errors.userName ? "border-red-500" : "border-cyan-500/30"
                } text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all`}
              />
              {errors.userName && (
                <p className="text-red-400 text-sm mt-1">{errors.userName}</p>
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

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1f3a] border ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-cyan-500/30"
                } text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all`}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          {formError && (
            <p className="text-red-400 text-sm text-center mt-2">
              {formError}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            <span className="text-gray-400 text-sm">o</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          </div>

          <p className="text-center mt-6 text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Iniciar Sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
