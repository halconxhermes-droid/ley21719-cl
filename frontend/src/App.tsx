import { useState, useEffect } from "react";
import { RolProvider } from "./context/RolContext";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AccessGate from "./components/AccessGate";
import Home from "./views/Home";
import Portal from "./views/Portal";
import LectorModulo from "./views/LectorModulo";
import QuizView from "./views/Quiz";
import ChecklistView from "./views/Checklist";
import GlosarioView from "./views/Glosario";
import TestFinalView from "./views/TestFinal";
import ResultadosView from "./views/Resultados";
import VerificarCertificado from "./views/VerificarCertificado";
import Admin from "./views/Admin";

function ViewRouter() {
  const { view } = useNavigation();

  switch (view) {
    case "portal":
      return <Portal />;
    case "home":
      return <Home />;
    case "lector":
      return <LectorModulo />;
    case "quiz":
      return <QuizView />;
    case "checklist":
      return <ChecklistView />;
    case "glosario":
      return <GlosarioView />;
    case "testfinal":
      return <TestFinalView />;
    case "resultados":
      return <ResultadosView />;
    case "admin":
      return <Admin />;
    case "verificar":
      return <VerificarCertificado />;
    default:
      return <Home />;
  }
}

export default function App() {
  // MODO ACCESO: "password" = requiere clave | "open" = acceso libre
  const ACCESS_MODE: "password" | "open" = "open";
  const [unlocked, setUnlocked] = useState<boolean | null>(null); // null = verificando
  const [publicVerify, setPublicVerify] = useState(false); // ruta /verificar?cod=... es pública

  useEffect(() => {
    // Ruta pública: /verificar (QR de certificados) — accesible SIN gate
    if (window.location.pathname.startsWith("/verificar")) {
      setPublicVerify(true);
      setUnlocked(true);
      return;
    }
    if (ACCESS_MODE === "open") {
      // Acceso libre: marcar como desbloqueado de inmediato
      setUnlocked(true);
      return;
    }
    // ¿Hay token guardado? Si sí, asumir desbloqueado (la API validará igual)
    const stored = localStorage.getItem("ley21719_access_token");
    setUnlocked(Boolean(stored));
  }, []);

  /* Mientras se verifica, evitar flash de contenido */
  if (unlocked === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent"
          role="status"
          aria-label="Cargando"
        />
     </div>
    );
  }

  // MODO ACCESO LIBRE: saltar el gate, ir directo al contenido
  if (ACCESS_MODE === "open" && !publicVerify) {
    return (
      <RolProvider>
        <NavigationProvider>
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          <Header />
          <main id="main-content" role="main" className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
            <ViewRouter />
          </main>
          <Footer />
        </NavigationProvider>
      </RolProvider>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AccessGate onUnlock={() => setUnlocked(true)} />
     </div>
    );
  }

  /* Vista pública de verificación de certificados: sin Header/Footer del curso */
  if (publicVerify) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <main className="flex-1">
          <VerificarCertificado />
        </main>
        <footer className="py-4 text-center text-xs text-slate-500">
          Plataforma Educativa Ley 21.719 ·{" "}
          <span className="text-emerald-700 font-medium">Verificación oficial de certificados</span>
        </footer>
      </div>
    );
  }

  return (
    <RolProvider>
      <NavigationProvider>
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Header />
        <main id="main-content" role="main" className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
          <ViewRouter />
        </main>
        <Footer />
      </NavigationProvider>
    </RolProvider>
  );
}
