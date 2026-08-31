import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InsForgeAuth from "../components/InsForgeAuth";
import App from "../App";
import type { InsForgeUser } from "../lib/insforgeAuth";

const {
  mockSignInPassword,
  mockSignUp,
  mockSendVerificationLink,
} = vi.hoisted(() => ({
  mockSignInPassword: vi.fn(),
  mockSignUp: vi.fn(),
  mockSendVerificationLink: vi.fn(),
}));

vi.mock("../lib/insforgeAuth", async () => {
  const actual = await vi.importActual<typeof import("../lib/insforgeAuth")>("../lib/insforgeAuth");
  return {
    ...actual,
    signInPassword: mockSignInPassword,
    signUp: mockSignUp,
    sendVerificationLink: mockSendVerificationLink,
  };
});

const user: InsForgeUser = {
  id: "user-1",
  email: "estudiante@example.cl",
  emailVerified: true,
  name: "Estudiante de Prueba",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  providers: ["password"],
  profile: {},
};

describe("InsForgeAuth component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
    mockSignInPassword.mockResolvedValue({ user });
    mockSignUp.mockResolvedValue({ user });
    mockSendVerificationLink.mockResolvedValue(undefined);
  });

  it("renderiza el formulario de inicio de sesión", () => {
    render(<InsForgeAuth onSuccess={vi.fn()} />);
    expect(screen.getByText(/iniciar sesion/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo@ejemplo.cl/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contrasena/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /acceder/i })).toBeInTheDocument();
  });

  it("muestra error si la contraseña es demasiado corta", async () => {
    render(<InsForgeAuth onSuccess={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.cl/i), {
      target: { value: "estudiante@example.cl" },
    });
    fireEvent.change(screen.getByPlaceholderText(/contrasena/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /acceder/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/al menos 6 caracteres/i);
    expect(mockSignInPassword).not.toHaveBeenCalled();
  });

  it("desbloquea con credenciales correctas", async () => {
    const onSuccess = vi.fn();
    render(<InsForgeAuth onSuccess={onSuccess} />);

    fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.cl/i), {
      target: { value: user.email },
    });
    fireEvent.change(screen.getByPlaceholderText(/contrasena/i), {
      target: { value: "clave-segura" },
    });
    fireEvent.click(screen.getByRole("button", { name: /acceder/i }));

    await waitFor(() => {
      expect(mockSignInPassword).toHaveBeenCalledWith(user.email, "clave-segura");
      expect(onSuccess).toHaveBeenCalledWith(user);
    });
  });

  it("muestra error del servidor si las credenciales son incorrectas", async () => {
    mockSignInPassword.mockRejectedValueOnce(new Error("Correo o contraseña incorrectos."));
    render(<InsForgeAuth onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.cl/i), {
      target: { value: user.email },
    });
    fireEvent.change(screen.getByPlaceholderText(/contrasena/i), {
      target: { value: "clave-mala" },
    });
    fireEvent.click(screen.getByRole("button", { name: /acceder/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/correo o contrase[nñ]a incorrectos/i);
  });
});

describe("App con InsForge", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
    vi.clearAllMocks();
  });

  it("muestra InsForgeAuth si no existe una sesión", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/iniciar sesion/i)).toBeInTheDocument();
    });
  });

  it("muestra Portal si existe una sesión guardada", async () => {
    window.localStorage.setItem("insforge_access_token", "valid-token");
    window.localStorage.setItem("insforge_user", JSON.stringify(user));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});
