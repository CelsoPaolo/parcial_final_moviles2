import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ImagenReceta } from '../components/ImagenReceta';
import { usePlanComidas } from '../context/PlanComidasContext';
import { useRecetas } from '../context/RecetasContext';
import { PlanStackParamList } from '../navigation/types';
import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';
import { DIAS, DiaSemana, HORARIOS, HorarioComida, NOMBRES_DIA } from '../types/PlanComidas';

type Props = NativeStackScreenProps<PlanStackParamList, 'Plan'>;

export function PlanComidasScreen({ navigation }: Props) {
  const { recetaAsignada, quitarAsignacion } = usePlanComidas();
  const { obtenerReceta } = useRecetas();
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);

  const confirmarQuitar = (dia: DiaSemana, horario: HorarioComida): void => {
    Alert.alert('Quitar del plan', `¿Seguro que quieres liberar ${horario} de ${NOMBRES_DIA[dia]}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Quitar', style: 'destructive', onPress: () => quitarAsignacion(dia, horario) },
    ]);
  };

  const renderCasillero = (dia: DiaSemana, horario: HorarioComida) => {
    const id = recetaAsignada(dia, horario);
    // Puede haber un id guardado cuya receta ya no exista; se trata como vacío.
    const receta = id !== null ? obtenerReceta(id) : undefined;

    if (receta === undefined) {
      return (
        <Pressable
          key={horario}
          style={estilos.casilleroVacio}
          onPress={() => navigation.navigate('SeleccionarReceta', { dia, horario })}
          accessibilityRole="button"
          accessibilityLabel={`Agregar receta para ${horario} de ${NOMBRES_DIA[dia]}`}
        >
          <Text style={estilos.horarioVacio}>{horario}</Text>
          <View style={estilos.agregar}>
            <Ionicons name="add" size={16} color={colores.primario} />
            <Text style={estilos.agregarTexto}>Agregar</Text>
          </View>
        </Pressable>
      );
    }

    return (
      <View key={horario} style={estilos.casillero}>
        <ImagenReceta uri={receta.imagen} estilo={estilos.miniatura} tamanoIcono={18} />
        <View style={estilos.datos}>
          <Text style={estilos.horario}>{horario}</Text>
          <Text style={estilos.nombreReceta} numberOfLines={1}>
            {receta.nombre}
          </Text>
        </View>
        <Pressable
          onPress={() => confirmarQuitar(dia, horario)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Quitar ${receta.nombre} de ${horario} de ${NOMBRES_DIA[dia]}`}
        >
          <Ionicons name="close-circle" size={22} color={colores.textoSuave} />
        </Pressable>
      </View>
    );
  };

  return (
    <FlatList
      style={estilos.contenedor}
      contentContainerStyle={estilos.contenido}
      data={DIAS}
      keyExtractor={(dia) => dia}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text style={estilos.introduccion}>
          Organiza tus comidas de la semana. Toca un espacio libre para asignarle una receta.
        </Text>
      }
      renderItem={({ item: dia }) => (
        <View style={estilos.tarjetaDia}>
          <Text style={estilos.nombreDia}>{NOMBRES_DIA[dia]}</Text>
          {HORARIOS.map((horario) => renderCasillero(dia, horario))}
        </View>
      )}
    />
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    contenido: {
      padding: 16,
      paddingBottom: 24,
    },
    introduccion: {
      fontSize: 13,
      color: colores.textoSuave,
      marginBottom: 16,
      lineHeight: 19,
    },
    tarjetaDia: {
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 16,
      padding: 12,
      marginBottom: 12,
    },
    nombreDia: {
      fontSize: 15,
      fontWeight: '700',
      color: colores.texto,
      marginBottom: 10,
    },
    casillero: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colores.primarioSuave,
      borderRadius: 12,
      padding: 8,
      marginBottom: 8,
    },
    miniatura: {
      width: 44,
      height: 44,
      borderRadius: 8,
    },
    datos: {
      flex: 1,
    },
    horario: {
      fontSize: 10,
      letterSpacing: 0.8,
      fontWeight: '700',
      color: colores.primario,
    },
    nombreReceta: {
      fontSize: 14,
      fontWeight: '600',
      color: colores.texto,
      marginTop: 1,
    },
    casilleroVacio: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colores.borde,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 14,
      marginBottom: 8,
    },
    horarioVacio: {
      fontSize: 13,
      color: colores.textoSuave,
    },
    agregar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    agregarTexto: {
      fontSize: 13,
      fontWeight: '700',
      color: colores.primario,
    },
  });
