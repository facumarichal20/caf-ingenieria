export interface Cuota { jugador: string; mes: number; monto: number; pagado: number; }
export interface Movimiento { concepto: string; categoria: string; tipo: "ingreso" | "egreso"; monto: number; }
export function deuda(cuotas: Cuota[]) { return cuotas.reduce((n,c)=>n+Math.max(0,c.monto-c.pagado),0); }
export function balance(movimientos: Movimiento[]) { return movimientos.reduce((n,m)=>n+(m.tipo==="ingreso" ? m.monto : -m.monto),0); }
export function puedeConvocarse(vence: string | null, sancionado: boolean, fecha: string) { return !sancionado && !!vence && vence >= fecha; }
export const CUOTAS: Cuota[] = [
 {jugador:"Jugador de ejemplo A",mes:1,monto:500,pagado:500},
 {jugador:"Jugador de ejemplo A",mes:2,monto:500,pagado:0},
 {jugador:"Jugador de ejemplo B",mes:1,monto:500,pagado:200},
 {jugador:"Jugador de ejemplo B",mes:2,monto:500,pagado:0},
];
export const MOVIMIENTOS: Movimiento[] = [
 {concepto:"Cuotas de ejemplo",categoria:"Cuotas",tipo:"ingreso",monto:2000},
 {concepto:"Cancha de ejemplo",categoria:"Cancha",tipo:"egreso",monto:800},
 {concepto:"Juez de ejemplo",categoria:"Jueces",tipo:"egreso",monto:500},
];
