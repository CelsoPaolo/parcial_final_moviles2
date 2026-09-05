import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';

interface Props {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  mensaje: string;
}

/** Mensaje amigable cuando una lista no tiene resultados. */
export function EstadoVacio({ icono, titulo, mensaje }: Props) {
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);

  return (
    <View style={estilos.contenedor}>
      <Ionicons name={icono} size={56} color={colores.primario} />
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.mensaje}>{mensaje}</Text>
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    contenedor: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingTop: 64,
    },
    titulo: {
      fontSize: 18,
      fontWeight: '700',
      color: colores.texto,
      marginTop: 16,
    },
    mensaje: {
      fontSize: 14,
      color: colores.textoSuave,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 20,
    },
  });
