import React from 'react';

import { InicioScreen } from '../screens/InicioScreen';
import { StackRecetas } from './StackRecetas';

export function InicioStackNavigator() {
  return <StackRecetas pantallaLista={InicioScreen} titulo="Recetas" />;
}
