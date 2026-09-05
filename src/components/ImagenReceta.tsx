import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';

import { useTema } from '../theme/useTema';

interface Props {
  uri: string;
  estilo: StyleProp<ImageStyle>;
  tamanoIcono?: number;
}

/**
 * Muestra la imagen de una receta. Las recetas propias pueden no tener foto,
 * así que en ese caso se dibuja un marcador de posición en vez de un hueco.
 */
export function ImagenReceta({ uri, estilo, tamanoIcono = 28 }: Props) {
  const { colores } = useTema();

  if (uri.trim() === '') {
    // El marcador es un View, que no acepta estilos de imagen: se reutilizan
    // solo las medidas del estilo recibido.
    const { width, height, borderRadius } = StyleSheet.flatten(estilo);
    return (
      <View
        style={[
          { width, height, borderRadius, backgroundColor: colores.primarioSuave },
          estilos.marcador,
        ]}
      >
        <Ionicons name="restaurant-outline" size={tamanoIcono} color={colores.primario} />
      </View>
    );
  }

  return <Image source={{ uri }} style={[estilo, { backgroundColor: colores.primarioSuave }]} />;
}

const estilos = StyleSheet.create({
  marcador: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
