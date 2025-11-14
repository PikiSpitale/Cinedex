import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth";
import { Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
} from "../services/movies";
import {
  createGenre,
  deleteGenre,
  getAllGenres,
  updateGenre,
} from "../services/genres";
import { getAllUsers } from "../services/users";
import { getAllRoles } from "../services/roles";
import { updateUserRoles } from "../services/auth";
import RoleAssignModal from "../components/modals/RoleAssignModal";
import MovieDeleteModal from "../components/modals/MovieDeleteModal";
import MovieEditModal from "../components/modals/MovieEditModal";
import MovieCreateModal from "../components/modals/MovieCreateModal";
import GenreCreateModal from "../components/modals/GenreCreateModal";
import GenreEditModal from "../components/modals/GenreEditModal";
import GenreDeleteModal from "../components/modals/GenreDeleteModal";

const ratingFieldSchema = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .refine((value) => {
    if (value === undefined || value === null || value === "") {
      return true;
    }
    const numericValue = typeof value === "number" ? value : Number(value);
    return (
      !Number.isNaN(numericValue) && numericValue >= 0 && numericValue <= 10
    );
  }, "El rating debe estar entre 0 y 10");

const movieFormSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  posterPath: z.string().optional(),
  releaseDate: z.string().optional(),
  rating: ratingFieldSchema,
  genreIds: z
    .array(z.number().int().positive())
    .min(1, "Seleccioná al menos un género"),
});

const genreNameSchema = z
  .string()
  .trim()
  .min(1, "El nombre es obligatorio")
  .refine((value) => value.length >= 2, {
    message: "Usá al menos 2 caracteres",
  });

const genreFormSchema = z.object({
  name: genreNameSchema,
  description: z.string().optional(),
});

export default function AdminPanel() {
  const [stats, setStats] = useState({
    usersCount: 0,
    moviesCount: 0,
    genresCount: 0,
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
  const [genreCreateModalOpen, setGenreCreateModalOpen] = useState(false);
  const [genreCreateSubmitting, setGenreCreateSubmitting] = useState(false);
  const [genreCreateError, setGenreCreateError] = useState("");
  const [genreCreateSuccess, setGenreCreateSuccess] = useState("");
  const [genreEditModalOpen, setGenreEditModalOpen] = useState(false);
  const [genreEditPickerOpen, setGenreEditPickerOpen] = useState(false);
  const genreEditPickerRef = useRef(null);
  const [genreEditSelectedId, setGenreEditSelectedId] = useState(null);
  const [genreEditSubmitting, setGenreEditSubmitting] = useState(false);
  const [genreEditFormError, setGenreEditFormError] = useState("");
  const [genreEditSuccessMessage, setGenreEditSuccessMessage] = useState("");
  const [genreDeleteModalOpen, setGenreDeleteModalOpen] = useState(false);
  const [genreDeletePickerOpen, setGenreDeletePickerOpen] = useState(false);
  const genreDeletePickerRef = useRef(null);
  const [selectedGenreToDeleteId, setSelectedGenreToDeleteId] = useState(null);
  const [deleteGenreLoadingId, setDeleteGenreLoadingId] = useState(null);
  const [genreDeleteError, setGenreDeleteError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(movieFormSchema),
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
    resolver: zodResolver(movieFormSchema),
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
    register: registerGenreCreate,
    handleSubmit: handleGenreCreateSubmit,
    reset: resetGenreCreate,
    formState: { errors: genreCreateErrors },
  } = useForm({
    resolver: zodResolver(genreFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const {
    register: registerGenreEdit,
    handleSubmit: handleGenreEditSubmit,
    reset: resetGenreEdit,
    formState: { errors: genreEditErrors },
  } = useForm({
    resolver: zodResolver(genreFormSchema),
    defaultValues: {
      name: "",
      description: "",
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
      const list = Array.isArray(data) ? data : [];
      setGenres(list);
      setStats((prev) => ({ ...prev, genresCount: list.length }));
      const availableIds = new Set(
        list
          .map((genre) => getGenreNumericId(genre))
          .filter((id) => id !== null)
      );
      setSelectedGenres((prev) => {
        const filtered = prev.filter((id) => availableIds.has(id));
        if (filtered.length !== prev.length) {
          setValue("genreIds", filtered, { shouldValidate: true });
        }
        return filtered;
      });
      setEditSelectedGenres((prev) => {
        const filtered = prev.filter((id) => availableIds.has(id));
        if (filtered.length !== prev.length) {
          setEditValue("genreIds", filtered, { shouldValidate: true });
        }
        return filtered;
      });
      setSelectedGenreToDeleteId((prev) =>
        prev !== null && availableIds.has(prev) ? prev : null
      );
      setGenreEditSelectedId((prev) => {
        const next = prev !== null && availableIds.has(prev) ? prev : null;
        if (next === null && prev !== null) {
          resetGenreEdit();
        }
        return next;
      });
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
        const tasks = [loadMovies(true), loadGenres()];
        if (hasAdminRole) {
          tasks.unshift(loadUsers());
          tasks.push(loadRoles());
        } else if (hasModRole) {
          tasks.unshift(loadUsers());
        }
        await Promise.all(tasks);
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
    register("genreIds");
  }, [register]);

  useEffect(() => {
    registerEdit("genreIds");
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
      if (
        genreEditPickerRef.current &&
        !genreEditPickerRef.current.contains(event.target)
      ) {
        setGenreEditPickerOpen(false);
      }
      if (
        genreDeletePickerRef.current &&
        !genreDeletePickerRef.current.contains(event.target)
      ) {
        setGenreDeletePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAdminRole = user?.roles?.some((r) =>
    typeof r === "string" ? r === "Admin" : r?.name === "Admin"
  );

  const hasModRole = user?.roles?.some((r) =>
    typeof r === "string" ? r === "Mod" : r?.name === "Mod"
  );

  const toGenreNumericId = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const getGenreNumericId = (genre) => {
    if (!genre) return null;
    return toGenreNumericId(
      genre.id ??
        genre.Id ??
        genre.genreId ??
        genre.genreID ??
        genre.GenreId ??
        genre.GenreID
    );
  };

  const findGenreById = (genreId) =>
    genres.find((genre) => getGenreNumericId(genre) === genreId) ?? null;

  const toggleGenre = (genreId) => {
    const numericId = toGenreNumericId(genreId);
    if (numericId === null) {
      return;
    }
    setSelectedGenres((prev) => {
      const exists = prev.includes(numericId);
      const next = exists
        ? prev.filter((id) => id !== numericId)
        : [...prev, numericId];
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
        movie.releaseDate ?? movie.release_date ?? movie.ReleaseDate ?? "",
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

  const openGenreCreateModal = () => {
    setGenreCreateError("");
    setGenreCreateSuccess("");
    resetGenreCreate();
    setGenreCreateModalOpen(true);
  };

  const closeGenreCreateModal = () => {
    setGenreCreateModalOpen(false);
    setGenreCreateError("");
    setGenreCreateSuccess("");
    resetGenreCreate();
  };

  const onCreateGenreSubmit = async (values) => {
    try {
      setGenreCreateSubmitting(true);
      setGenreCreateError("");
      setGenreCreateSuccess("");
      await createGenre({
        name: values.name?.trim() ?? "",
        description: values.description?.trim() ?? "",
      });
      await loadGenres();
      setGenreCreateSuccess("Género creado correctamente");
      setTimeout(() => {
        closeGenreCreateModal();
      }, 1200);
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo crear el género";
      setGenreCreateError(message);
    } finally {
      setGenreCreateSubmitting(false);
    }
  };

  const openGenreEditModal = async () => {
    setGenreEditFormError("");
    setGenreEditSuccessMessage("");
    setGenreEditSelectedId(null);
    setGenreEditPickerOpen(false);
    resetGenreEdit();
    setGenreEditModalOpen(true);
    if (!genres.length) {
      await loadGenres();
    }
  };

  const closeGenreEditModal = () => {
    setGenreEditModalOpen(false);
    setGenreEditPickerOpen(false);
    setGenreEditSelectedId(null);
    setGenreEditFormError("");
    setGenreEditSuccessMessage("");
    resetGenreEdit();
  };

  const handleSelectGenreForEdit = (genre) => {
    const id = getGenreNumericId(genre);
    if (id === null) return;
    setGenreEditSelectedId(id);
    resetGenreEdit({
      name: genre?.name ?? genre?.Nombre ?? "",
      description:
        genre?.description ?? genre?.Descripcion ?? genre?.descripcion ?? "",
    });
    setGenreEditPickerOpen(false);
  };

  const onEditGenreSubmit = async (values) => {
    if (!genreEditSelectedId) {
      setGenreEditFormError("Seleccioná un género para editar");
      return;
    }
    try {
      setGenreEditSubmitting(true);
      setGenreEditFormError("");
      setGenreEditSuccessMessage("");
      await updateGenre(genreEditSelectedId, {
        name: values.name?.trim() ?? "",
        description: values.description?.trim() ?? "",
      });
      await loadGenres();
      setGenreEditSuccessMessage("Género actualizado correctamente");
      setTimeout(() => {
        closeGenreEditModal();
      }, 1200);
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo actualizar el género";
      setGenreEditFormError(message);
    } finally {
      setGenreEditSubmitting(false);
    }
  };

  const openGenreDeleteModal = async () => {
    setGenreDeleteError("");
    setSelectedGenreToDeleteId(null);
    setGenreDeletePickerOpen(false);
    setGenreDeleteModalOpen(true);
    if (!genres.length) {
      await loadGenres();
    }
  };

  const closeGenreDeleteModal = () => {
    setGenreDeleteModalOpen(false);
    setGenreDeletePickerOpen(false);
    setSelectedGenreToDeleteId(null);
    setGenreDeleteError("");
    setDeleteGenreLoadingId(null);
  };

  const handleSelectGenreForDelete = (genre) => {
    const id = getGenreNumericId(genre);
    if (id === null) return;
    setSelectedGenreToDeleteId(id);
    setGenreDeletePickerOpen(false);
  };

  const handleDeleteGenreSubmit = async () => {
    if (!selectedGenreToDeleteId) {
      alert("Seleccioná un género antes de eliminar");
      return;
    }

    const genre = findGenreById(selectedGenreToDeleteId);
    const displayName = genre?.name ?? genre?.Nombre ?? "el género";
    if (!window.confirm(`¿Eliminar "${displayName}"?`)) return;

    try {
      setGenreDeleteError("");
      setDeleteGenreLoadingId(selectedGenreToDeleteId);
      await deleteGenre(selectedGenreToDeleteId);
      await loadGenres();
      alert(`Género "${displayName}" eliminado correctamente`);
      closeGenreDeleteModal();
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo eliminar el género";
      setGenreDeleteError(message);
    } finally {
      setDeleteGenreLoadingId(null);
    }
  };

  const genreSelectedForEdit = findGenreById(genreEditSelectedId);
  const genreSelectedForDelete = findGenreById(selectedGenreToDeleteId);

  if (!isAuthenticated || (!hasModRole && !hasAdminRole)) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1228] to-[#12152f] text-white p-8 overflow-x-hidden">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-7xl mx-auto px-2">
        <div className="mb-12 text-center">
          <h1 className="text-[clamp(1.6rem,4vw,3rem)] font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 whitespace-normal">
            Panel de Administración
          </h1>
          <p className="text-[clamp(0.8rem,2.3vw,1.6rem)] text-gray-400">
            Bienvenido al centro de control de Cinedex
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Usuarios */}
          <div className="bg-[#0f1228]/50 backdrop-blur border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/10 transition-all neon-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-semibold">Usuarios</h3>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                <span className="text-cyan-400 text-xl">👥</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{stats.usersCount}</p>
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
          </div>

          {/* Géneros */}
          <div className="bg-[#0f1228]/50 backdrop-blur border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/10 transition-all neon-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-semibold">Géneros</h3>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                <span className="text-cyan-400 text-xl">🎭</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{stats.genresCount}</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-10 mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 duration-300"
          >
            + Agregar Película
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
        <div className="mt-10 mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full">
          <button
            onClick={openGenreCreateModal}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-emerald-500/40 transform hover:scale-105 duration-300"
          >
            + Agregar Género
          </button>
          <button
            onClick={openGenreDeleteModal}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-rose-500/40 transform hover:scale-105 duration-300"
          >
            Eliminar Género
          </button>
          <button
            onClick={openGenreEditModal}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-purple-500/40 transform hover:scale-105 duration-300"
          >
            Editar Género
          </button>
        </div>
        {hasAdminRole && (
          <div className="mt-10 mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6 w-full">
            <button
              onClick={() => openRoleModal()}
              disabled={users.length === 0}
              className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/50 transform hover:scale-105 duration-300"
            >
              Gestionar Roles de Usuarios
            </button>
          </div>
        )}
        {usersError && (
          <p className="text-red-400 text-sm mb-8">{usersError}</p>
        )}
      </div>

      <RoleAssignModal
        isOpen={roleModalOpen}
        onClose={closeRoleModal}
        roleFormError={roleFormError}
        roleFormSubmitting={roleFormSubmitting}
        handleRolesSubmit={handleRolesSubmit}
        users={users}
        usersRefreshing={usersRefreshing}
        selectedUser={selectedUser}
        userDropdownRef={userDropdownRef}
        userDropdownOpen={userDropdownOpen}
        setUserDropdownOpen={setUserDropdownOpen}
        handleUserSelect={handleUserSelect}
        roles={roles}
        rolesLoading={rolesLoading}
        rolesError={rolesError}
        loadRoles={loadRoles}
        roleDropdownRef={roleDropdownRef}
        roleDropdownOpen={roleDropdownOpen}
        setRoleDropdownOpen={setRoleDropdownOpen}
        selectedRoleIds={selectedRoleIds}
        toggleRoleSelection={toggleRoleSelection}
      />

      <MovieDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        movies={movies}
        moviesLoading={moviesLoading}
        moviesError={moviesError}
        loadMovies={loadMovies}
        selectedMovie={selectedMovie}
        selectedMovieId={selectedMovieId}
        setSelectedMovieId={setSelectedMovieId}
        movieDropdownRef={movieDropdownRef}
        movieDropdownOpen={movieDropdownOpen}
        setMovieDropdownOpen={setMovieDropdownOpen}
        deleteMovieLoadingId={deleteMovieLoadingId}
        handleDeleteMovieSubmit={handleDeleteMovieSubmit}
      />
      <MovieCreateModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        errors={errors}
        submitting={submitting}
        formError={formError}
        successMessage={successMessage}
        genres={genres}
        genresLoading={genresLoading}
        genresError={genresError}
        selectedGenres={selectedGenres}
        toggleGenre={toggleGenre}
        dropdownRef={dropdownRef}
        genreDropdownOpen={genreDropdownOpen}
        setGenreDropdownOpen={setGenreDropdownOpen}
        findGenreById={findGenreById}
        getGenreNumericId={getGenreNumericId}
      />
      <MovieEditModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        editFormError={editFormError}
        editSuccessMessage={editSuccessMessage}
        editSubmitting={editSubmitting}
        movies={movies}
        moviesLoading={moviesLoading}
        editSelectedMovie={editSelectedMovie}
        editSelectedMovieId={editSelectedMovieId}
        handleSelectMovieForEdit={handleSelectMovieForEdit}
        editMovieDropdownRef={editMovieDropdownRef}
        editMovieDropdownOpen={editMovieDropdownOpen}
        setEditMovieDropdownOpen={setEditMovieDropdownOpen}
        registerEdit={registerEdit}
        handleEditSubmit={handleEditSubmit}
        onEditSubmit={onEditSubmit}
        editErrors={editErrors}
        genres={genres}
        genresLoading={genresLoading}
        genresError={genresError}
        editSelectedGenres={editSelectedGenres}
        toggleEditGenre={toggleEditGenre}
        editGenreDropdownRef={editGenreDropdownRef}
        editGenreDropdownOpen={editGenreDropdownOpen}
        setEditGenreDropdownOpen={setEditGenreDropdownOpen}
      />

      <GenreCreateModal
        isOpen={genreCreateModalOpen}
        onClose={closeGenreCreateModal}
        registerGenreCreate={registerGenreCreate}
        handleGenreCreateSubmit={handleGenreCreateSubmit}
        onCreateGenreSubmit={onCreateGenreSubmit}
        genreCreateErrors={genreCreateErrors}
        genreCreateError={genreCreateError}
        genreCreateSuccess={genreCreateSuccess}
        genreCreateSubmitting={genreCreateSubmitting}
      />

      <GenreEditModal
        isOpen={genreEditModalOpen}
        onClose={closeGenreEditModal}
        genres={genres}
        genresLoading={genresLoading}
        genresError={genresError}
        loadGenres={loadGenres}
        genreEditPickerRef={genreEditPickerRef}
        genreEditPickerOpen={genreEditPickerOpen}
        setGenreEditPickerOpen={setGenreEditPickerOpen}
        genreSelectedForEdit={genreSelectedForEdit}
        genreEditSelectedId={genreEditSelectedId}
        handleSelectGenreForEdit={handleSelectGenreForEdit}
        registerGenreEdit={registerGenreEdit}
        handleGenreEditSubmit={handleGenreEditSubmit}
        onEditGenreSubmit={onEditGenreSubmit}
        genreEditErrors={genreEditErrors}
        genreEditFormError={genreEditFormError}
        genreEditSuccessMessage={genreEditSuccessMessage}
        genreEditSubmitting={genreEditSubmitting}
        getGenreNumericId={getGenreNumericId}
      />

      <GenreDeleteModal
        isOpen={genreDeleteModalOpen}
        onClose={closeGenreDeleteModal}
        genres={genres}
        genresLoading={genresLoading}
        genresError={genresError}
        loadGenres={loadGenres}
        genreDeletePickerRef={genreDeletePickerRef}
        genreDeletePickerOpen={genreDeletePickerOpen}
        setGenreDeletePickerOpen={setGenreDeletePickerOpen}
        genreSelectedForDelete={genreSelectedForDelete}
        selectedGenreToDeleteId={selectedGenreToDeleteId}
        handleSelectGenreForDelete={handleSelectGenreForDelete}
        deleteGenreLoadingId={deleteGenreLoadingId}
        handleDeleteGenreSubmit={handleDeleteGenreSubmit}
        genreDeleteError={genreDeleteError}
        getGenreNumericId={getGenreNumericId}
      />
    </div>
  );
}
