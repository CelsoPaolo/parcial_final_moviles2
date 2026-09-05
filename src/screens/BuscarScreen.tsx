import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { EstadoVacio } from '../components/EstadoVacio';
import { RecetaCard } from '../components/RecetaCard';
import { useRecetas } from '../context/RecetasContext';
import { RecetasStackParamList } from '../navigation/types';
import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';
import { Receta } from '../types/Receta';
import { normalizar } from '../utils/texto';

type Props = NativeStackScreenProps<RecetasStackParamList, 'Lista'>;

export function BuscarScreen({ navigation }: Props) {
  const { recetas } = useRecetas();
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);
  const [texto, setTexto] = useState<string>('');

  const resultados = useMemo<Receta[]>(() => {
    const busqueda = normalizar(texto.trim());
    if (busqueda === '') {
      return recetas;
    }
    // Coincide por nombre de la receta o por el nombre de alguno de sus ingredientes.
    return recetas.filter(
      (receta) =>
        normalizar(receta.nombre).includes(busqueda) ||
        receta.ingredientes.some((ingrediente) => normalizar(ingrediente.nombre).includes(busqueda)),
    );
  }, [recetas, texto]);

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.buscador}>
        <Ionicons name="search" size={18} color={colores.textoSuave} />
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Busca por receta o ingrediente"
          placeholderTextColor={colores.textoSuave}
          style={estilos.input}
          autoCorrect={false}
          returnKeyType="search"
        />
        {texto.length > 0 && (
          <Ionicons
            name="close-circle"
            size={18}
            color={colores.textoSuave}
            onPress={() => setTexto('')}
          />
        )}
      </View>

      <FlatList
        data={resultados}
        keyExtractor={(receta) => receta.id}
        contentContainerStyle={estilos.contenidoLista}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EstadoVacio
            icono="search-outline"
            titulo="No se encontraron recetas con ese criterio"
            mensaje={`Nada coincide con "${texto.trim()}". Prueba con otro nombre o ingrediente.`}
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
    buscador: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginVertical: 12,
    },
    input: {
      flex: 1,
      height: 44,
      fontSize: 15,
      color: colores.texto,
    },
    contenidoLista: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
  });
