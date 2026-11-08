import { describe, expect, it } from "vitest";
import temporada2026 from "../../data/public/temporada-2026.json";
import { estadoCarne, habilitadoPara, vencimientosPorMes } from "./carne";
import { calcularPresupuesto, SUPUESTOS_2027 } from "./presupuesto";
import { caraACara, partidosDe, resumen, tablaDe } from "./stats";
import { parsearCsv } from "../../scripts/cargar-temporada";
import type { Temporada } from "./tipos";

const t = temporada2026 as Temporada;

describe("stats 2026 (contra la planilla oficial)", () => {
  const regular = partidosDe({ partidos: t.partidos.filter((p) => p.competencia === "fase-regular") }, "INGENIERIA");
  const r = resumen(regular);
  const oficial = t.tabla.find((f) => f.equipo === "INGENIERIA")!;

  it("la fase regular calculada coincide con la tabla de la Liga (salvo un fallo de mesa conocido)", () => {
    expect(r.pj).toBe(oficial.pj);
    expect(r.gc).toBe(oficial.gc);
    // La planilla 2026 suma 1 victoria y 2 goles más en la tabla que en los resultados
    // (un partido perdido figura como ganado, probablemente por fallo de mesa). Pendiente de confirmar.
    // Si la Liga lo corrige, este test avisa para sacar la nota de la web.
    expect([oficial.g - r.g, oficial.p - r.p, (oficial.gf ?? 0) - r.gf]).toEqual([1, -1, 2]);
  });

  it("incluye los cuartos contra Medicina (1-0 y 0-2)", () => {
    const todos = partidosDe(t, "INGENIERIA");
    const cuartos = todos.filter((x) => x.partido.competencia === "copa-oro");
    expect(cuartos.map((x) => [x.rival, x.gf, x.gc])).toEqual([
      ["MEDICINA", 1, 0],
      ["MEDICINA", 0, 2],
    ]);
  });

  it("Mundialito: eliminatoria y Serie A del Mundial Oro coinciden con las tablas de la planilla", () => {
    const mund = partidosDe(t, "INGENIERIA").filter((x) => x.partido.competencia.startsWith("mundial"));
    expect(mund.map((x) => [x.rival, x.gf, x.gc])).toEqual([
      ["QUIMICA", 4, 2],
      ["CONTADORES", 0, 3],
      ["DERECHO", 1, 1],
      ["IPA", 4, 0],
    ]);
    const serieA = tablaDe(t.partidos.filter((p) => p.competencia === "mundial-oro" && p.grupo === "Serie A"));
    expect(serieA.map((f) => [f.equipo, f.pts, f.dif])).toEqual([
      ["CONTADORES", 7, 4],
      ["DERECHO", 5, 1],
      ["INGENIERIA", 4, 1],
      ["IPA", 0, -6],
    ]);
    const serieB = tablaDe(t.partidos.filter((p) => p.competencia === "mundial-oro" && p.grupo === "Serie B"));
    expect(serieB.map((f) => [f.equipo, f.pts, f.dif])).toEqual([
      ["MEDICINA", 7, 4],
      ["ISEF", 7, 2],
      ["EMA", 3, 5],
      ["ODONTOLOGIA", 0, -11],
    ]);
  });

  it("resumen de las tres etapas", () => {
    expect(t.etapas.map((e) => e.etapa)).toEqual(["fase-regular", "mundial", "playoffs"]);
  });

  it("cara a cara suma todos los partidos", () => {
    const h = caraACara(regular);
    expect(h.reduce((s, x) => s + x.pj, 0)).toBe(regular.length);
  });
});

describe("carga manual de temporadas", () => {
  it("lee el CSV y normaliza el rival", () => {
    const ps = parsearCsv("competencia,instancia,nro,grupo,fecha,rival,gf,gc,penales\ncopa-oro,cuartos,2,,2025-10-11,Química,0,0,4-3", 2025);
    expect(ps[0]).toMatchObject({ competencia: "copa-oro", instancia: "cuartos", fecha_nro: 2, local: "INGENIERIA", visitante: "QUIMICA", goles_local: 0, penales: "4-3" });
  });
  it("rechaza competencias inventadas", () => {
    expect(() => parsearCsv("competencia,instancia,rival,gf,gc\ncopa-bronce,final,X,1,0", 2025)).toThrow(/competencia/);
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

describe("temporadas históricas cargadas a mano", () => {
  // Temporadas donde se cargaron todos los partidos de la fase regular: tienen que coincidir con la tabla publicada.
  for (const anio of [2020, 2021, 2025]) {
    it(`${anio}: los partidos suman lo mismo que la tabla oficial`, async () => {
      const t = (await import(`../../data/public/temporada-${anio}.json`)).default as Temporada;
      const ps = partidosDe({ partidos: t.partidos.filter((p) => p.competencia === "fase-regular") }, "INGENIERIA");
      const r = resumen(ps);
      const of = t.tabla.find((f) => f.equipo === "INGENIERIA")!;
      expect([r.pj, r.g, r.e, r.p, r.gf - r.gc]).toEqual([of.pj, of.g, of.e, of.p, of.dif]);
      if (of.gf !== null) expect([r.gf, r.gc]).toEqual([of.gf, of.gc]);
    });
  }
});

describe("historia (todas las temporadas)", async () => {
  const { TEMPORADAS } = await import("./temporadas");
  const { records, resumenPorAnio, ganoPenales, partidosHistoricos } = await import("./historia");
  const ts = Object.values(TEMPORADAS);

  it("suma los partidos de cada año", () => {
    const porAnio = resumenPorAnio(ts).reduce((s, a) => s + a.partidos.pj, 0);
    expect(records(ts).total.pj).toBe(porAnio);
    expect(partidosHistoricos(ts)[0].anio).toBe(2017);
  });

  it("penales: 5 de 6 definiciones ganadas (2020 ×2, 2024 ×3; 2023 perdida con Derecho)", () => {
    expect(records(ts).penales).toEqual({ jugadas: 6, ganadas: 5 });
  });

  it("ganoPenales respeta el lado de Ingeniería", () => {
    const base = { rival: "X", gf: 1, gc: 1, resultado: "E" as const };
    const p = { competencia: "copa-oro" as const, instancia: "cuartos" as const, fecha_nro: 2, fecha: null, cancha: null, local: "A", visitante: "B", goles_local: 1, goles_visitante: 1, penales: "4-3" };
    expect(ganoPenales({ ...base, partido: p, local: true })).toBe(true);
    expect(ganoPenales({ ...base, partido: p, local: false })).toBe(false);
    expect(ganoPenales({ ...base, partido: { ...p, penales: null }, local: true })).toBeNull();
  });

  it("la mejor posición registrada es el 3.º de 2018", () => {
    expect(records(ts).mejorPosicion?.anio).toBe(2018);
  });
});
