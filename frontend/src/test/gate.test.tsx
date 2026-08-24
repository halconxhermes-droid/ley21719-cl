import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccessGate from "../components/AccessGate";
import App from "../App";

describe("AccessGate component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renderiza el formulario de acceso restringido", () => {
    render(<AccessGate />);
    expect(screen.getByText(/acceso restringido/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña de acceso/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /acceder/i })).toBeInTheDocument();
  });

  it("muestra error si se envía vacío", () => {
    render(<AccessGate />);
    fireEvent.click(screen.getByRole("button", { name: /acceder/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/ingresa la contraseña/i);
  });

  it("desbloquea con contraseña correcta", async () => {
    const onUnlock = vi.fn();
    (global.fetch as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "fake-jwt-token" }),
    });

    render(<AccessGate onUnlock={onUnlock} />);
    const input = screen.getByPlaceholderText(/contraseña de acceso/i);
    fireEvent.change(input, { target: { value: "ley21719-2026" } });
    fireEvent.click(screen.getByRole("button", { name: /acceder/i }));

    await waitFor(() => {
      expect(onUnlock).toHaveBeenCalled();
      expect(window.localStorage.getItem("ley21719_access_token")).toBe("fake-jwt-token");
    });
  });

  it("muestra error de servidor si la contraseña es incorrecta", async () => {
    (global.fetch as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: "Contraseña incorrecta." } }),
    });

    render(<AccessGate />);
    const input = screen.getByPlaceholderText(/contraseña de acceso/i);
    fireEvent.change(input, { target: { value: "clave-mala" } });
    fireEvent.click(screen.getByRole("button", { name: /acceder/i }));

    await waitFor(() => {
      expect(screen.getByText(/contraseña incorrecta/i)).toBeInTheDocument();
    });
  });
});

describe("App con Gate", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("muestra AccessGate si no hay token", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/acceso restringido/i)).toBeInTheDocument();
    });
  });

  it("muestra Portal si ya hay token guardado", async () => {
    window.localStorage.setItem("ley21719_access_token", "valid-token");
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});
