import { describe, expect, it } from "vitest";
import temporada2026 from "../../data/public/temporada-2026.json";
import { estadoCarne, habilitadoPara, vencimientosPorMes } from "./carne";
import { calcularPresupuesto, SUPUESTOS_2027 } from "./presupuesto";
import { caraACara, partidosDe, resumen } from "./stats";
import type { Temporada } from "./tipos";

const t = temporada2026 as Temporada;

describe("stats 2026 (contra la planilla oficial)", () => {
  const regular = partidosDe({ partidos: t.partidos.filter((p) => p.fase === "regular") }, "INGENIERIA");
  const r = resumen(regular);
  const oficial = t.tabla.find((f) => f.equipo === "INGENIERIA")!;

  it("la fase regular calculada coincide con la tabla de la Liga (salvo un fallo de mesa conocido)", () => {
    expect(r.pj).toBe(oficial.pj);
    expect(r.gc).toBe(oficial.gc);
    // La planilla 2026 suma 1 victoria y 2 goles más en la tabla que en los resultados
    // (un partido perdido figura como ganado, probablemente por fallo de mesa). Pendiente de confirmar.
    // Si la Liga lo corrige, este test avisa para sacar la nota de la web.
    expect([oficial.g - r.g, oficial.p - r.p, oficial.gf - r.gf]).toEqual([1, -1, 2]);
  });

  it("incluye los cuartos contra Medicina (1-0 y 0-2)", () => {
    const todos = partidosDe(t, "INGENIERIA");
    const cuartos = todos.filter((x) => x.partido.fase === "cuartos");
    expect(cuartos.map((x) => [x.rival, x.gf, x.gc])).toEqual([
      ["MEDICINA", 1, 0],
      ["MEDICINA", 0, 2],
    ]);
  });

  it("cara a cara suma todos los partidos", () => {
    const h = caraACara(regular);
    expect(h.reduce((s, x) => s + x.pj, 0)).toBe(regular.length);
  });
});

describe("carné de salud", () => {
  const hoy = new Date(2026, 10, 7); // 7 nov 2026
  it("semáforo", () => {
    expect(estadoCarne("2026-11-06", hoy)).toBe("vencido");
    expect(estadoCarne("2026-11-07", hoy)).toBe("por-vencer");
    expect(estadoCarne("2026-12-07", hoy)).toBe("por-vencer");
    expect(estadoCarne("2026-12-08", hoy)).toBe("ok");
    expect(estadoCarne(null, hoy)).toBe("sin-dato");
  });
  it("habilitación el día del partido", () => {
    expect(habilitadoPara("2027-03-20", new Date(2027, 2, 20))).toBe(true);
    expect(habilitadoPara("2027-03-19", new Date(2027, 2, 20))).toBe(false);
  });
  it("agrupa por mes", () => {
    expect([...vencimientosPorMes(["2027-03-01", "2027-03-30", "2027-01-02", null])]).toEqual([
      ["2027-01", 1],
      ["2027-03", 2],
    ]);
  });
});

describe("presupuesto", () => {
  it("calcula cuota mensual redondeada", () => {
    const r = calcularPresupuesto({
      ...SUPUESTOS_2027,
      partidos: 16, costoCanchaPartido: 1500, costoJuezPartido: 1000,
      entrenamientos: 0, inscripcion: 5000, colchonPct: 0, ingresosExtra: 5000,
      jugadoresQuePagan: 20, mesesDeCuota: 10,
    });
    expect(r.costoPartidos).toBe(40000);
    expect(r.total).toBe(45000);
    expect(r.aCubrirConCuotas).toBe(40000);
    expect(r.cuotaMensual).toBe(200);
  });
  it("no divide por cero", () => {
    expect(calcularPresupuesto({ ...SUPUESTOS_2027, jugadoresQuePagan: 0 }).cuotaMensual).toBe(0);
  });
});
