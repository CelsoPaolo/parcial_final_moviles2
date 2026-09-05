# 🍽️ Recetas

App móvil de recetas de cocina construida con **Expo** y **React Native**. Permite explorar un catálogo de recetas, guardar favoritas, buscar por ingrediente, crear recetas propias con foto y organizar un plan de comidas semanal. Todo funciona sin conexión: no hay backend ni base de datos externa, y la información del usuario se guarda en el propio dispositivo.

Proyecto desarrollado como parcial de la materia **Dispositivos Móviles**.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Expo](https://docs.expo.dev/) SDK 57 | Entorno de desarrollo y ejecución en Expo Go |
| [React Native](https://reactnative.dev/) 0.86 | Framework de UI |
| [React](https://react.dev/) 19.2 | Hooks nativos: `useState`, `useEffect`, `useContext`, `useMemo`, `useCallback` |
| [TypeScript](https://www.typescriptlang.org/) 6.0 | Tipado estricto, sin `any` en todo el proyecto |
| [React Navigation](https://reactnavigation.org/) 7 | Bottom Tabs + Native Stack |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Persistencia local de favoritos, recetas propias, plan y tema |
| [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) | Elegir foto de la galería o tomarla con la cámara |
| [@expo/vector-icons](https://docs.expo.dev/guides/icons/) | Iconografía (Ionicons) |

**No se usa ninguna librería de estado global** (nada de Redux, Zustand o similares): todo el estado compartido se maneja con Context de React.

---

## Cómo correr el proyecto

Requisitos: [Node.js](https://nodejs.org/) 20 o superior y la app **Expo Go** instalada en el teléfono.

```bash
# 1. Instalar dependencias
npm install          # o pnpm install

# 2. Levantar el servidor de desarrollo
npx expo start
```

Escanea el código QR que aparece en la terminal con **Expo Go** (Android) o con la cámara del iPhone (iOS).

Otros comandos útiles:

```bash
npx tsc --noEmit     # verificar que no haya errores de tipos
npx expo-doctor      # revisar la salud de las dependencias
```

---

## Funcionalidades

### Catálogo y navegación
- Cuatro pestañas: **Inicio**, **Favoritos**, **Buscar** y **Plan**, cada una con su propio stack de navegación.
- 15 recetas de ejemplo repartidas en 5 categorías (Desayuno, Almuerzo, Cena, Postre, Vegano).
- Filtro por categoría con chips horizontales, incluida la opción "Todas".
- Ordenamiento de la lista por **recientes**, **nombre (A-Z)** o **tiempo de preparación**.

### Detalle de receta
- Imagen grande, categoría, tiempo de preparación y porciones.
- Lista de ingredientes con sus cantidades.
- Pasos de preparación numerados.
- Botón de favorito con ícono de corazón.

### Favoritos
- Marcar y desmarcar desde cualquier lista o desde el detalle.
- Persistencia en el dispositivo: los favoritos sobreviven al cierre de la app.
- Mensaje amigable cuando la lista está vacía.

### Buscador
- Búsqueda en vivo, sin botón de confirmar.
- Filtra por **nombre de receta** o por **nombre de ingrediente**.
- Ignora mayúsculas y tildes: "platano" encuentra "plátano".
- Estado vacío cuando no hay coincidencias.

### Recetas propias
- **Crear** desde el botón flotante "+" de Inicio: nombre, categoría, tiempo, porciones, imagen y listas dinámicas de ingredientes y pasos.
- **Imagen** desde la galería o tomada con la cámara, con solicitud de permisos.
- **Validación** del formulario con mensajes de error debajo de cada campo.
- **Editar** con el mismo formulario, precargado con los datos de la receta.
- **Eliminar** con diálogo de confirmación; también se limpian sus referencias en favoritos y en el plan de comidas.
- Badge **"Mi receta"** para distinguirlas del catálogo, tanto en la tarjeta como en el detalle.
- Se guardan aparte del dataset de ejemplo, que nunca se modifica.

### Plan de comidas semanal
- Cuadrícula de 7 días × 3 horarios (Desayuno, Almuerzo y Cena) = 21 casilleros.
- Casillero libre: botón "+ Agregar".
- Casillero ocupado: miniatura y nombre de la receta asignada.
- Selector con buscador para elegir cualquier receta, propia o del catálogo.
- Quitar una asignación con diálogo de confirmación.
- Todo el plan se guarda en el dispositivo.

### Apariencia
- **Modo claro y oscuro** completos, con paletas separadas.
- Control manual en **Ajustes** (ícono de engranaje en Inicio) con tres opciones: Automático (sigue al sistema), Claro y Oscuro.
- La preferencia elegida se guarda entre sesiones.
- Ícono de app y splash screen propios, con variante para modo oscuro.

---

## Estructura de carpetas

```
testing-app/
├── App.tsx                          Proveedores de contexto y NavigationContainer
├── app.json                         Configuración de Expo: ícono, splash y plugins
├── assets/                          Ícono, splash (claro y oscuro) y favicon
└── src/
    ├── components/                  Componentes reutilizables
    │   ├── CampoTexto.tsx             Campo de formulario con etiqueta y error
    │   ├── CategoriaChip.tsx          Chip seleccionable
    │   ├── EstadoVacio.tsx            Mensaje de lista vacía
    │   ├── ImagenReceta.tsx           Imagen con marcador de posición
    │   └── RecetaCard.tsx             Tarjeta de receta
    ├── context/                     Estado compartido (React Context)
    │   ├── FavoritosContext.tsx       IDs favoritos
    │   ├── PlanComidasContext.tsx     Plan semanal
    │   ├── RecetasContext.tsx         Catálogo + recetas propias
    │   └── TemaContext.tsx            Preferencia de tema
    ├── data/
    │   └── recetas.ts                 Dataset de ejemplo (15 recetas)
    ├── navigation/
    │   ├── StackRecetas.tsx           Stack compartido por las pestañas de recetas
    │   ├── InicioStackNavigator.tsx
    │   ├── FavoritosStackNavigator.tsx
    │   ├── BuscarStackNavigator.tsx
    │   ├── PlanStackNavigator.tsx
    │   ├── TabsNavigator.tsx          Bottom Tabs
    │   ├── opciones.ts                Estilo de header según el tema
    │   └── types.ts                   Tipos de rutas y parámetros
    ├── screens/
    │   ├── InicioScreen.tsx
    │   ├── DetalleRecetaScreen.tsx
    │   ├── FavoritosScreen.tsx
    │   ├── BuscarScreen.tsx
    │   ├── CrearRecetaScreen.tsx      Crear y editar
    │   ├── PlanComidasScreen.tsx
    │   ├── SeleccionarRecetaScreen.tsx
    │   └── AjustesScreen.tsx
    ├── theme/
    │   ├── colores.ts                 Paletas clara y oscura
    │   └── useTema.ts                 Hooks useTema() y useEstilos()
    ├── types/
    │   ├── Receta.ts
    │   └── PlanComidas.ts
    └── utils/
        ├── almacenamiento.ts          Claves y helpers de AsyncStorage
        └── texto.ts                   Normalización para la búsqueda
```

---

## Notas de implementación

- **Estado compartido con Context.** Cuatro contextos independientes (recetas, favoritos, plan y tema). Cada uno carga su información de AsyncStorage al arrancar y la vuelve a guardar en cada cambio, esperando siempre a que termine la carga inicial para no sobrescribir lo guardado con el estado vacío del primer render.
- **Validación de lo que se lee del almacenamiento.** Como `JSON.parse` devuelve `unknown`, cada contexto usa *type guards* que verifican la forma del dato. Un JSON corrupto o de una versión anterior se descarta en vez de romper la app.
- **Tema sin librerías.** Cada componente define una función `crearEstilos(colores)` y la pasa al hook `useEstilos`, que memoriza la hoja resultante. Así los estilos pueden depender del tema activo sin reconstruirse en cada render.
- **Reutilización.** `RecetaCard` se usa en Inicio, Favoritos, Buscar y el selector del plan; `CategoriaChip`, en el filtro y en el formulario; `StackRecetas`, en las tres pestañas de recetas.
