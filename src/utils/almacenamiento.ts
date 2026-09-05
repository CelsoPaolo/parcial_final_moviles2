import AsyncStorage from '@react-native-async-storage/async-storage';

/** Claves usadas en AsyncStorage, todas juntas para no repetir strings sueltos. */
export const CLAVES = {
  favoritos: '@recetas:favoritos',
  recetasPropias: '@recetas:recetas_propias',
  planComidas: '@recetas:plan_comidas',
  preferenciaTema: '@recetas:preferencia_tema',
} as const;

/**
 * Lee y parsea un valor guardado. Como `JSON.parse` devuelve `unknown`, quien
 * llama debe validar la forma del dato con `esValido` antes de confiar en él.
 */
export async function leerJSON<T>(
  clave: string,
  esValido: (valor: unknown) => valor is T,
): Promise<T | null> {
  try {
    const guardado = await AsyncStorage.getItem(clave);
    if (guardado === null) {
      return null;
    }
    const leido: unknown = JSON.parse(guardado);
    return esValido(leido) ? leido : null;
  } catch (error) {
    console.warn(`No se pudo leer "${clave}" del almacenamiento`, error);
    return null;
  }
}

/** Guarda un valor serializado; un fallo se avisa por consola y no rompe la app. */
export async function guardarJSON(clave: string, valor: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.warn(`No se pudo guardar "${clave}" en el almacenamiento`, error);
  }
}
