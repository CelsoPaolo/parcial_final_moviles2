import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { EstadoVacio } from '../components/EstadoVacio';
import { RecetaCard } from '../components/RecetaCard';
import { useFavoritos } from '../context/FavoritosContext';
import { useRecetas } from '../context/RecetasContext';
import { RecetasStackParamList } from '../navigation/types';
import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';
import { Receta } from '../types/Receta';

type Props = NativeStackScreenProps<RecetasStackParamList, 'Lista'>;

export function FavoritosScreen({ navigation }: Props) {
  const { favoritos, cargando: cargandoFavoritos } = useFavoritos();
  const { recetas, cargando: cargandoRecetas } = useRecetas();
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);

  const recetasFavoritas = useMemo<Receta[]>(
    () => recetas.filter((receta) => favoritos.includes(receta.id)),
    [recetas, favoritos],
  );

  if (cargandoFavoritos || cargandoRecetas) {
    return (
      <View style={estilos.contenedorCentrado}>
        <ActivityIndicator color={colores.primario} />
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={recetasFavoritas}
        keyExtractor={(receta) => receta.id}
        contentContainerStyle={estilos.contenidoLista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EstadoVacio
            icono="heart-outline"
            titulo="Aún no tienes recetas favoritas"
            mensaje="Toca el corazón en cualquier receta para guardarla aquí y encontrarla rápido."
          />
        }
        renderItem={({ item }) => (
          <RecetaCard
            receta={item}
            onPress={() => navigation.navigate('DetalleReceta', { recetaId: item.id })}
          />
        )}
      />
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    contenedorCentrado: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colores.fondo,
    },
    contenidoLista: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
    },
  });
