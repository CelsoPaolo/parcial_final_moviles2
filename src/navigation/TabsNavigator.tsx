import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { useTema } from '../theme/useTema';
import { BuscarStackNavigator } from './BuscarStackNavigator';
import { FavoritosStackNavigator } from './FavoritosStackNavigator';
import { InicioStackNavigator } from './InicioStackNavigator';
import { PlanStackNavigator } from './PlanStackNavigator';
import { TabsParamList } from './types';

const Tabs = createBottomTabNavigator<TabsParamList>();

/** Navegación principal: una pestaña por sección, cada una con su propio stack. */
export function TabsNavigator() {
  const { colores } = useTema();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSuave,
        tabBarStyle: {
          backgroundColor: colores.superficie,
          borderTopColor: colores.borde,
        },
      }}
    >
      <Tabs.Screen
        name="Inicio"
        component={InicioStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Favoritos"
        component={FavoritosStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Buscar"
        component={BuscarStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Plan"
        component={PlanStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
