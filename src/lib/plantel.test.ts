import { describe, expect, it, vi } from "vitest";
import { parsearPlantel, leerPlantel } from "./plantel";

describe("CSV del plantel", () => {
  it("acepta BOM, CRLF, tildes, comas y comillas escapadas", () => {
    expect(parsearPlantel('\uFEFFnombre,apodo,posición,dorsal\r\n"Pérez, Juan","El ""10""",Volante,10\r\n')).toEqual([
      { nombre: "Pérez, Juan", apodo: 'El "10"', posicion: "Volante", dorsal: "10" },
    ]);
  });
  it("acepta encabezados reordenados y posicion sin tilde", () => {
    expect(parsearPlantel("dorsal,posicion,nombre,apodo\n01,Arquero,José,")).toEqual([
      { nombre: "José", apodo: "", posicion: "Arquero", dorsal: "01" },
    ]);
  });
  it("devuelve una lista vacía sin datos o sin nombres", () => {
    for (const csv of ["", " \r\n", "nombre,apodo,posición,dorsal\n", "nombre,apodo,posición,dorsal\n,,,"]) {
      expect(parsearPlantel(csv)).toEqual([]);
    }
  });
  it("detecta columnas faltantes y comillas sin cerrar", () => {
    expect(() => parsearPlantel("nombre,dorsal\nAna,1")).toThrow("faltan columnas");
    expect(() => parsearPlantel('nombre,apodo,posición,dorsal\n"Ana')).toThrow("sin cerrar");
  });
  it("devuelve una lista vacía si falta el archivo", async () => {
    const cwd = vi.spyOn(process, "cwd").mockReturnValue("/__caf_plantel_inexistente__");
    try {
      await expect(leerPlantel()).resolves.toEqual([]);
    } finally {
      cwd.mockRestore();
    }
  });
});
