/** Colores que necesita la app. Cada tema debe definirlos todos. */
export interface Colores {
  fondo: string;
  superficie: string;
  texto: string;
  textoSuave: string;
  primario: string;
  primarioSuave: string;
  borde: string;
  favorito: string;
  peligro: string;
}

export const temaClaro: Colores = {
  fondo: '#FFF8F0',
  superficie: '#FFFFFF',
  texto: '#2B2118',
  textoSuave: '#8A7C6E',
  primario: '#E4572E',
  primarioSuave: '#FCE9E2',
  borde: '#EFE4DA',
  favorito: '#E4572E',
  peligro: '#D64545',
};

export const temaOscuro: Colores = {
  fondo: '#14100D',
  superficie: '#211B16',
  texto: '#F5EFE9',
  textoSuave: '#A89684',
  primario: '#FF7A50',
  primarioSuave: '#3A241B',
  borde: '#332A22',
  favorito: '#FF7A50',
  peligro: '#FF6B6B',
};
