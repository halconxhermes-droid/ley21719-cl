import { ROLE_LABELS, useRol } from "../context/RolContext";
import type { Rol } from "../context/RolContext";

/** Indicador del rol activo en el header (mockup: role-indicator). */
export default function RoleIndicator() {
  const { rol } = useRol();
  if (!rol) return null;
  return (
    <div
      aria-live="polite"
      className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-800"
    >
      Rol: {ROLE_LABELS[rol as Rol]}
    </div>
  );
}
