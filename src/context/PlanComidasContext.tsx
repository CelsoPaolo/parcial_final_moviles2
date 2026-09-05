import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  AsignacionComida,
  DIAS,
  DiaSemana,
  HORARIOS,
  HorarioComida,
} from '../types/PlanComidas';
import { CLAVES, guardarJSON, leerJSON } from '../utils/almacenamiento';

interface ValorPlan {
  /** Solo se guardan los casilleros ocupados; los vacíos simplemente no están. */
  plan: AsignacionComida[];
  cargando: boolean;
  recetaAsignada: (dia: DiaSemana, horario: HorarioComida) => string | null;
  asignarReceta: (dia: DiaSemana, horario: HorarioComida, recetaId: string) => void;
  quitarAsignacion: (dia: DiaSemana, horario: HorarioComida) => void;
  /** Limpia todos los casilleros de una receta; se usa al eliminarla. */
  quitarRecetaDelPlan: (recetaId: string) => void;
}

const PlanComidasContext = createContext<ValorPlan | undefined>(undefined);

function esAsignacion(valor: unknown): valor is AsignacionComida {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const posible = valor as Record<string, unknown>;
  return (
    DIAS.some((dia) => dia === posible.dia) &&
    HORARIOS.some((horario) => horario === posible.horario) &&
    (typeof posible.recetaId === 'string' || posible.recetaId === null)
  );
}

function esPlan(valor: unknown): valor is AsignacionComida[] {
  return Array.isArray(valor) && valor.every(esAsignacion);
}

interface Props {
  children: React.ReactNode;
}

export function ProveedorPlanComidas({ children }: Props) {
  const [plan, setPlan] = useState<AsignacionComida[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargar = async (): Promise<void> => {
      const guardado = await leerJSON(CLAVES.planComidas, esPlan);
      if (guardado !== null) {
        setPlan(guardado);
      }
      setCargando(false);
    };
    void cargar();
  }, []);

  useEffect(() => {
    if (cargando) {
      return;
    }
    void guardarJSON(CLAVES.planComidas, plan);
  }, [plan, cargando]);

  const recetaAsignada = useCallback(
    (dia: DiaSemana, horario: HorarioComida): string | null =>
      plan.find((asignacion) => asignacion.dia === dia && asignacion.horario === horario)
        ?.recetaId ?? null,
    [plan],
  );

  const asignarReceta = useCallback(
    (dia: DiaSemana, horario: HorarioComida, recetaId: string): void => {
      setPlan((actual) => [
        // Se quita la asignación previa del casillero, si la había, y se agrega la nueva.
        ...actual.filter((asignacion) => asignacion.dia !== dia || asignacion.horario !== horario),
        { dia, horario, recetaId },
      ]);
    },
    [],
  );

  const quitarAsignacion = useCallback((dia: DiaSemana, horario: HorarioComida): void => {
    setPlan((actual) =>
      actual.filter((asignacion) => asignacion.dia !== dia || asignacion.horario !== horario),
    );
  }, []);

  const quitarRecetaDelPlan = useCallback((recetaId: string): void => {
    setPlan((actual) => actual.filter((asignacion) => asignacion.recetaId !== recetaId));
  }, []);

  const valor = useMemo<ValorPlan>(
    () => ({
      plan,
      cargando,
      recetaAsignada,
      asignarReceta,
      quitarAsignacion,
      quitarRecetaDelPlan,
    }),
    [plan, cargando, recetaAsignada, asignarReceta, quitarAsignacion, quitarRecetaDelPlan],
  );

  return <PlanComidasContext.Provider value={valor}>{children}</PlanComidasContext.Provider>;
}

export function usePlanComidas(): ValorPlan {
  const contexto = useContext(PlanComidasContext);
  if (contexto === undefined) {
    throw new Error('usePlanComidas debe usarse dentro de <ProveedorPlanComidas>');
  }
  return contexto;
}
