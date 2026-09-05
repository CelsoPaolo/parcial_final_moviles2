import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colores } from '../theme/colores';
import { useEstilos } from '../theme/useTema';

interface Props {
  etiqueta: string;
  activo: boolean;
  onPress: () => void;
}

/** Chip reutilizable: filtro de categoría, selector de orden y del formulario. */
export function CategoriaChip({ etiqueta, activo, onPress }: Props) {
  const estilos = useEstilos(crearEstilos);

  return (
    <Pressable
      onPress={onPress}
      style={[estilos.chip, activo && estilos.chipActivo]}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
    >
      <Text style={[estilos.texto, activo && estilos.textoActivo]}>{etiqueta}</Text>
    </Pressable>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      marginRight: 8,
    },
    chipActivo: {
      backgroundColor: colores.primario,
      borderColor: colores.primario,
    },
    texto: {
      fontSize: 13,
      fontWeight: '600',
      color: colores.textoSuave,
    },
    textoActivo: {
      color: '#FFFFFF',
    },
  });
