export default function RoleAssignModal({
  isOpen,
  onClose,
  roleFormError,
  roleFormSubmitting,
  handleRolesSubmit,
  users,
  usersRefreshing,
  selectedUser,
  userDropdownRef,
  userDropdownOpen,
  setUserDropdownOpen,
  handleUserSelect,
  roles,
  rolesLoading,
  rolesError,
  loadRoles,
  roleDropdownRef,
  roleDropdownOpen,
  setRoleDropdownOpen,
  selectedRoleIds,
  toggleRoleSelection,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-start justify-center 
                overflow-y-auto z-50 px-3 sm:px-6 py-6"
    >
      <div className="bg-[#0f1228] border border-cyan-500/40 rounded-2xl w-full  max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
          disabled={roleFormSubmitting}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-1 text-white">Asignar roles</h2>
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
            <label className="text-sm text-gray-300 mb-1 block">Usuario</label>
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
            <label className="text-sm text-gray-300 mb-1 block">Roles</label>
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
              onClick={onClose}
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
  );
}
