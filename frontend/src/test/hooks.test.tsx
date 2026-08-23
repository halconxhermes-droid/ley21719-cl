import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { useChecklistProgress } from "../hooks/useChecklistProgress";

describe("useChecklistProgress hook", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("empieza vacío y toggle marca + persiste en localStorage", () => {
    const { result } = renderHook(() => useChecklistProgress("empresa"));
    expect(Object.keys(result.current.done)).toHaveLength(0);

    act(() => {
      result.current.toggle("item1", true);
    });
    expect(result.current.done["item1"]).toBe(true);
    expect(window.localStorage.getItem("ley21719_ck_empresa")).toBe(
      JSON.stringify({ item1: true }),
    );
  });

  it("toggle false desmarca el ítem", () => {
    window.localStorage.setItem("ley21719_ck_empresa", JSON.stringify({ item1: true }));
    const { result } = renderHook(() => useChecklistProgress("empresa"));
    expect(result.current.done["item1"]).toBe(true);

    act(() => {
      result.current.toggle("item1", false);
    });
    expect(result.current.done["item1"]).toBeUndefined();
  });

  it("reset limpia estado y localStorage", () => {
    window.localStorage.setItem("ley21719_ck_empresa", JSON.stringify({ item1: true }));
    const { result } = renderHook(() => useChecklistProgress("empresa"));
    expect(Object.keys(result.current.done)).toHaveLength(1);

    act(() => {
      result.current.reset();
    });
    expect(Object.keys(result.current.done)).toHaveLength(0);
    expect(window.localStorage.getItem("ley21719_ck_empresa")).toBe("{}");
  });

  it("cambio de rol recarga el estado correspondiente", () => {
    window.localStorage.setItem("ley21719_ck_empresa", JSON.stringify({ e1: true }));
    window.localStorage.setItem(
      "ley21719_ck_ciudadano",
      JSON.stringify({ c1: true, c2: true }),
    );

    const { result, rerender } = renderHook(
      ({ role }) => useChecklistProgress(role),
      { initialProps: { role: "empresa" } },
    );
    expect(Object.keys(result.current.done)).toHaveLength(1);

    rerender({ role: "ciudadano" });
    expect(Object.keys(result.current.done)).toHaveLength(2);
  });
});

// JSX mínimo para cubrir el transform de TSX en este archivo
export function Dummy() {
  return <div data-testid="dummy">ok</div>;
}

describe("dummy", () => {
  it("renderiza", () => {
    render(<Dummy />);
    expect(screen.getByTestId("dummy")).toHaveTextContent("ok");
  });
});
