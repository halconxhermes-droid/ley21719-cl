import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Header from "../components/Header";
import { NavigationProvider, useNavigation } from "../context/NavigationContext";
import { RolProvider, useRol } from "../context/RolContext";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RolProvider>
      <NavigationProvider>{children}</NavigationProvider>
    </RolProvider>
  );
}

describe("Context providers", () => {
  it("RolProvider: inicial sin rol y permite setRol", () => {
    function Test() {
      const { rol, setRol } = useRol();
      return (
        <div>
          <span data-testid="rol">{rol ?? "null"}</span>
          <button onClick={() => setRol("empresa")}>Set</button>
        </div>
      );
    }
    render(<TestWrapper><Test /></TestWrapper>);
    expect(screen.getByTestId("rol")).toHaveTextContent("null");
    fireEvent.click(screen.getByText("Set"));
    expect(screen.getByTestId("rol")).toHaveTextContent("empresa");
  });

  it("NavigationProvider: navega entre vistas y moduleId", () => {
    function Test() {
      const { view, navigate, moduleId } = useNavigation();
      return (
        <div>
          <span data-testid="view">{view}</span>
          <span data-testid="module">{moduleId}</span>
          <button onClick={() => navigate("lector", { moduleId: "ciudadano" })}>
            Go
          </button>
        </div>
      );
    }
    render(<TestWrapper><Test /></TestWrapper>);
    expect(screen.getByTestId("view")).toHaveTextContent("portal");
    expect(screen.getByTestId("module")).toHaveTextContent("empresa");
    fireEvent.click(screen.getByText("Go"));
    expect(screen.getByTestId("view")).toHaveTextContent("lector");
    expect(screen.getByTestId("module")).toHaveTextContent("ciudadano");
  });
});

describe("Header component", () => {
  it("renderiza banner con logo y countdown accesible", () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByLabelText(/Cuenta regresiva a vigencia plena/i)).toBeInTheDocument();
  });

  it("navega al portal al hacer clic en el logo", () => {
    function Test() {
      const { view } = useNavigation();
      return (
        <div>
          <Header />
          <span data-testid="view">{view}</span>
        </div>
      );
    }
    render(<TestWrapper><Test /></TestWrapper>);
    fireEvent.click(screen.getByLabelText(/Ley 21\.719 - Portal/i));
    expect(screen.getByTestId("view")).toHaveTextContent("portal");
  });

  it("muestra navegación Portal/Curso y marca la vista activa", () => {
    function Test() {
      return (
        <div>
          <Header />
        </div>
      );
    }
    render(<TestWrapper><Test /></TestWrapper>);
    expect(screen.getByRole("navigation", { name: /Navegación principal/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Portal" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Curso" })).not.toHaveAttribute("aria-current");
  });

  it("muestra RoleIndicator cuando hay rol seleccionado y lo oculta sin rol", () => {
    // Limpia localStorage para aislar el test
    window.localStorage.removeItem("ley21719_role");

    function Test() {
      const { setRol } = useRol();
      return (
        <div>
          <Header />
          <button onClick={() => setRol("empresa")}>Set rol</button>
        </div>
      );
    }
    const { unmount } = render(<TestWrapper><Test /></TestWrapper>);
    expect(screen.queryByText(/Rol:/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Set rol"));
    expect(screen.getByText(/Rol: Empresa/)).toBeInTheDocument();
    unmount();

    // Sin rol → indicador oculto
    window.localStorage.removeItem("ley21719_role");
    function SinRol() {
      return (
        <div>
          <Header />
        </div>
      );
    }
    render(<TestWrapper><SinRol /></TestWrapper>);
    expect(screen.queryByText(/Rol:/)).not.toBeInTheDocument();
  });
});
