import { NavigatorScreenParams } from '@react-navigation/native';

import { DiaSemana, HorarioComida } from '../types/PlanComidas';

/**
 * Las pestañas de recetas usan el mismo stack (lista -> detalle -> formulario),
 * así que comparten la lista de parámetros y cada pantalla se tipa una sola vez.
 * `CrearReceta` sin `recetaId` crea una receta; con `recetaId` la edita.
 */
export type RecetasStackParamList = {
  Lista: undefined;
  DetalleReceta: { recetaId: string };
  CrearReceta: { recetaId?: string };
  Ajustes: undefined;
};

export type PlanStackParamList = {
  Plan: undefined;
  SeleccionarReceta: { dia: DiaSemana; horario: HorarioComida };
};

export type TabsParamList = {
  Inicio: NavigatorScreenParams<RecetasStackParamList>;
  Favoritos: NavigatorScreenParams<RecetasStackParamList>;
  Buscar: NavigatorScreenParams<RecetasStackParamList>;
  Plan: NavigatorScreenParams<PlanStackParamList>;
};
