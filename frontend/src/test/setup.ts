import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock matchMedia for prefers-reduced-motion
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// localStorage / sessionStorage reales en memoria (para probar persistencia)
function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
  };
}
Object.defineProperty(window, "localStorage", { value: memoryStorage(), writable: true });
Object.defineProperty(window, "sessionStorage", { value: memoryStorage(), writable: true });

// fetch mock global (cada test define sus respuestas)
global.fetch = vi.fn();

// scrollTo no existe en jsdom
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

// Silenciar warnings de act() en efectos asíncronos
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const first = String(args[0]);
    if (
      first.includes("not wrapped in act") ||
      first.includes("ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
