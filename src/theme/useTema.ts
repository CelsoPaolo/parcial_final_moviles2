import { useMemo } from 'react';

import { useTemaContexto } from '../context/TemaContext';
import { Colores } from './colores';

/**
 * Punto de entrada del tema para los componentes. El estado vive en
 * `TemaContext` (preferencia manual + tema del sistema); aquí solo se expone.
 */
export const useTema = useTemaContexto;

/**
 * Construye la hoja de estilos con la paleta activa y la memoriza, para no
 * volver a crearla en cada render. `crear` debe ser una función definida fuera
 * del componente, así su identidad no cambia.
 */
export function useEstilos<T>(crear: (colores: Colores) => T): T {
  const { colores } = useTema();
  return useMemo(() => crear(colores), [crear, colores]);
}
