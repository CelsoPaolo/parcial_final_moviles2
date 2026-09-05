/**
 * Modelo de datos de la app. Todo lo que se muestra en pantalla sale de aquí.
 */

export interface Ingrediente {
  nombre: string;
  cantidad: string;
}

/** Categorías válidas de una receta. */
export type CategoriaReceta = 'Desayuno' | 'Almuerzo' | 'Cena' | 'Postre' | 'Vegano';

export interface Receta {
  id: string;
  nombre: string;
  categoria: CategoriaReceta;
  imagen: string;
  tiempoPrep: number;
  porciones: number;
  ingredientes: Ingrediente[];
  pasos: string[];
  /** true si la creó el usuario; las del catálogo mockeado son false. */
  esPropia: boolean;
  /** Fecha ISO de creación. Solo la tienen las recetas propias. */
  creadaEn?: string;
}

/** Datos que llena el usuario en el formulario, sin los campos que genera la app. */
export type DatosReceta = Omit<Receta, 'id' | 'esPropia' | 'creadaEn'>;

/** Categoría seleccionable en el filtro de Inicio: las reales + "Todas". */
export type FiltroCategoria = CategoriaReceta | 'Todas';

/** Categorías reales, para el selector del formulario. */
export const CATEGORIAS: CategoriaReceta[] = [
  'Desayuno',
  'Almuerzo',
  'Cena',
  'Postre',
  'Vegano',
];

/** Orden en el que se muestran los chips de categoría. */
export const CATEGORIAS_FILTRO: FiltroCategoria[] = ['Todas', ...CATEGORIAS];

/** Criterios disponibles para ordenar la lista de Inicio. */
export type OrdenLista = 'Recientes' | 'Nombre' | 'Tiempo';

export const ORDENES: { valor: OrdenLista; etiqueta: string }[] = [
  { valor: 'Recientes', etiqueta: 'Recientes' },
  { valor: 'Nombre', etiqueta: 'Nombre A-Z' },
  { valor: 'Tiempo', etiqueta: 'Más rápidas' },
];
