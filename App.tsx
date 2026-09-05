import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProveedorFavoritos } from './src/context/FavoritosContext';
import { ProveedorPlanComidas } from './src/context/PlanComidasContext';
import { ProveedorRecetas } from './src/context/RecetasContext';
import { ProveedorTema } from './src/context/TemaContext';
import { TabsNavigator } from './src/navigation/TabsNavigator';
import { useTema } from './src/theme/useTema';

/**
 * Va separado de `App` porque necesita leer el tema, y para eso tiene que estar
 * por dentro de `ProveedorTema`.
 */
function Contenido() {
  const { colores, esOscuro } = useTema();

  // Se le pasa el tema a React Navigation para que headers y fondos de las
  // transiciones acompañen al modo claro/oscuro.
  const base = esOscuro ? DarkTheme : DefaultTheme;
  const temaNavegacion = {
    ...base,
    colors: {
      ...base.colors,
      background: colores.fondo,
      card: colores.superficie,
      text: colores.texto,
      border: colores.borde,
      primary: colores.primario,
    },
  };

  return (
    <NavigationContainer theme={temaNavegacion}>
      <TabsNavigator />
      <StatusBar style={esOscuro ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ProveedorTema>
        <ProveedorRecetas>
          <ProveedorFavoritos>
            <ProveedorPlanComidas>
              <Contenido />
            </ProveedorPlanComidas>
          </ProveedorFavoritos>
        </ProveedorRecetas>
      </ProveedorTema>
    </SafeAreaProvider>
  );
}
