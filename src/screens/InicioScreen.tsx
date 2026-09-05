import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { CategoriaChip } from '../components/CategoriaChip';
import { RecetaCard } from '../components/RecetaCard';
import { useRecetas } from '../context/RecetasContext';
import { RecetasStackParamList } from '../navigation/types';
import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';
import { CATEGORIAS_FILTRO, FiltroCategoria, ORDENES, OrdenLista, Receta } from '../types/Receta';

type Props = NativeStackScreenProps<RecetasStackParamList, 'Lista'>;

/**
 * Ordena una copia de la lista según el criterio elegido. "Recientes" deja
 * primero las recetas propias (las únicas con fecha de creación), de la más
 * nueva a la más vieja, y después el catálogo en su orden original.
 */
function ordenarRecetas(recetas: Receta[], orden: OrdenLista): Receta[] {
  const copia = [...recetas];
  if (orden === 'Nombre') {
    return copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  if (orden === 'Tiempo') {
    return copia.sort((a, b) => a.tiempoPrep - b.tiempoPrep);
  }
  return copia.sort((a, b) => (b.creadaEn ?? '').localeCompare(a.creadaEn ?? ''));
}

export function InicioScreen({ navigation }: Props) {
  const { recetas } = useRecetas();
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);
  const [categoria, setCategoria] = useState<FiltroCategoria>('Todas');
  const [orden, setOrden] = useState<OrdenLista>('Recientes');

  // Acceso a Ajustes desde el header; es la única pantalla que lo ofrece.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('Ajustes')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Abrir ajustes"
        >
          <Ionicons name="settings-outline" size={22} color={colores.texto} />
        </Pressable>
      ),
    });
  }, [navigation, colores.texto]);

  const recetasVisibles = useMemo<Receta[]>(() => {
    const filtradas =
      categoria === 'Todas' ? recetas : recetas.filter((receta) => receta.categoria === categoria);
    return ordenarRecetas(filtradas, orden);
  }, [recetas, categoria, orden]);

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={CATEGORIAS_FILTRO}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={estilos.listaChips}
        contentContainerStyle={estilos.contenidoChips}
        renderItem={({ item }) => (
          <CategoriaChip
            etiqueta={item}
            activo={item === categoria}
            onPress={() => setCategoria(item)}
          />
        )}
      />

      <FlatList
        data={recetasVisibles}
        keyExtractor={(receta) => receta.id}
        contentContainerStyle={estilos.contenidoLista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={estilos.encabezado}>
            <Text style={estilos.contador}>
              {recetasVisibles.length} {recetasVisibles.length === 1 ? 'receta' : 'recetas'}
            </Text>
            <View style={estilos.filaOrden}>
              <Ionicons name="swap-vertical" size={14} color={colores.textoSuave} />
              {ORDENES.map((opcion) => (
                <Pressable
                  key={opcion.valor}
                  onPress={() => setOrden(opcion.valor)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: opcion.valor === orden }}
                >
                  <Text
                    style={[estilos.opcionOrden, opcion.valor === orden && estilos.opcionOrdenActiva]}
                  >
                    {opcion.etiqueta}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <RecetaCard
            receta={item}
            onPress={() => navigation.navigate('DetalleReceta', { recetaId: item.id })}
          />
        )}
      />

      <Pressable
        style={estilos.botonFlotante}
        onPress={() => navigation.navigate('CrearReceta', {})}
        accessibilityRole="button"
        accessibilityLabel="Crear receta"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    contenedor: {
      flex: 1,
      backgroundColor: colores.fondo,
    },
    listaChips: {
      flexGrow: 0,
      paddingVertical: 12,
    },
    contenidoChips: {
      paddingHorizontal: 16,
    },
    contenidoLista: {
      paddingHorizontal: 16,
      paddingBottom: 90,
    },
    encabezado: {
      marginBottom: 12,
    },
    contador: {
      fontSize: 12,
      color: colores.textoSuave,
      marginBottom: 8,
    },
    filaOrden: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    opcionOrden: {
      fontSize: 12,
      fontWeight: '600',
      color: colores.textoSuave,
    },
    opcionOrdenActiva: {
      color: colores.primario,
      textDecorationLine: 'underline',
    },
    botonFlotante: {
      position: 'absolute',
      right: 20,
      bottom: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
  });
