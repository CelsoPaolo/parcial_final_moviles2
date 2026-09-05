import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';

interface Props {
  etiqueta: string;
  valor: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}

/** Campo de formulario con etiqueta y mensaje de error debajo. */
export function CampoTexto({
  etiqueta,
  valor,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  multiline = false,
}: Props) {
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colores.textoSuave}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[estilos.input, multiline && estilos.inputMultilinea, error !== undefined && estilos.inputError]}
      />
      {error !== undefined && <Text style={estilos.error}>{error}</Text>}
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    contenedor: {
      marginBottom: 16,
    },
    etiqueta: {
      fontSize: 13,
      fontWeight: '700',
      color: colores.texto,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      minHeight: 44,
      fontSize: 15,
      color: colores.texto,
    },
    inputMultilinea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    inputError: {
      borderColor: colores.peligro,
    },
    error: {
      fontSize: 12,
      color: colores.peligro,
      marginTop: 4,
    },
  });
