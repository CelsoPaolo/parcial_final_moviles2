export type DiaSemana =
  | 'Lunes'
  | 'Martes'
  | 'Miercoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sabado'
  | 'Domingo';

export type HorarioComida = 'Desayuno' | 'Almuerzo' | 'Cena';

export interface AsignacionComida {
  dia: DiaSemana;
  horario: HorarioComida;
  recetaId: string | null;
}

export const DIAS: DiaSemana[] = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
];

export const HORARIOS: HorarioComida[] = ['Desayuno', 'Almuerzo', 'Cena'];

/** Los días se guardan sin tilde para evitar problemas de codificación. */
export const NOMBRES_DIA: Record<DiaSemana, string> = {
  Lunes: 'Lunes',
  Martes: 'Martes',
  Miercoles: 'Miércoles',
  Jueves: 'Jueves',
  Viernes: 'Viernes',
  Sabado: 'Sábado',
  Domingo: 'Domingo',
};
