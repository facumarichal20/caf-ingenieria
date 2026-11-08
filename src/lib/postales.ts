export interface FotoPostal {
  archivo: string;
  miniatura: string;
  ancho: number;
  alto: number;
  alt: string;
}

export interface Postal {
  id: string;
  anio: number;
  fecha: string | null;
  rival: string | null;
  golesCAF: number | null;
  golesRival: number | null;
  competencia: string | null;
  fotos: FotoPostal[];
}