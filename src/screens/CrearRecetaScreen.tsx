import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CampoTexto } from '../components/CampoTexto';
import { CategoriaChip } from '../components/CategoriaChip';
import { ImagenReceta } from '../components/ImagenReceta';
import { useRecetas } from '../context/RecetasContext';
import { RecetasStackParamList } from '../navigation/types';
import { Colores } from '../theme/colores';
import { useEstilos, useTema } from '../theme/useTema';
import { CATEGORIAS, CategoriaReceta, DatosReceta, Ingrediente } from '../types/Receta';

type Props = NativeStackScreenProps<RecetasStackParamList, 'CrearReceta'>;

/** Errores de validación: la clave es el campo, el valor el mensaje a mostrar. */
interface Errores {
  nombre?: string;
  tiempoPrep?: string;
  porciones?: string;
  ingredientes?: string;
  pasos?: string;
}

const INGREDIENTE_VACIO: Ingrediente = { nombre: '', cantidad: '' };

export function CrearRecetaScreen({ route, navigation }: Props) {
  const { recetaId } = route.params ?? {};
  const { obtenerReceta, agregarReceta, actualizarReceta } = useRecetas();
  const { colores } = useTema();
  const estilos = useEstilos(crearEstilos);

  // Si llega un id, el formulario funciona en modo edición y arranca con los
  // datos de esa receta; si no, arranca vacío para crear una nueva.
  const recetaEditada = useMemo(
    () => (recetaId !== undefined ? obtenerReceta(recetaId) : undefined),
    [recetaId, obtenerReceta],
  );
  const esEdicion = recetaEditada !== undefined;

  const [nombre, setNombre] = useState<string>(recetaEditada?.nombre ?? '');
  const [categoria, setCategoria] = useState<CategoriaReceta>(recetaEditada?.categoria ?? 'Almuerzo');
  const [tiempoPrep, setTiempoPrep] = useState<string>(
    recetaEditada !== undefined ? String(recetaEditada.tiempoPrep) : '',
  );
  const [porciones, setPorciones] = useState<string>(
    recetaEditada !== undefined ? String(recetaEditada.porciones) : '',
  );
  const [imagen, setImagen] = useState<string>(recetaEditada?.imagen ?? '');
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>(
    recetaEditada?.ingredientes ?? [{ ...INGREDIENTE_VACIO }],
  );
  const [pasos, setPasos] = useState<string[]>(recetaEditada?.pasos ?? ['']);
  const [errores, setErrores] = useState<Errores>({});

  useLayoutEffect(() => {
    navigation.setOptions({ title: esEdicion ? 'Editar receta' : 'Nueva receta' });
  }, [navigation, esEdicion]);

  const elegirDeGaleria = async (): Promise<void> => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos para elegir una imagen.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!resultado.canceled && resultado.assets.length > 0) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const tomarFoto = async (): Promise<void> => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para tomar una foto.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!resultado.canceled && resultado.assets.length > 0) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const cambiarIngrediente = (indice: number, campo: keyof Ingrediente, texto: string): void => {
    setIngredientes((actuales) =>
      actuales.map((ingrediente, i) => (i === indice ? { ...ingrediente, [campo]: texto } : ingrediente)),
    );
  };

  const cambiarPaso = (indice: number, texto: string): void => {
    setPasos((actuales) => actuales.map((paso, i) => (i === indice ? texto : paso)));
  };

  /** Devuelve los datos listos para guardar, o null si hay errores. */
  const validar = (): DatosReceta | null => {
    const nuevosErrores: Errores = {};

    const nombreLimpio = nombre.trim();
    if (nombreLimpio === '') {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    }

    const minutos = Number(tiempoPrep);
    if (!Number.isFinite(minutos) || minutos <= 0) {
      nuevosErrores.tiempoPrep = 'Ingresa un tiempo mayor a 0.';
    }

    const cantidadPorciones = Number(porciones);
    if (!Number.isFinite(cantidadPorciones) || cantidadPorciones <= 0) {
      nuevosErrores.porciones = 'Ingresa una cantidad mayor a 0.';
    }

    // Se descartan las filas que el usuario dejó en blanco antes de validar.
    const ingredientesLimpios = ingredientes
      .map((ingrediente) => ({
        nombre: ingrediente.nombre.trim(),
        cantidad: ingrediente.cantidad.trim(),
      }))
      .filter((ingrediente) => ingrediente.nombre !== '');
    if (ingredientesLimpios.length === 0) {
      nuevosErrores.ingredientes = 'Agrega al menos un ingrediente con nombre.';
    }

    const pasosLimpios = pasos.map((paso) => paso.trim()).filter((paso) => paso !== '');
    if (pasosLimpios.length === 0) {
      nuevosErrores.pasos = 'Agrega al menos un paso de preparación.';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      return null;
    }

    return {
      nombre: nombreLimpio,
      categoria,
      imagen: imagen.trim(),
      tiempoPrep: Math.round(minutos),
      porciones: Math.round(cantidadPorciones),
      ingredientes: ingredientesLimpios,
      pasos: pasosLimpios,
    };
  };

  const guardar = (): void => {
    const datos = validar();
    if (datos === null) {
      Alert.alert('Revisa el formulario', 'Hay campos que faltan o no son válidos.');
      return;
    }
    if (esEdicion && recetaId !== undefined) {
      actualizarReceta(recetaId, datos);
    } else {
      agregarReceta(datos);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={estilos.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
        <Text style={estilos.etiqueta}>Imagen</Text>
        <ImagenReceta uri={imagen} estilo={estilos.previsualizacion} tamanoIcono={40} />
        <View style={estilos.filaBotonesImagen}>
          <Pressable style={estilos.botonSecundario} onPress={() => void elegirDeGaleria()}>
            <Ionicons name="images-outline" size={18} color={colores.primario} />
            <Text style={estilos.botonSecundarioTexto}>Galería</Text>
          </Pressable>
          <Pressable style={estilos.botonSecundario} onPress={() => void tomarFoto()}>
            <Ionicons name="camera-outline" size={18} color={colores.primario} />
            <Text style={estilos.botonSecundarioTexto}>Cámara</Text>
          </Pressable>
          {imagen !== '' && (
            <Pressable style={estilos.botonSecundario} onPress={() => setImagen('')}>
              <Ionicons name="trash-outline" size={18} color={colores.peligro} />
              <Text style={[estilos.botonSecundarioTexto, { color: colores.peligro }]}>Quitar</Text>
            </Pressable>
          )}
        </View>

        <CampoTexto
          etiqueta="Nombre"
          valor={nombre}
          onChangeText={setNombre}
          placeholder="Ej. Arroz con pollo"
          error={errores.nombre}
        />

        <Text style={estilos.etiqueta}>Categoría</Text>
        <View style={estilos.filaCategorias}>
          {CATEGORIAS.map((opcion) => (
            <CategoriaChip
              key={opcion}
              etiqueta={opcion}
              activo={opcion === categoria}
              onPress={() => setCategoria(opcion)}
            />
          ))}
        </View>

        <View style={estilos.filaDoble}>
          <View style={estilos.mitad}>
            <CampoTexto
              etiqueta="Tiempo (min)"
              valor={tiempoPrep}
              onChangeText={setTiempoPrep}
              placeholder="30"
              keyboardType="number-pad"
              error={errores.tiempoPrep}
            />
          </View>
          <View style={estilos.mitad}>
            <CampoTexto
              etiqueta="Porciones"
              valor={porciones}
              onChangeText={setPorciones}
              placeholder="4"
              keyboardType="number-pad"
              error={errores.porciones}
            />
          </View>
        </View>

        <Text style={estilos.tituloSeccion}>Ingredientes</Text>
        {ingredientes.map((ingrediente, indice) => (
          <View key={`ingrediente-${indice}`} style={estilos.filaDinamica}>
            <TextInput
              value={ingrediente.nombre}
              onChangeText={(texto) => cambiarIngrediente(indice, 'nombre', texto)}
              placeholder="Ingrediente"
              placeholderTextColor={colores.textoSuave}
              style={[estilos.input, estilos.inputNombre]}
            />
            <TextInput
              value={ingrediente.cantidad}
              onChangeText={(texto) => cambiarIngrediente(indice, 'cantidad', texto)}
              placeholder="Cantidad"
              placeholderTextColor={colores.textoSuave}
              style={[estilos.input, estilos.inputCantidad]}
            />
            <Pressable
              onPress={() => setIngredientes((actuales) => actuales.filter((_, i) => i !== indice))}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Eliminar ingrediente ${indice + 1}`}
            >
              <Ionicons name="close-circle" size={22} color={colores.textoSuave} />
            </Pressable>
          </View>
        ))}
        {errores.ingredientes !== undefined && <Text style={estilos.error}>{errores.ingredientes}</Text>}
        <Pressable
          style={estilos.botonAgregar}
          onPress={() => setIngredientes((actuales) => [...actuales, { ...INGREDIENTE_VACIO }])}
        >
          <Ionicons name="add" size={18} color={colores.primario} />
          <Text style={estilos.botonAgregarTexto}>Agregar ingrediente</Text>
        </Pressable>

        <Text style={estilos.tituloSeccion}>Pasos</Text>
        {pasos.map((paso, indice) => (
          <View key={`paso-${indice}`} style={estilos.filaDinamica}>
            <View style={estilos.numeroPaso}>
              <Text style={estilos.numeroPasoTexto}>{indice + 1}</Text>
            </View>
            <TextInput
              value={paso}
              onChangeText={(texto) => cambiarPaso(indice, texto)}
              placeholder="Describe el paso"
              placeholderTextColor={colores.textoSuave}
              multiline
              style={[estilos.input, estilos.inputPaso]}
            />
            <Pressable
              onPress={() => setPasos((actuales) => actuales.filter((_, i) => i !== indice))}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Eliminar paso ${indice + 1}`}
            >
              <Ionicons name="close-circle" size={22} color={colores.textoSuave} />
            </Pressable>
          </View>
        ))}
        {errores.pasos !== undefined && <Text style={estilos.error}>{errores.pasos}</Text>}
        <Pressable style={estilos.botonAgregar} onPress={() => setPasos((actuales) => [...actuales, ''])}>
          <Ionicons name="add" size={18} color={colores.primario} />
          <Text style={estilos.botonAgregarTexto}>Agregar paso</Text>
        </Pressable>

        <Pressable style={estilos.botonGuardar} onPress={guardar} accessibilityRole="button">
          <Text style={estilos.botonGuardarTexto}>
            {esEdicion ? 'Guardar cambios' : 'Guardar receta'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
      paddingBottom: 40,
    },
    etiqueta: {
      fontSize: 13,
      fontWeight: '700',
      color: colores.texto,
      marginBottom: 6,
    },
    previsualizacion: {
      width: '100%',
      height: 180,
      borderRadius: 14,
    },
    filaBotonesImagen: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 10,
      marginBottom: 20,
    },
    botonSecundario: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    botonSecundarioTexto: {
      fontSize: 13,
      fontWeight: '600',
      color: colores.primario,
    },
    filaCategorias: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: 8,
      marginBottom: 16,
    },
    filaDoble: {
      flexDirection: 'row',
      gap: 12,
    },
    mitad: {
      flex: 1,
    },
    tituloSeccion: {
      fontSize: 17,
      fontWeight: '700',
      color: colores.texto,
      marginTop: 12,
      marginBottom: 12,
    },
    filaDinamica: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colores.superficie,
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      minHeight: 44,
      fontSize: 14,
      color: colores.texto,
    },
    inputNombre: {
      flex: 3,
    },
    inputCantidad: {
      flex: 2,
    },
    inputPaso: {
      flex: 1,
      textAlignVertical: 'top',
    },
    numeroPaso: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
    },
    numeroPasoTexto: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
    },
    botonAgregar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colores.primario,
      borderRadius: 12,
      paddingVertical: 12,
      marginTop: 4,
    },
    botonAgregarTexto: {
      fontSize: 14,
      fontWeight: '600',
      color: colores.primario,
    },
    error: {
      fontSize: 12,
      color: colores.peligro,
      marginBottom: 6,
    },
    botonGuardar: {
      backgroundColor: colores.primario,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 28,
    },
    botonGuardarTexto: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });
