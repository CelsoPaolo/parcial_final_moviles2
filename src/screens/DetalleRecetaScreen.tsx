import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ImagenReceta } from '../components/ImagenReceta';
import { useFavoritos } from '../context/FavoritosContext';
import { usePlanComidas } from '../context/PlanComidasContext';
import { useRecetas } from '../context/RecetasContext';
import { RecetasStackParamList } from '../navigation/types';
import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';

type Props = NativeStackScreenProps<RecetasStackParamList, 'DetalleReceta'>;

export function DetalleRecetaScreen({ route, navigation }: Props) {
  const { recetaId } = route.params;
  const { obtenerReceta, eliminarReceta } = useRecetas();
  const { esFavorito, toggleFavorito, quitarFavorito } = useFavoritos();
  const { quitarRecetaDelPlan } = usePlanComidas();
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);

  const receta = obtenerReceta(recetaId);

  // El título de la barra depende de la receta, que solo se conoce dentro de la
  // pantalla (la ruta únicamente recibe el id).
  useLayoutEffect(() => {
    navigation.setOptions({ title: receta?.nombre ?? 'Receta' });
  }, [navigation, receta]);

  if (receta === undefined) {
    return (
      <View style={estilos.contenedorVacio}>
        <Text style={estilos.mensajeVacio}>No se encontró la receta.</Text>
      </View>
    );
  }

  const marcada = esFavorito(receta.id);

  const confirmarEliminar = (): void => {
    Alert.alert('Eliminar receta', '¿Seguro que quieres eliminar esta receta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          // Al borrarla hay que limpiar las referencias que quedan en otras partes.
          eliminarReceta(receta.id);
          quitarFavorito(receta.id);
          quitarRecetaDelPlan(receta.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={estilos.contenedor} contentContainerStyle={estilos.contenido}>
      <View>
        <ImagenReceta uri={receta.imagen} estilo={estilos.imagen} tamanoIcono={48} />
        <Pressable
          onPress={() => toggleFavorito(receta.id)}
          style={estilos.botonFavorito}
          accessibilityRole="button"
          accessibilityLabel={marcada ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Ionicons
            name={marcada ? 'heart' : 'heart-outline'}
            size={26}
            color={marcada ? colores.favorito : colores.textoSuave}
          />
        </Pressable>
      </View>

      <View style={estilos.cuerpo}>
        <View style={estilos.filaEtiquetas}>
          <Text style={estilos.categoria}>{receta.categoria.toUpperCase()}</Text>
          {receta.esPropia && (
            <View style={estilos.badge}>
              <Ionicons name="person" size={10} color={colores.primario} />
              <Text style={estilos.badgeTexto}>Mi receta</Text>
            </View>
          )}
        </View>

        <Text style={estilos.nombre}>{receta.nombre}</Text>

        <View style={estilos.metaFila}>
          <View style={estilos.metaItem}>
            <Ionicons name="time-outline" size={18} color={colores.primario} />
            <Text style={estilos.metaTexto}>{receta.tiempoPrep} min</Text>
          </View>
          <View style={estilos.metaItem}>
            <Ionicons name="people-outline" size={18} color={colores.primario} />
            <Text style={estilos.metaTexto}>{receta.porciones} porciones</Text>
          </View>
        </View>

        {/* Editar y eliminar solo tienen sentido en las recetas que creó el usuario. */}
        {receta.esPropia && (
          <View style={estilos.filaAcciones}>
            <Pressable
              style={estilos.botonAccion}
              onPress={() => navigation.navigate('CrearReceta', { recetaId: receta.id })}
              accessibilityRole="button"
            >
              <Ionicons name="create-outline" size={18} color={colores.primario} />
              <Text style={estilos.botonAccionTexto}>Editar</Text>
            </Pressable>
            <Pressable
              style={estilos.botonAccion}
              onPress={confirmarEliminar}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={18} color={colores.peligro} />
              <Text style={[estilos.botonAccionTexto, { color: colores.peligro }]}>Eliminar</Text>
            </Pressable>
          </View>
        )}

        <Text style={estilos.tituloSeccion}>Ingredientes</Text>
        {receta.ingredientes.map((ingrediente, indice) => (
          <View key={`${ingrediente.nombre}-${indice}`} style={estilos.filaIngrediente}>
            <Text style={estilos.nombreIngrediente}>{ingrediente.nombre}</Text>
            <Text style={estilos.cantidadIngrediente}>{ingrediente.cantidad}</Text>
          </View>
        ))}

        <Text style={estilos.tituloSeccion}>Preparación</Text>
        {receta.pasos.map((paso, indice) => (
          <View key={`${paso}-${indice}`} style={estilos.filaPaso}>
            <View style={estilos.numeroPaso}>
              <Text style={estilos.numeroPasoTexto}>{indice + 1}</Text>
            </View>
            <Text style={estilos.textoPaso}>{paso}</Text>
          </View>
        ))}
      </View>
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
      paddingBottom: 32,
    },
    contenedorVacio: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colores.fondo,
    },
    mensajeVacio: {
      color: colores.textoSuave,
      fontSize: 15,
    },
    imagen: {
      width: '100%',
      height: 260,
    },
    botonFavorito: {
      position: 'absolute',
      right: 16,
      bottom: -22,
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
    },
    cuerpo: {
      padding: 20,
      paddingTop: 32,
    },
    filaEtiquetas: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    categoria: {
      fontSize: 11,
      letterSpacing: 1,
      fontWeight: '700',
      color: colores.primario,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colores.primarioSuave,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    badgeTexto: {
      fontSize: 10,
      fontWeight: '700',
      color: colores.primario,
    },
    nombre: {
      fontSize: 24,
      fontWeight: '700',
      color: colores.texto,
      marginTop: 4,
    },
    metaFila: {
      flexDirection: 'row',
      gap: 20,
      marginTop: 12,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    metaTexto: {
      fontSize: 14,
      color: colores.textoSuave,
    },
    filaAcciones: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 16,
    },
    botonAccion: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    botonAccionTexto: {
      fontSize: 14,
      fontWeight: '600',
      color: colores.primario,
    },
    tituloSeccion: {
      fontSize: 18,
      fontWeight: '700',
      color: colores.texto,
      marginTop: 28,
      marginBottom: 12,
    },
    filaIngrediente: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 8,
    },
    nombreIngrediente: {
      flex: 1,
      fontSize: 14,
      color: colores.texto,
    },
    cantidadIngrediente: {
      fontSize: 13,
      fontWeight: '600',
      color: colores.primario,
      marginLeft: 12,
    },
    filaPaso: {
      flexDirection: 'row',
      marginBottom: 14,
    },
    numeroPaso: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    numeroPasoTexto: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
    },
    textoPaso: {
      flex: 1,
      fontSize: 14,
      lineHeight: 21,
      color: colores.texto,
    },
  });
