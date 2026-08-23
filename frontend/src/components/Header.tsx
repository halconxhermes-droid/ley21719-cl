import { useNavigation } from "../context/NavigationContext";
import type { ViewId } from "../context/NavigationContext";
import Countdown from "./Countdown";
import RoleIndicator from "./RoleIndicator";

/** Header sticky con logo, cuenta regresiva viva e indicador de rol. */
export default function Header() {
  const { navigate } = useNavigation();

  return (
    <header
      role="banner"
      className="sticky top-0 z-[100] border-b border-slate-200 bg-white"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={() => navigate("home")}
          aria-label="Ley 21.719 - Inicio"
          className="flex cursor-pointer items-center gap-3 border-none bg-transparent p-0 text-lg font-bold text-primary-900 sm:text-xl"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
            className="h-9 w-9 shrink-0"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Ley 21.719
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <RoleIndicator />
          <Countdown />
        </div>
      </div>
    </header>
  );
}

export type { ViewId };
