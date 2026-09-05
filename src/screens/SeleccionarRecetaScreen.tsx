import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { EstadoVacio } from '../components/EstadoVacio';
import { RecetaCard } from '../components/RecetaCard';
import { usePlanComidas } from '../context/PlanComidasContext';
import { useRecetas } from '../context/RecetasContext';
import { PlanStackParamList } from '../navigation/types';
import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';
import { NOMBRES_DIA } from '../types/PlanComidas';
import { Receta } from '../types/Receta';
import { normalizar } from '../utils/texto';

type Props = NativeStackScreenProps<PlanStackParamList, 'SeleccionarReceta'>;

/** Lista para elegir qué receta ocupa un casillero del plan. */
export function SeleccionarRecetaScreen({ route, navigation }: Props) {
  const { dia, horario } = route.params;
  const { recetas } = useRecetas();
  const { asignarReceta } = usePlanComidas();
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);
  const [texto, setTexto] = useState<string>('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: `${horario} · ${NOMBRES_DIA[dia]}` });
  }, [navigation, dia, horario]);

  const resultados = useMemo<Receta[]>(() => {
    const busqueda = normalizar(texto.trim());
    if (busqueda === '') {
      return recetas;
    }
    return recetas.filter((receta) => normalizar(receta.nombre).includes(busqueda));
  }, [recetas, texto]);

  const elegir = (recetaId: string): void => {
    asignarReceta(dia, horario, recetaId);
    navigation.goBack();
  };

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.buscador}>
        <Ionicons name="search" size={18} color={colores.textoSuave} />
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Filtrar por nombre"
          placeholderTextColor={colores.textoSuave}
          style={estilos.input}
          autoCorrect={false}
        />
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
            mensaje={`Nada coincide con "${texto.trim()}". Prueba con otro nombre.`}
          />
        }
        renderItem={({ item }) => (
          // Acá el corazón no aporta: la acción de la tarjeta es asignar, no marcar favorito.
          <RecetaCard receta={item} onPress={() => elegir(item.id)} mostrarFavorito={false} />
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
