import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useFavoritos } from '../context/FavoritosContext';
import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';
import { Receta } from '../types/Receta';
import { ImagenReceta } from './ImagenReceta';

interface Props {
  receta: Receta;
  onPress: () => void;
  /** Permite ocultar el corazón donde no aporta, como en el selector del plan. */
  mostrarFavorito?: boolean;
}

/** Tarjeta reutilizada por Inicio, Favoritos, Buscar y el selector del plan. */
export function RecetaCard({ receta, onPress, mostrarFavorito = true }: Props) {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);
  const marcada = esFavorito(receta.id);

  return (
    <Pressable
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.tarjetaPresionada]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver receta ${receta.nombre}`}
    >
      <ImagenReceta uri={receta.imagen} estilo={estilos.imagen} />

      <View style={estilos.contenido}>
        <View style={estilos.filaEtiquetas}>
          <Text style={estilos.categoria}>{receta.categoria.toUpperCase()}</Text>
          {receta.esPropia && (
            <View style={estilos.badge}>
              <Ionicons name="person" size={9} color={colores.primario} />
              <Text style={estilos.badgeTexto}>Mi receta</Text>
            </View>
          )}
        </View>

        <Text style={estilos.nombre} numberOfLines={2}>
          {receta.nombre}
        </Text>

        <View style={estilos.metaFila}>
          <Ionicons name="time-outline" size={14} color={colores.textoSuave} />
          <Text style={estilos.meta}>{receta.tiempoPrep} min</Text>
          <Ionicons name="people-outline" size={14} color={colores.textoSuave} />
          <Text style={estilos.meta}>{receta.porciones} porciones</Text>
        </View>
      </View>

      {mostrarFavorito && (
        <Pressable
          onPress={() => toggleFavorito(receta.id)}
          hitSlop={10}
          style={estilos.botonFavorito}
          accessibilityRole="button"
          accessibilityLabel={marcada ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Ionicons
            name={marcada ? 'heart' : 'heart-outline'}
            size={24}
            color={marcada ? colores.favorito : colores.textoSuave}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    tarjeta: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colores.superficie,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colores.borde,
      padding: 10,
      marginBottom: 12,
    },
    tarjetaPresionada: {
      opacity: 0.7,
    },
    imagen: {
      width: 88,
      height: 88,
      borderRadius: 12,
    },
    contenido: {
      flex: 1,
      paddingHorizontal: 12,
    },
    filaEtiquetas: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 2,
    },
    categoria: {
      fontSize: 10,
      letterSpacing: 1,
      fontWeight: '700',
      color: colores.primario,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: colores.primarioSuave,
      borderRadius: 999,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    badgeTexto: {
      fontSize: 9,
      fontWeight: '700',
      color: colores.primario,
    },
    nombre: {
      fontSize: 16,
      fontWeight: '600',
      color: colores.texto,
      marginBottom: 6,
    },
    metaFila: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    meta: {
      fontSize: 12,
      color: colores.textoSuave,
      marginRight: 8,
    },
    botonFavorito: {
      padding: 4,
    },
  });
