import { useEffect, useState } from "react";
import { useRol, ROLE_API, type Rol } from "../context/RolContext";
import { useNavigation } from "../context/NavigationContext";
import { getChecklist, saveChecklist, type ChecklistResponse } from "../lib/api";
import { useChecklistProgress } from "../hooks/useChecklistProgress";
import { Loading, ErrorPanel } from "../components/Feedback";
import ProgressBar from "../components/ProgressBar";

const CK_ROLES: Rol[] = ["empresa", "ciudadano", "desarrollador", "institucion"];
const CK_LABELS = {
  empresa: "Empresa",
  ciudadano: "Ciudadano",
  desarrollador: "Desarrollador",
  institucion: "Institución",
};

export default function ChecklistView() {
  const { rol: userRole } = useRol();
  const { navigate } = useNavigation();
  const [ckRole, setCkRole] = useState<Rol>("empresa");
  const [data, setData] = useState<ChecklistResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { done, toggle, reset } = useChecklistProgress(ckRole);

  // Al cambiar de vista, cargar checklist del rol actual (o rol seleccionado por usuario)
  useEffect(() => {
    let alive = true;
    const roleApi = ROLE_API[ckRole];
    setError(null);
    setData(null);
    getChecklist(roleApi)
      .then((res) => {
        if (alive) setData(res);
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });
    return () => { alive = false; };
  }, [ckRole]);

  const handleItemChange = async (itemId: string, completed: boolean) => {
    toggle(itemId, completed);
    try {
      await saveChecklist(ROLE_API[ckRole], [{ id: itemId, completed }]);
    } catch (e) {
      console.warn("No se pudo persistir checklist:", e);
    }
  };

  const handleReset = () => {
    reset();
    saveChecklist(ROLE_API[ckRole], []).catch(() => {});
  };

  if (error) return <ErrorPanel message={error} onRetry={() => {}} />;
  if (!data) return <Loading label="Cargando checklist…" />;

  const checklist = data.checklist;
  const totalItems = checklist.sections.reduce((sum, s) => sum + s.items.length, 0);
  const completedItems = totalItems ? checklist.sections.reduce(
    (sum, s) => sum + s.items.filter((it) => done[it.id]).length, 0) : 0;
  const pct = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <section aria-labelledby="checklist-title">
      <header className="mb-6">
        <div className="mb-4">
          <h2 id="checklist-title" className="text-2xl font-semibold">
            Checklist «¿Estoy listo?»
          </h2>
          <p className="text-slate-600">
            Tu progreso se guarda automáticamente por rol en este navegador.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar checklist por rol">
          {CK_ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setCkRole(r)}
              aria-pressed={ckRole === r}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                ckRole === r
                  ? "border-primary-700 bg-primary-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-primary-500 hover:text-primary-700"
              }`}
            >
              {CK_LABELS[r]}
            </button>
          ))}
        </div>
      </header>

      {/* Progreso global */}
      <ProgressBar
        value={pct}
        label={`${completedItems} de ${totalItems} ítems completados`}
        ariaLabel="Progreso global del checklist"
      />

      {/* Secciones */}
      <div id="checklist-sections" className="mt-6">
        {checklist.sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} className="mb-6">
              <h3 className="mb-3 text-lg font-semibold">{section.title}</h3>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => {
                  const completed = !!done[item.id];
                  return (
                    <label
                      key={item.id}
                      className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                        completed
                          ? "border-green-200 bg-green-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => handleItemChange(item.id, e.target.checked)}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-primary-700"
                        aria-label={item.text}
                      />
                      <span className="text-sm leading-relaxed">{item.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {totalItems === 0 && (
        <p className="text-center text-slate-500 py-8">
          No hay ítems para este rol.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          Reiniciar progreso
        </button>
        <button
          type="button"
          onClick={() => navigate("testfinal")}
          className="rounded-md bg-primary-700 px-4 py-2 font-medium text-white hover:bg-primary-800"
        >
          Ir al test final →
        </button>
      </div>
    </section>
  );
}