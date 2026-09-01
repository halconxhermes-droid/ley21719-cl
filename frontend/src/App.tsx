import { useState, useEffect } from "react";
import { RolProvider } from "./context/RolContext";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AccessGate from "./components/AccessGate";
import InsForgeAuth from "./components/InsForgeAuth";
import VerifyStatusBanner from "./components/VerifyStatusBanner";
import Home from "./views/Home";
import Portal from "./views/Portal";
import LectorModulo from "./views/LectorModulo";
import QuizView from "./views/Quiz";
import ChecklistView from "./views/Checklist";
import GlosarioView from "./views/Glosario";
import TestFinalView from "./views/TestFinal";
import ResultadosView from "./views/Resultados";
import VerificarCertificado from "./views/VerificarCertificado";
import PracticalSimulator from "./views/PracticalSimulator";
import Admin from "./views/Admin";
import { getStoredToken, getStoredUser, clearSession, type InsForgeUser } from "./lib/insforgeAuth";

function ViewRouter() {
  const { view, practiceId } = useNavigation();

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
    case "practica":
      return <PracticalSimulator />;
    default:
      return <Home />;
  }
}

/**
 * Modos de acceso:
 * - "open"      : acceso libre, sin gate
 * - "password"  : requiere clave (gate original)
 * - "insforge"  : usa InsForge Auth (signup + login + OTP)
 */
const ACCESS_MODE: "open" | "password" | "insforge" = "insforge";

export default function App() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [publicVerify, setPublicVerify] = useState(false);
  const [user, setUser] = useState<InsForgeUser | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<
    | { kind: "idle" }
    | { kind: "success" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  useEffect(() => {
    // Detectar redireccion de InsForge tras click en link de verificacion
    const params = new URLSearchParams(window.location.search);
    const status = params.get("insforge_status");
    const type = params.get("insforge_type");
    const errorMsg = params.get("insforge_error");

    if (status && type) {
      if (status === "success") {
        setVerifyStatus({ kind: "success" });
        // Limpiar URL
        window.history.replaceState({}, "", window.location.pathname);
        // Forzar login automatico si la cuenta quedo verificada
        if (ACCESS_MODE === "insforge") {
          setUnlocked(true);
        }
      } else if (status === "error") {
        setVerifyStatus({
          kind: "error",
          message: errorMsg || "El enlace de verificacion expiro o es invalido.",
        });
        window.history.replaceState({}, "", window.location.pathname);
      }
    }

    if (window.location.pathname.startsWith("/verificar")) {
      setPublicVerify(true);
      setUnlocked(true);
      return;
    }
    if (ACCESS_MODE === "open") {
      setUnlocked(true);
      return;
    }
    if (ACCESS_MODE === "insforge") {
      const token = getStoredToken();
      const u = getStoredUser();
      if (token && u) {
        setUser(u);
        setUnlocked(true);
        return;
      }
      setUnlocked(false);
      return;
    }
    const stored = localStorage.getItem("ley21719_access_token");
    setUnlocked(Boolean(stored));
  }, []);

  function handleInsForgeSuccess(u: InsForgeUser) {
    setUser(u);
    setUnlocked(true);
  }

  function handleSignOut() {
    clearSession();
    setUser(null);
    setUnlocked(false);
  }

  // Banner de estado de verificacion (success/error) que se muestra
  // cuando el usuario regresa del flujo de email link de InsForge.
  const statusBanner = verifyStatus.kind !== "idle" ? (
    <VerifyStatusBanner
      status={verifyStatus}
      onDismiss={() => setVerifyStatus({ kind: "idle" })}
    />
  ) : null;

  if (unlocked === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" role="status" aria-label="Cargando" />
      </div>
    );
  }

  // Modo InsForge: signup/login con verificación por código
  if (ACCESS_MODE === "insforge" && !unlocked) {
    return (
      <div className="min-h-screen bg-slate-50">
        {statusBanner}
        <InsForgeAuth
          onSuccess={handleInsForgeSuccess}
          onCancel={() => setUnlocked(true)}
        />
      </div>
    );
  }

  // Modo InsForge: pasar user al Header (que ya muestra "Salir" si está logueado)
  if (ACCESS_MODE === "insforge" && !publicVerify) {
    return (
      <RolProvider>
        <NavigationProvider>
          {statusBanner}
          <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
          <Header user={user} onSignOut={handleSignOut} />
          <main id="main-content" role="main" className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
            <ViewRouter />
          </main>
          <Footer />
        </NavigationProvider>
      </RolProvider>
    );
  }

  // Modo acceso libre
  if (ACCESS_MODE === "open" && !publicVerify) {
    return (
      <RolProvider>
        <NavigationProvider>
          <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
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
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
        <Header />
        <main id="main-content" role="main" className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
          <ViewRouter />
        </main>
        <Footer />
      </NavigationProvider>
    </RolProvider>
  );
}
