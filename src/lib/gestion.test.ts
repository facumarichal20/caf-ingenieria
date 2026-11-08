import {describe,it,expect} from "vitest";
import {deuda,balance,puedeConvocarse} from "./gestion";
describe("gestión del club",()=>{
 it("calcula deuda sin compensar cuotas con pagos de más",()=>expect(deuda([{jugador:"A",mes:1,monto:500,pagado:700},{jugador:"A",mes:2,monto:500,pagado:100}])).toBe(400));
 it("calcula saldo y acepta caja vacía",()=>{expect(balance([])).toBe(0);expect(balance([{concepto:"Cuotas",categoria:"Cuotas",tipo:"ingreso",monto:1000},{concepto:"Cancha",categoria:"Cancha",tipo:"egreso",monto:400}])).toBe(600)});
 it("bloquea sanción, carné vencido y carné faltante",()=>{expect(puedeConvocarse("2027-03-20",false,"2027-03-20")).toBe(true);expect(puedeConvocarse("2027-03-19",false,"2027-03-20")).toBe(false);expect(puedeConvocarse(null,false,"2027-03-20")).toBe(false);expect(puedeConvocarse("2028-01-01",true,"2027-03-20")).toBe(false)});
});
