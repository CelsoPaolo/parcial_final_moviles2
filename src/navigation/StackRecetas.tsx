import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

import { AjustesScreen } from '../screens/AjustesScreen';
import { CrearRecetaScreen } from '../screens/CrearRecetaScreen';
import { DetalleRecetaScreen } from '../screens/DetalleRecetaScreen';
import { useOpcionesStack } from './opciones';
import { RecetasStackParamList } from './types';

const Stack = createNativeStackNavigator<RecetasStackParamList>();

interface Props {
  /** Pantalla que se muestra como raíz del stack (Inicio, Favoritos o Buscar). */
  pantallaLista: React.ComponentType<NativeStackScreenProps<RecetasStackParamList, 'Lista'>>;
  titulo: string;
}

/**
 * Stack compartido por las pestañas de recetas: cambia la pantalla raíz, pero
 * el detalle y el formulario son siempre los mismos.
 */
export function StackRecetas({ pantallaLista, titulo }: Props) {
  const opciones = useOpcionesStack();
  return (
    <Stack.Navigator screenOptions={opciones}>
      <Stack.Screen name="Lista" component={pantallaLista} options={{ title: titulo }} />
      <Stack.Screen name="DetalleReceta" component={DetalleRecetaScreen} />
      <Stack.Screen name="CrearReceta" component={CrearRecetaScreen} />
      <Stack.Screen name="Ajustes" component={AjustesScreen} options={{ title: 'Ajustes' }} />
    </Stack.Navigator>
  );
}
