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
      <nav aria-label="Ruta de navegación" className="mb-5 text-sm text-slate-500">
        <button type="button" onClick={() => navigate("home")} className="hover:text-primary-700 hover:underline">Curso</button>
        <span className="mx-2" aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-slate-700">Mi checklist</span>
      </nav>
      <header className="mb-6 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 p-6 text-white shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-100">Tu ruta de preparación</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 id="checklist-title" className="text-2xl font-bold sm:text-3xl">Checklist de aprendizaje</h1>
            <p className="mt-2 text-sm text-primary-50">Marca cada actividad cuando la hayas completado. Tu avance se guarda automáticamente.</p>
          </div>
          <div className="rounded-xl bg-white/10 px-5 py-3 text-center">
            <p className="text-3xl font-bold">{pct}%</p>
            <p className="text-xs text-primary-100">avance total</p>
          </div>
        </div>
      </header>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs uppercase tracking-wide text-slate-500">Completadas</p><p className="mt-1 text-2xl font-bold text-emerald-700">{completedItems}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs uppercase tracking-wide text-slate-500">Pendientes</p><p className="mt-1 text-2xl font-bold text-slate-900">{totalItems - completedItems}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs uppercase tracking-wide text-slate-500">Perfil activo</p><p className="mt-1 text-lg font-bold text-slate-900">{CK_LABELS[ckRole]}</p></div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar checklist por rol">
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
          .map((section) => {
            const sectionCompleted = section.items.filter((item) => done[item.id]).length;
            return (
            <div key={section.id} className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{sectionCompleted}/{section.items.length} completados</span>
              </div>
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
          )})}
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