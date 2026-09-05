import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { Colores, temaClaro, temaOscuro } from '../theme/colores';
import { CLAVES, guardarJSON, leerJSON } from '../utils/almacenamiento';

/** 'auto' sigue al sistema; las otras dos lo fuerzan. */
export type PreferenciaTema = 'auto' | 'claro' | 'oscuro';

export const PREFERENCIAS: { valor: PreferenciaTema; etiqueta: string }[] = [
  { valor: 'auto', etiqueta: 'Automático (sistema)' },
  { valor: 'claro', etiqueta: 'Claro' },
  { valor: 'oscuro', etiqueta: 'Oscuro' },
];

interface ValorTema {
  colores: Colores;
  esOscuro: boolean;
  preferencia: PreferenciaTema;
  cambiarPreferencia: (nueva: PreferenciaTema) => void;
}

const TemaContext = createContext<ValorTema | undefined>(undefined);

function esPreferencia(valor: unknown): valor is PreferenciaTema {
  return valor === 'auto' || valor === 'claro' || valor === 'oscuro';
}

interface Props {
  children: React.ReactNode;
}

export function ProveedorTema({ children }: Props) {
  const esquemaSistema = useColorScheme();
  const [preferencia, setPreferencia] = useState<PreferenciaTema>('auto');
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargar = async (): Promise<void> => {
      const guardada = await leerJSON(CLAVES.preferenciaTema, esPreferencia);
      if (guardada !== null) {
        setPreferencia(guardada);
      }
      setCargando(false);
    };
    void cargar();
  }, []);

  // Misma guarda que en el resto de contextos: no persistir hasta terminar la carga.
  useEffect(() => {
    if (cargando) {
      return;
    }
    void guardarJSON(CLAVES.preferenciaTema, preferencia);
  }, [preferencia, cargando]);

  // La preferencia manual gana; 'auto' delega en el tema del sistema.
  const esOscuro =
    preferencia === 'auto' ? esquemaSistema === 'dark' : preferencia === 'oscuro';

  const cambiarPreferencia = useCallback((nueva: PreferenciaTema): void => {
    setPreferencia(nueva);
  }, []);

  const valor = useMemo<ValorTema>(
    () => ({
      colores: esOscuro ? temaOscuro : temaClaro,
      esOscuro,
      preferencia,
      cambiarPreferencia,
    }),
    [esOscuro, preferencia, cambiarPreferencia],
  );

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTemaContexto(): ValorTema {
  const contexto = useContext(TemaContext);
  if (contexto === undefined) {
    throw new Error('useTema debe usarse dentro de <ProveedorTema>');
  }
  return contexto;
}
