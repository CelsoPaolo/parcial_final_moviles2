import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { PlanComidasScreen } from '../screens/PlanComidasScreen';
import { SeleccionarRecetaScreen } from '../screens/SeleccionarRecetaScreen';
import { useOpcionesStack } from './opciones';
import { PlanStackParamList } from './types';

const Stack = createNativeStackNavigator<PlanStackParamList>();

/** Stack de la pestaña Plan: cuadrícula semanal -> selector de receta. */
export function PlanStackNavigator() {
  const opciones = useOpcionesStack();
  return (
    <Stack.Navigator screenOptions={opciones}>
      <Stack.Screen name="Plan" component={PlanComidasScreen} options={{ title: 'Plan semanal' }} />
      <Stack.Screen name="SeleccionarReceta" component={SeleccionarRecetaScreen} />
    </Stack.Navigator>
  );
}
