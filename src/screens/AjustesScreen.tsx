import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PreferenciaTema, PREFERENCIAS, useTemaContexto } from '../context/TemaContext';
import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';

/** El ícono es cosa de la vista, no del contexto, así que vive acá. */
const ICONOS: Record<PreferenciaTema, keyof typeof Ionicons.glyphMap> = {
  auto: 'phone-portrait-outline',
  claro: 'sunny-outline',
  oscuro: 'moon-outline',
};

export function AjustesScreen() {
  const { preferencia, cambiarPreferencia } = useTemaContexto();
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);

  return (
    <ScrollView style={estilos.contenedor} contentContainerStyle={estilos.contenido}>
      <Text style={estilos.tituloSeccion}>Apariencia</Text>
      <Text style={estilos.descripcion}>
        Elige cómo se ve la app. Con &quot;Automático&quot; sigue el tema de tu teléfono.
      </Text>

      <View style={estilos.grupo}>
        {PREFERENCIAS.map((opcion) => {
          const activa = opcion.valor === preferencia;
          return (
            <Pressable
              key={opcion.valor}
              style={[estilos.opcion, activa && estilos.opcionActiva]}
              onPress={() => cambiarPreferencia(opcion.valor)}
              accessibilityRole="radio"
              accessibilityState={{ selected: activa }}
            >
              <Ionicons
                name={ICONOS[opcion.valor]}
                size={20}
                color={activa ? colores.primario : colores.textoSuave}
              />
              <Text style={[estilos.opcionTexto, activa && estilos.opcionTextoActivo]}>
                {opcion.etiqueta}
              </Text>
              {activa && <Ionicons name="checkmark-circle" size={20} color={colores.primario} />}
            </Pressable>
          );
        })}
      </View>

      <Text style={estilos.nota}>La preferencia queda guardada para las próximas sesiones.</Text>
    </ScrollView>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    contenido: {
      padding: 20,
    },
    tituloSeccion: {
      fontSize: 18,
      fontWeight: '700',
      color: colores.texto,
    },
    descripcion: {
      fontSize: 13,
      color: colores.textoSuave,
      marginTop: 4,
      marginBottom: 16,
      lineHeight: 19,
    },
    grupo: {
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 14,
      overflow: 'hidden',
    },
    opcion: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colores.borde,
    },
    opcionActiva: {
      backgroundColor: colores.primarioSuave,
    },
    opcionTexto: {
      flex: 1,
      fontSize: 15,
      color: colores.texto,
    },
    opcionTextoActivo: {
      fontWeight: '700',
      color: colores.primario,
    },
    nota: {
      fontSize: 12,
      color: colores.textoSuave,
      marginTop: 14,
    },
  });
