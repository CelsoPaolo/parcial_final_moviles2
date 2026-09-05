import React from 'react';

import { BuscarScreen } from '../screens/BuscarScreen';
import { StackRecetas } from './StackRecetas';

export function BuscarStackNavigator() {
  return <StackRecetas pantallaLista={BuscarScreen} titulo="Buscar" />;
}
