const ACENTOS: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ü: 'u',
  ñ: 'n',
};

/**
 * Pasa un texto a minúsculas y le quita los acentos, para que la búsqueda
 * encuentre "platano" cuando la receta dice "plátano".
 */
export function normalizar(texto: string): string {
  return texto.toLowerCase().replace(/[áéíóúüñ]/g, (letra) => ACENTOS[letra] ?? letra);
}
