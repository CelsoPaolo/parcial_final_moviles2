import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { RECETAS } from '../data/recetas';
import { CATEGORIAS, DatosReceta, Receta } from '../types/Receta';
import { CLAVES, guardarJSON, leerJSON } from '../utils/almacenamiento';

interface ValorRecetas {
  /** Catálogo mockeado + recetas propias, en una sola lista. */
  recetas: Receta[];
  /** true mientras se leen las recetas propias guardadas. */
  cargando: boolean;
  obtenerReceta: (id: string) => Receta | undefined;
  agregarReceta: (datos: DatosReceta) => void;
  actualizarReceta: (id: string, datos: DatosReceta) => void;
  eliminarReceta: (id: string) => void;
}

const RecetasContext = createContext<ValorRecetas | undefined>(undefined);

/**
 * Valida una receta leída del almacenamiento. Hace falta porque `JSON.parse`
 * devuelve `unknown`: sin esto, un dato viejo o corrupto rompería la app.
 */
function esReceta(valor: unknown): valor is Receta {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const posible = valor as Record<string, unknown>;
  return (
    typeof posible.id === 'string' &&
    typeof posible.nombre === 'string' &&
    typeof posible.imagen === 'string' &&
    typeof posible.tiempoPrep === 'number' &&
    typeof posible.porciones === 'number' &&
    CATEGORIAS.some((categoria) => categoria === posible.categoria) &&
    Array.isArray(posible.ingredientes) &&
    Array.isArray(posible.pasos)
  );
}

function esListaDeRecetas(valor: unknown): valor is Receta[] {
  return Array.isArray(valor) && valor.every(esReceta);
}

/** ID único para una receta nueva: marca de tiempo + sufijo aleatorio. */
function generarId(): string {
  return `propia-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

interface Props {
  children: React.ReactNode;
}

export function ProveedorRecetas({ children }: Props) {
  const [recetasPropias, setRecetasPropias] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargar = async (): Promise<void> => {
      const guardadas = await leerJSON(CLAVES.recetasPropias, esListaDeRecetas);
      if (guardadas !== null) {
        setRecetasPropias(guardadas);
      }
      setCargando(false);
    };
    void cargar();
  }, []);

  // Misma guarda que en favoritos: no persistir hasta terminar la carga inicial.
  useEffect(() => {
    if (cargando) {
      return;
    }
    void guardarJSON(CLAVES.recetasPropias, recetasPropias);
  }, [recetasPropias, cargando]);

  // Las propias van primero para que una receta recién creada se vea enseguida.
  const recetas = useMemo<Receta[]>(() => [...recetasPropias, ...RECETAS], [recetasPropias]);

  const obtenerReceta = useCallback(
    (id: string): Receta | undefined => recetas.find((receta) => receta.id === id),
    [recetas],
  );

  const agregarReceta = useCallback((datos: DatosReceta): void => {
    const nueva: Receta = {
      ...datos,
      id: generarId(),
      esPropia: true,
      creadaEn: new Date().toISOString(),
    };
    setRecetasPropias((actuales) => [nueva, ...actuales]);
  }, []);

  const actualizarReceta = useCallback((id: string, datos: DatosReceta): void => {
    setRecetasPropias((actuales) =>
      actuales.map((receta) => (receta.id === id ? { ...receta, ...datos } : receta)),
    );
  }, []);

  const eliminarReceta = useCallback((id: string): void => {
    setRecetasPropias((actuales) => actuales.filter((receta) => receta.id !== id));
  }, []);

  const valor = useMemo<ValorRecetas>(
    () => ({ recetas, cargando, obtenerReceta, agregarReceta, actualizarReceta, eliminarReceta }),
    [recetas, cargando, obtenerReceta, agregarReceta, actualizarReceta, eliminarReceta],
  );

  return <RecetasContext.Provider value={valor}>{children}</RecetasContext.Provider>;
}

export function useRecetas(): ValorRecetas {
  const contexto = useContext(RecetasContext);
  if (contexto === undefined) {
    throw new Error('useRecetas debe usarse dentro de <ProveedorRecetas>');
  }
  return contexto;
}
