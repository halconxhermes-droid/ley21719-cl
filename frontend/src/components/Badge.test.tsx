import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Badge from "./Badge";

describe("Badge component", () => {
  it("renderiza el texto entregado como children", () => {
    render(<Badge>Información</Badge>);
    expect(screen.getByText("Información")).toBeInTheDocument();
  });

  it("aplica la variante por defecto (info) con clases de tokens de tema", () => {
    render(<Badge data-testid="badge-info">Info por defecto</Badge>);
    const badge = screen.getByTestId("badge-info");
    expect(badge).toHaveClass("bg-primary-50", "text-primary-800", "border-primary-100");
  });

  it("aplica la variante exito con sus tokens de tema", () => {
    render(<Badge variant="exito" data-testid="badge-exito">Aprobado</Badge>);
    const badge = screen.getByTestId("badge-exito");
    expect(badge).toHaveClass("bg-exito-50", "text-exito-800", "border-exito-200");
  });

  it("aplica la variante riesgo con sus tokens de tema", () => {
    render(<Badge variant="riesgo" data-testid="badge-riesgo">Alerta de Riesgo</Badge>);
    const badge = screen.getByTestId("badge-riesgo");
    expect(badge).toHaveClass("bg-riesgo-50", "text-riesgo-800", "border-riesgo-200");
  });

  it("permite pasar clases adicionales via className", () => {
    render(<Badge className="shadow-sm" data-testid="badge-custom">Custom</Badge>);
    const badge = screen.getByTestId("badge-custom");
    expect(badge).toHaveClass("shadow-sm", "bg-primary-50");
  });
});
