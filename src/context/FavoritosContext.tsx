import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CLAVES, guardarJSON, leerJSON } from '../utils/almacenamiento';

interface ValorFavoritos {
  /** IDs de las recetas marcadas como favoritas. */
  favoritos: string[];
  /** true mientras se leen los favoritos guardados al abrir la app. */
  cargando: boolean;
  esFavorito: (id: string) => boolean;
  toggleFavorito: (id: string) => void;
  /** Quita un favorito sin alternar; se usa al eliminar una receta propia. */
  quitarFavorito: (id: string) => void;
}

const FavoritosContext = createContext<ValorFavoritos | undefined>(undefined);

/** Valida que lo guardado sea realmente una lista de IDs. */
function esListaDeIds(valor: unknown): valor is string[] {
  return Array.isArray(valor) && valor.every((id) => typeof id === 'string');
}

interface Props {
  children: React.ReactNode;
}

export function ProveedorFavoritos({ children }: Props) {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // Carga inicial desde AsyncStorage, una sola vez al montar la app.
  useEffect(() => {
    const cargar = async (): Promise<void> => {
      const guardados = await leerJSON(CLAVES.favoritos, esListaDeIds);
      if (guardados !== null) {
        setFavoritos(guardados);
      }
      setCargando(false);
    };
    void cargar();
  }, []);

  // Cada cambio se persiste automáticamente. Se espera a que termine la carga
  // inicial para no pisar el almacenamiento con la lista vacía del primer render.
  useEffect(() => {
    if (cargando) {
      return;
    }
    void guardarJSON(CLAVES.favoritos, favoritos);
  }, [favoritos, cargando]);

  const toggleFavorito = useCallback((id: string): void => {
    setFavoritos((actuales) =>
      actuales.includes(id) ? actuales.filter((favorito) => favorito !== id) : [...actuales, id],
    );
  }, []);

  const quitarFavorito = useCallback((id: string): void => {
    setFavoritos((actuales) => actuales.filter((favorito) => favorito !== id));
  }, []);

  const esFavorito = useCallback((id: string): boolean => favoritos.includes(id), [favoritos]);

  const valor = useMemo<ValorFavoritos>(
    () => ({ favoritos, cargando, esFavorito, toggleFavorito, quitarFavorito }),
    [favoritos, cargando, esFavorito, toggleFavorito, quitarFavorito],
  );

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

/** Hook de acceso al contexto; falla claro si se usa fuera del proveedor. */
export function useFavoritos(): ValorFavoritos {
  const contexto = useContext(FavoritosContext);
  if (contexto === undefined) {
    throw new Error('useFavoritos debe usarse dentro de <ProveedorFavoritos>');
  }
  return contexto;
}
