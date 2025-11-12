import { Route, Switch } from "wouter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const Movies = lazy(() => import("./pages/Movies"));
const Login = lazy(() => import("./pages/Login"));
const SavedMovies = lazy(() => import("./pages/SavedMovies"));
const SignIn = lazy(() => import("./pages/SignIn"));
const MovieDetail = lazy(() => import("./pages/MovieDetail"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0e27] via-[#0f1228] to-[#12152f] text-white">
      <Navbar />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1228] to-[#12152f]">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-cyan-400 font-semibold">Cargando...</p>
              </div>
            </div>
          }
        >
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/movies" component={Movies} />
            <Route path="/movies/:id" component={MovieDetail} />
            <Route path="/saved" component={SavedMovies} />
            <Route path="/signin" component={SignIn} />
            <Route path="/admin" component={AdminPanel} />
          </Switch>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
