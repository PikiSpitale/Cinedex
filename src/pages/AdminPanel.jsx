import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth";
import { Redirect } from "wouter";
import { useForm } from "react-hook-form";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
} from "../services/movies";
import { getAllGenres } from "../services/genres";
import { getAllUsers } from "../services/users";
import { getAllRoles } from "../services/roles";
import { updateUserRoles } from "../services/auth";

export default function AdminPanel() {
  const [stats, setStats] = useState({
    usersCount: 0,
    moviesCount: 0,
    forumsCount: 0,
    reviewsCount: 0,
  });
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [pageLoading, setPageLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [genres, setGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(false);
  const [genresError, setGenresError] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const editGenreDropdownRef = useRef(null);
  const [editGenreDropdownOpen, setEditGenreDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [usersRefreshing, setUsersRefreshing] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesError, setRolesError] = useState("");
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [roleFormSubmitting, setRoleFormSubmitting] = useState(false);
  const [roleFormError, setRoleFormError] = useState("");
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const roleDropdownRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError] = useState("");
  const movieDropdownRef = useRef(null);
  const [movieDropdownOpen, setMovieDropdownOpen] = useState(false);
  const [deleteMovieLoadingId, setDeleteMovieLoadingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const selectedMovie = movies.find((m) => m.id === selectedMovieId) ?? null;
  const editMovieDropdownRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMovieDropdownOpen, setEditMovieDropdownOpen] = useState(false);
  const [editSelectedMovieId, setEditSelectedMovieId] = useState(null);
  const editSelectedMovie =
    movies.find((m) => m.id === editSelectedMovieId) ?? null;
  const [editSelectedGenres, setEditSelectedGenres] = useState([]);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFormError, setEditFormError] = useState("");
  const [editSuccessMessage, setEditSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      posterPath: "",
      releaseDate: "",
      rating: "",
      genreIds: [],
    },
  });
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      posterPath: "",
      releaseDate: "",
      rating: "",
      genreIds: [],
    },
  });

  const loadUsers = async (withSpinner = false) => {
    try {
      if (withSpinner) setUsersRefreshing(true);
      setUsersError("");
      const data = await getAllUsers();
      const list = Array.isArray(data) ? data : [];
      setUsers(list);
      setStats((prev) => ({
        ...prev,
        usersCount: list.length,
      }));
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Error al obtener usuarios";
      setUsersError(message);
    } finally {
      if (withSpinner) setUsersRefreshing(false);
    }
  };

  const loadMovies = async (withSpinner = false) => {
    try {
      if (withSpinner) setMoviesLoading(true);
      setMoviesError("");
      const data = await getAllMovies();
      const list = Array.isArray(data) ? data : [];
      setMovies(list);
      setStats((prev) => ({ ...prev, moviesCount: list.length }));
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Error al obtener películas";
      setMoviesError(message);
      console.error("Error al obtener películas", err);
    } finally {
      if (withSpinner) setMoviesLoading(false);
    }
  };

  const loadGenres = async () => {
    try {
      setGenresLoading(true);
      setGenresError("");
      const data = await getAllGenres();
      setGenres(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Error al cargar los géneros";
      setGenresError(message);
    } finally {
      setGenresLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      setRolesError("");
      const data = await getAllRoles();
      const list = Array.isArray(data) ? data : [];
      setRoles(list);
      return list;
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Error al cargar los roles";
      setRolesError(message);
      return [];
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      setPageLoading(true);
      try {
        await Promise.all([
          loadUsers(),
          loadMovies(true),
          loadGenres(),
          loadRoles(),
        ]);
      } finally {
        if (active) setPageLoading(false);
      }
    };

    initialize();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    register("genreIds", {
      validate: (value) =>
        value && value.length > 0 ? true : "Seleccioná al menos un género",
    });
  }, [register]);

  useEffect(() => {
    registerEdit("genreIds", {
      validate: (value) =>
        value && value.length > 0 ? true : "Seleccioná al menos un género",
    });
  }, [registerEdit]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setGenreDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target)
      ) {
        setRoleDropdownOpen(false);
      }
      if (
        movieDropdownRef.current &&
        !movieDropdownRef.current.contains(event.target)
      ) {
        setMovieDropdownOpen(false);
      }
      if (
        editGenreDropdownRef.current &&
        !editGenreDropdownRef.current.contains(event.target)
      ) {
        setEditGenreDropdownOpen(false);
      }
      if (
        editMovieDropdownRef.current &&
        !editMovieDropdownRef.current.contains(event.target)
      ) {
        setEditMovieDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAdminRole = user?.roles?.some((r) =>
    typeof r === "string" ? r === "Admin" : r?.name === "Admin"
  );

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) => {
      const exists = prev.includes(genreId);
      const next = exists
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId];
      setValue("genreIds", next, { shouldValidate: true });
      return next;
    });
  };

  const normalizeRoleName = (role) =>
    (role?.nombre ?? role?.name ?? role?.Nombre ?? "").toLowerCase();

  const openRoleModal = async (userData = null) => {
    try {
      let availableRoles = roles;
      if (!availableRoles.length && !rolesLoading) {
        availableRoles = (await loadRoles()) ?? [];
      }

      let targetUser = userData;
      if (!targetUser && users.length > 0) {
        targetUser = users[0];
      }

      if (targetUser) {
        const matchedIds = getRoleIdsForUser(targetUser, availableRoles);
        setSelectedRoleIds(matchedIds);
      } else {
        setSelectedRoleIds([]);
      }

      setSelectedUser(targetUser);
      setRoleFormError("");
      setRoleModalOpen(true);
    } catch {
      setSelectedRoleIds([]);
      setSelectedUser(userData ?? null);
      setRoleModalOpen(true);
    }
  };

  const closeRoleModal = () => {
    setRoleModalOpen(false);
    setSelectedUser(null);
    setSelectedRoleIds([]);
    setRoleFormError("");
    setUserDropdownOpen(false);
    setRoleDropdownOpen(false);
  };

  const toggleRoleSelection = (roleId) => {
    if (!selectedUser) return;
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const getRoleIdsForUser = (userData, availableRolesList) => {
    if (!userData || !userData.roles || !availableRolesList?.length) return [];
    const normalizedRoles = userData.roles
      .map((roleName) =>
        typeof roleName === "string"
          ? roleName.toLowerCase()
          : roleName?.nombre?.toLowerCase?.() ?? ""
      )
      .filter(Boolean);

    return availableRolesList
      .filter((role) => normalizedRoles.includes(normalizeRoleName(role)))
      .map((role) => role.id);
  };

  const handleUserSelect = (userData) => {
    setSelectedUser(userData);
    const matchedIds = getRoleIdsForUser(userData, roles);
    setSelectedRoleIds(matchedIds);
    setUserDropdownOpen(false);
    setRoleFormError("");
  };

  const handleRolesSubmit = async (event) => {
    event.preventDefault();
    if (!selectedUser) {
      setRoleFormError("Seleccioná un usuario antes de guardar.");
      return;
    }
    try {
      setRoleFormError("");
      setRoleFormSubmitting(true);
      await updateUserRoles(selectedUser.id, selectedRoleIds);
      const updatedRoleNames = roles
        .filter((role) => selectedRoleIds.includes(role.id))
        .map((role) => role.nombre ?? role.name ?? role.Nombre ?? "");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, roles: updatedRoleNames } : u
        )
      );
      setSelectedUser((prev) =>
        prev ? { ...prev, roles: updatedRoleNames } : prev
      );
      closeRoleModal();
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudieron actualizar los roles";
      setRoleFormError(message);
    } finally {
      setRoleFormSubmitting(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      setFormError("");
      setSuccessMessage("");
      const genreIdsRaw =
        selectedGenres.length > 0 ? selectedGenres : values.genreIds ?? [];
      const genreIdsArray = Array.isArray(genreIdsRaw)
        ? genreIdsRaw
        : [genreIdsRaw];

      await createMovie({
        title: values.title,
        description: values.description,
        posterPath: values.posterPath,
        releaseDate: values.releaseDate,
        rating: values.rating ? parseFloat(values.rating) : 0,
        genreIds: genreIdsArray.map((id) => parseInt(id, 10)).filter(Boolean),
      });
      await loadMovies();
      setSuccessMessage("Película creada correctamente");
      reset();
      setSelectedGenres([]);
      setValue("genreIds", []);
      setTimeout(() => {
        setModalOpen(false);
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo crear la película";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = async () => {
    setEditFormError("");
    setEditSuccessMessage("");
    setEditSelectedMovieId(null);
    setEditSelectedGenres([]);
    setEditGenreDropdownOpen(false);
    resetEdit();
    setEditModalOpen(true);
    if (!movies.length) {
      await loadMovies(true);
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditMovieDropdownOpen(false);
    setEditSelectedMovieId(null);
    setEditSelectedGenres([]);
    setEditGenreDropdownOpen(false);
    setEditFormError("");
    setEditSuccessMessage("");
    resetEdit();
  };

  const handleSelectMovieForEdit = (movie) => {
    if (!movie) return;
    setEditSelectedMovieId(movie.id);
    const genreIds =
      movie.genres
        ?.map((g) => Number(g.id ?? g.genreId ?? g.GenreId))
        .filter((id) => Number.isFinite(id)) ?? [];
    setEditSelectedGenres(genreIds);
    resetEdit({
      title: movie.title ?? movie.Title ?? "",
      description: movie.description ?? movie.Description ?? "",
      posterPath:
        movie.posterPath ??
        movie.poster_path ??
        movie.posterUrl ??
        movie.PosterPath ??
        "",
      releaseDate:
        movie.releaseDate ??
        movie.release_date ??
        movie.ReleaseDate ??
        "",
      rating:
        typeof movie.rating === "number"
          ? movie.rating
          : movie.Rating ?? movie.rating ?? "",
      genreIds,
    });
    setEditValue("genreIds", genreIds, { shouldValidate: true });
    setEditMovieDropdownOpen(false);
  };

  const toggleEditGenre = (genreId) => {
    const numericId = Number(genreId);
    setEditSelectedGenres((prev) => {
      const exists = prev.includes(numericId);
      const next = exists
        ? prev.filter((id) => id !== numericId)
        : [...prev, numericId];
      setEditValue("genreIds", next, { shouldValidate: true });
      return next;
    });
  };

  const onEditSubmit = async (values) => {
    if (!editSelectedMovieId) {
      setEditFormError("Seleccioná una película para editar.");
      return;
    }
    try {
      setEditSubmitting(true);
      setEditFormError("");
      setEditSuccessMessage("");
      const rawGenreIds =
        editSelectedGenres.length > 0
          ? editSelectedGenres
          : values.genreIds ?? [];
      const genreIdsArray = Array.isArray(rawGenreIds)
        ? rawGenreIds
        : [rawGenreIds];
      const payload = {
        title: values.title ?? "",
        description: values.description ?? "",
        posterPath: values.posterPath ?? "",
        releaseDate: values.releaseDate ?? "",
        rating:
          values.rating === "" || values.rating === null
            ? null
            : parseFloat(values.rating),
        genreIds: genreIdsArray.map((id) => parseInt(id, 10)).filter(Boolean),
      };
      await updateMovie(editSelectedMovieId, payload);
      await loadMovies();
      setEditSuccessMessage("Película actualizada correctamente");
      setTimeout(() => {
        closeEditModal();
      }, 1200);
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo actualizar la película";
      setEditFormError(message);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleOpenDeleteModal = async () => {
    setSelectedMovieId(null);
    setMovieDropdownOpen(false);
    setDeleteModalOpen(true);
    if (!movies.length) {
      await loadMovies(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setMovieDropdownOpen(false);
    setSelectedMovieId(null);
    setDeleteMovieLoadingId(null);
  };

  const handleDeleteMovieSubmit = async () => {
    if (!selectedMovieId) {
      alert("Seleccioná una película antes de eliminar");
      return;
    }

    const movie = movies.find((m) => m.id === selectedMovieId);
    const title = movie?.title ?? "la película";
    if (!window.confirm(`¿Eliminar "${title}"?`)) return;

    try {
      setDeleteMovieLoadingId(selectedMovieId);
      await deleteMovie(selectedMovieId);
      setMovies((prev) => prev.filter((m) => m.id !== selectedMovieId));
      setStats((prev) => ({
        ...prev,
        moviesCount: Math.max(prev.moviesCount - 1, 0),
      }));
      alert(`Película "${title}" eliminada correctamente`);
      handleCloseDeleteModal();
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo eliminar la película";
      alert(message);
    } finally {
      setDeleteMovieLoadingId(null);
    }
  };

  if (!isAuthenticated || !hasAdminRole) {
    return <Redirect href="/" />;
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1228] to-[#12152f] flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 text-lg mt-4">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1228] to-[#12152f] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-400">
            Bienvenido al centro de control de Cinedex
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {/* Usuarios */}
          <div className="bg-[#0f1228]/50 backdrop-blur border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/10 transition-all neon-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-semibold">Usuarios</h3>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                <span className="text-cyan-400 text-xl">👥</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{stats.usersCount}</p>
            <p className="text-cyan-400 text-sm mt-2">+5 esta semana</p>
          </div>

          {/* Películas */}
          <div className="bg-[#0f1228]/50 backdrop-blur border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/10 transition-all neon-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-semibold">Películas</h3>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                <span className="text-cyan-400 text-xl">🎬</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{stats.moviesCount}</p>
            <p className="text-cyan-400 text-sm mt-2">+12 esta semana</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-12 mb-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 duration-300"
          >
            + Agregar Película
          </button>
          <button
            onClick={() => openRoleModal()}
            disabled={users.length === 0}
            className="bg-gradient-to-r from-magenta-500 to-pink-500 hover:from-magenta-400 hover:to-pink-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-magenta-500/50 transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gestionar Usuarios
          </button>
          <button
            onClick={handleOpenDeleteModal}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-red-500/40 transform hover:scale-105 duration-300"
          >
            Eliminar Película
          </button>
          <button
            onClick={openEditModal}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-amber-500/40 transform hover:scale-105 duration-300"
          >
            Editar Película
          </button>
        </div>

        {usersError && (
          <p className="text-red-400 text-sm mb-8">{usersError}</p>
        )}
      </div>

      {roleModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#0f1228] border border-cyan-500/40 rounded-2xl w-full max-w-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={closeRoleModal}
              disabled={roleFormSubmitting}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-1 text-white">
              Asignar roles
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {selectedUser
                ? `${selectedUser.userName ?? "Usuario sin nombre"} · ${
                    selectedUser.email ?? "Sin email"
                  }`
                : "Elegí un usuario para editar sus roles."}
            </p>

            {roleFormError && (
              <p className="text-red-400 text-sm mb-3">{roleFormError}</p>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleRolesSubmit}>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Usuario
                </label>
                <div ref={userDropdownRef} className="relative">
                  <button
                    type="button"
                    disabled={!users.length || usersRefreshing}
                    onClick={() =>
                      setUserDropdownOpen((prev) => !prev && !!users.length)
                    }
                    className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-cyan-400 focus:outline-none disabled:opacity-60"
                  >
                    <span>
                      {selectedUser
                        ? `${selectedUser.userName ?? "Usuario"} (${
                            selectedUser.email ?? "Sin email"
                          })`
                        : usersRefreshing
                        ? "Actualizando usuarios..."
                        : "Seleccioná un usuario"}
                    </span>
                    <span>{userDropdownOpen ? "▲" : "▼"}</span>
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-cyan-500/40 rounded-lg shadow-xl">
                      {users.length ? (
                        users.map((userItem) => {
                          const active = selectedUser?.id === userItem.id;
                          return (
                            <button
                              type="button"
                              key={userItem.id}
                              onClick={() => handleUserSelect(userItem)}
                              className={`w-full text-left px-4 py-2 text-sm transition ${
                                active
                                  ? "bg-cyan-500/20 text-cyan-200"
                                  : "text-gray-200 hover:bg-cyan-500/10"
                              }`}
                            >
                              {userItem.userName ?? "Sin nombre"} ·{" "}
                              {userItem.email ?? "Sin email"}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-xs text-gray-400 px-4 py-2">
                          No hay usuarios disponibles.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Roles
                </label>
                <div ref={roleDropdownRef} className="relative">
                  <button
                    type="button"
                    disabled={
                      !selectedUser ||
                      rolesLoading ||
                      (!!rolesError && !roles.length)
                    }
                    onClick={() =>
                      setRoleDropdownOpen((prev) => !prev && !!selectedUser)
                    }
                    className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-cyan-400 focus:outline-none disabled:opacity-60"
                  >
                    <span>
                      {selectedRoleIds.length
                        ? `${selectedRoleIds.length} rol(es) seleccionados`
                        : "Seleccioná roles"}
                    </span>
                    <span>{roleDropdownOpen ? "▲" : "▼"}</span>
                  </button>
                  {roleDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-cyan-500/40 rounded-lg shadow-xl">
                      {!selectedUser ? (
                        <p className="text-xs text-gray-400 px-4 py-2">
                          Seleccioná un usuario primero.
                        </p>
                      ) : rolesLoading ? (
                        <p className="text-xs text-gray-400 px-4 py-2">
                          Cargando roles...
                        </p>
                      ) : rolesError && !roles.length ? (
                        <div className="text-xs text-red-400 px-4 py-2 flex flex-col gap-2">
                          <span>{rolesError}</span>
                          <button
                            type="button"
                            onClick={loadRoles}
                            className="self-start px-3 py-1 rounded bg-cyan-600/70 text-white"
                          >
                            Reintentar
                          </button>
                        </div>
                      ) : roles.length ? (
                        roles.map((role) => {
                          const active = selectedRoleIds.includes(role.id);
                          return (
                            <button
                              type="button"
                              key={role.id}
                              onClick={() => toggleRoleSelection(role.id)}
                              className={`w-full text-left px-4 py-2 text-sm transition ${
                                active
                                  ? "bg-cyan-500/20 text-cyan-200"
                                  : "text-gray-200 hover:bg-cyan-500/10"
                              }`}
                            >
                              {role.nombre ?? role.name ?? `Rol ${role.id}`}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-xs text-gray-400 px-4 py-2">
                          No hay roles configurados aún.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {selectedRoleIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedRoleIds.map((id) => {
                      const role = roles.find((r) => r.id === id);
                      return (
                        <span
                          key={id}
                          className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-100 text-xs flex items-center gap-2 border border-cyan-500/30"
                        >
                          {role?.nombre ?? role?.name ?? `Rol ${id}`}
                          <button
                            type="button"
                            className="text-cyan-200 hover:text-white"
                            onClick={() => toggleRoleSelection(id)}
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeRoleModal}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700/40 transition disabled:opacity-50"
                  disabled={roleFormSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={roleFormSubmitting || rolesLoading}
                  className="px-4 py-2 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 transition font-semibold disabled:opacity-50"
                >
                  {roleFormSubmitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#0f1228] border border-red-500/40 rounded-2xl w-full max-w-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
              onClick={handleCloseDeleteModal}
              disabled={!!deleteMovieLoadingId}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-1 text-white">
              Eliminar película
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Seleccioná la película que querés eliminar del catálogo.
            </p>

            {moviesError && (
              <div className="text-red-400 text-sm mb-4 flex flex-col gap-2">
                <span>{moviesError}</span>
                <button
                  type="button"
                  onClick={() => loadMovies(true)}
                  disabled={moviesLoading}
                  className="self-start px-3 py-1 rounded bg-red-500/30 hover:bg-red-500/50 text-red-100 transition disabled:opacity-60"
                >
                  {moviesLoading ? "Reintentando..." : "Reintentar"}
                </button>
              </div>
            )}

            <div>
              <label className="text-sm text-gray-300 mb-1 block">
                Película
              </label>
              <div ref={movieDropdownRef} className="relative">
                <button
                  type="button"
                  disabled={moviesLoading}
                  onClick={() => setMovieDropdownOpen((prev) => !prev)}
                  className="w-full bg-[#1a1f3a] border border-red-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-red-400 focus:outline-none disabled:opacity-60"
                >
                  <span>
                    {selectedMovie
                      ? selectedMovie.title ?? `ID ${selectedMovie.id}`
                      : moviesLoading
                      ? "Cargando películas..."
                      : movies.length
                      ? "Seleccioná una película"
                      : "No hay películas disponibles"}
                  </span>
                  <span>{movieDropdownOpen ? "▲" : "▼"}</span>
                </button>
                {movieDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-red-500/40 rounded-lg shadow-xl">
                    {moviesLoading ? (
                      <p className="text-xs text-gray-400 px-4 py-2">
                        Cargando películas...
                      </p>
                    ) : movies.length ? (
                      movies.map((movieItem) => {
                        const active = selectedMovieId === movieItem.id;
                        return (
                          <button
                            type="button"
                            key={movieItem.id}
                            onClick={() => {
                              setSelectedMovieId(movieItem.id);
                              setMovieDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition ${
                              active
                                ? "bg-red-500/20 text-red-200"
                                : "text-gray-200 hover:bg-red-500/10"
                            }`}
                          >
                            {movieItem.title ?? `Película ${movieItem.id}`}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-400 px-4 py-2">
                        No hay películas para eliminar.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700/40 transition disabled:opacity-50"
                disabled={!!deleteMovieLoadingId}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteMovieSubmit}
                disabled={!selectedMovieId || !!deleteMovieLoadingId}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 transition font-semibold text-white disabled:opacity-50"
              >
                {deleteMovieLoadingId ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#0f1228] border border-amber-500/40 rounded-2xl w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
              onClick={closeEditModal}
              disabled={editSubmitting}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2 text-white">
              Editar película
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Seleccioná una película para precargar sus datos y actualizá los
              campos necesarios.
            </p>

            {editFormError && (
              <p className="text-red-400 text-sm mb-3">{editFormError}</p>
            )}
            {editSuccessMessage && (
              <p className="text-emerald-400 text-sm mb-3">
                {editSuccessMessage}
              </p>
            )}

            <div className="mb-6">
              <label className="text-sm text-gray-300 mb-1 block">
                Película a editar
              </label>
              <div ref={editMovieDropdownRef} className="relative">
                <button
                  type="button"
                  disabled={moviesLoading}
                  onClick={() =>
                    setEditMovieDropdownOpen((prev) => !prev && !!movies.length)
                  }
                  className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-amber-400 focus:outline-none disabled:opacity-60"
                >
                  <span>
                    {editSelectedMovie
                      ? editSelectedMovie.title ?? "Película seleccionada"
                      : moviesLoading
                      ? "Cargando películas..."
                      : movies.length
                      ? "Seleccioná una película"
                      : "No hay películas disponibles"}
                  </span>
                  <span>{editMovieDropdownOpen ? "▲" : "▼"}</span>
                </button>
                {editMovieDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-amber-500/40 rounded-lg shadow-xl">
                    {moviesLoading ? (
                      <p className="text-xs text-gray-400 px-4 py-2">
                        Cargando películas...
                      </p>
                    ) : movies.length ? (
                      movies.map((movieItem) => {
                        const active = editSelectedMovieId === movieItem.id;
                        return (
                          <button
                            type="button"
                            key={movieItem.id}
                            onClick={() => handleSelectMovieForEdit(movieItem)}
                            className={`w-full text-left px-4 py-2 text-sm transition ${
                              active
                                ? "bg-amber-500/20 text-amber-200"
                                : "text-gray-200 hover:bg-amber-500/10"
                            }`}
                          >
                            {movieItem.title ?? `Película ${movieItem.id}`}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-400 px-4 py-2">
                        No hay películas para editar.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleEditSubmit(onEditSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Título
                  </label>
                  <input
                    {...registerEdit("title", { required: true })}
                    disabled={!editSelectedMovie || editSubmitting}
                    className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-60"
                    placeholder="Título de la película"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Fecha de estreno
                  </label>
                  <input
                    type="date"
                    {...registerEdit("releaseDate")}
                    disabled={!editSelectedMovie || editSubmitting}
                    className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Descripción
                </label>
                <textarea
                  {...registerEdit("description")}
                  disabled={!editSelectedMovie || editSubmitting}
                  className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-60"
                  rows={3}
                  placeholder="Actualizá la sinopsis"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Poster URL
                  </label>
                  <input
                    {...registerEdit("posterPath")}
                    disabled={!editSelectedMovie || editSubmitting}
                    className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-60"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    {...registerEdit("rating")}
                    disabled={!editSelectedMovie || editSubmitting}
                    className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:border-amber-400 focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Géneros
                </label>
                <div className="relative" ref={editGenreDropdownRef}>
                  <button
                    type="button"
                    disabled={
                      !editSelectedMovie ||
                      genresLoading ||
                      !!genresError ||
                      editSubmitting
                    }
                    onClick={() =>
                      !editSelectedMovie
                        ? null
                        : setEditGenreDropdownOpen((prev) => !prev)
                    }
                    className="w-full bg-[#1a1f3a] border border-amber-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-amber-400 focus:outline-none disabled:opacity-60"
                  >
                    <span>
                      {editSelectedGenres.length
                        ? "Editar géneros seleccionados"
                        : "Seleccioná géneros"}
                    </span>
                    <span>{editGenreDropdownOpen ? "▲" : "▼"}</span>
                  </button>
                  {editGenreDropdownOpen &&
                    !genresLoading &&
                    !genresError &&
                    editSelectedMovie && (
                      <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-amber-500/40 rounded-lg shadow-xl">
                        {genres.map((genre) => {
                          const id = Number(genre.id ?? genre.Id);
                          const active = editSelectedGenres.includes(id);
                          return (
                            <button
                              type="button"
                              key={`${genre.id ?? genre.Id}`}
                              onClick={() => toggleEditGenre(id)}
                              className={`w-full text-left px-4 py-2 text-sm transition ${
                                active
                                  ? "bg-amber-500/20 text-amber-200"
                                  : "text-gray-200 hover:bg-amber-500/10"
                              }`}
                            >
                              {genre.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                </div>
                {editSelectedGenres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editSelectedGenres.map((id) => {
                      const genre = genres.find(
                        (g) => Number(g.id ?? g.Id) === id
                      );
                      return (
                        <span
                          key={id}
                          className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-100 text-xs flex items-center gap-2 border border-amber-500/30"
                        >
                          {genre?.name ?? `ID ${id}`}
                          <button
                            type="button"
                            className="text-amber-200 hover:text-white"
                            onClick={() => toggleEditGenre(id)}
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                {editErrors.genreIds && (
                  <p className="text-red-400 text-sm mt-1">
                    {editErrors.genreIds.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700/40 transition disabled:opacity-50"
                  disabled={editSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!editSelectedMovie || editSubmitting}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition font-semibold text-white disabled:opacity-50"
                >
                  {editSubmitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#0f1228] border border-cyan-500/40 rounded-2xl w-full max-w-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Agregar Película
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Título
                </label>
                <input
                  {...register("title", { required: true })}
                  className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="Nombre de la película"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Descripción
                </label>
                <textarea
                  {...register("description")}
                  className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  rows={3}
                  placeholder="Sinopsis breve"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Poster URL
                </label>
                <input
                  {...register("posterPath")}
                  className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Fecha de estreno
                  </label>
                  <input
                    type="date"
                    {...register("releaseDate")}
                    className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    {...register("rating")}
                    className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {formError && <p className="text-red-400 text-sm">{formError}</p>}
              {successMessage && (
                <p className="text-green-400 text-sm">{successMessage}</p>
              )}

              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Géneros
                </label>
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    disabled={genresLoading || !!genresError}
                    onClick={() => setGenreDropdownOpen((prev) => !prev)}
                    className="w-full bg-[#1a1f3a] border border-cyan-500/30 rounded-lg px-4 py-2 text-white flex justify-between items-center focus:border-cyan-400 focus:outline-none disabled:opacity-60"
                  >
                    <span>
                      {selectedGenres.length
                        ? "Editar géneros seleccionados"
                        : "Seleccioná géneros"}
                    </span>
                    <span>{genreDropdownOpen ? "▲" : "▼"}</span>
                  </button>
                  {genreDropdownOpen && !genresLoading && !genresError && (
                    <div className="absolute z-50 mt-2 w-full max-h-48 overflow-y-auto bg-[#0f1228] border border-cyan-500/40 rounded-lg shadow-xl">
                      {genres.map((genre) => {
                        const active = selectedGenres.includes(genre.id);
                        return (
                          <button
                            type="button"
                            key={genre.id}
                            onClick={() => toggleGenre(genre.id)}
                            className={`w-full text-left px-4 py-2 text-sm transition ${
                              active
                                ? "bg-cyan-500/20 text-cyan-200"
                                : "text-gray-200 hover:bg-cyan-500/10"
                            }`}
                          >
                            {genre.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {genresLoading ? (
                  <p className="text-xs text-gray-400">Cargando géneros...</p>
                ) : genresError ? (
                  <p className="text-xs text-red-400">{genresError}</p>
                ) : null}
                {selectedGenres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedGenres.map((id) => {
                      const genre = genres.find((g) => g.id === id);
                      return (
                        <span
                          key={id}
                          className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-100 text-xs flex items-center gap-2 border border-cyan-500/30"
                        >
                          {genre?.name ?? `ID ${id}`}
                          <button
                            type="button"
                            className="text-cyan-200 hover:text-white"
                            onClick={() => toggleGenre(id)}
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                {errors.genreIds && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.genreIds.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
              >
                {submitting ? "Guardando..." : "Crear película"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
