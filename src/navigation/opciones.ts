import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { useTema } from '../theme/useTema';

/** Apariencia compartida por los stacks, adaptada al tema activo. */
export function useOpcionesStack(): NativeStackNavigationOptions {
  const { colores } = useTema();
  return {
    headerStyle: { backgroundColor: colores.fondo },
    headerTintColor: colores.texto,
    headerTitleStyle: { fontWeight: '700' },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colores.fondo },
  };
}
