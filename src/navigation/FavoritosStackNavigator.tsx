import React from 'react';

import { FavoritosScreen } from '../screens/FavoritosScreen';
import { StackRecetas } from './StackRecetas';

export function FavoritosStackNavigator() {
  return <StackRecetas pantallaLista={FavoritosScreen} titulo="Mis favoritos" />;
}
