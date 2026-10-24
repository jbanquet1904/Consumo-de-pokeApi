PokéDex Explorer

App móvil hecha con React Native + Expo que consume la PokéAPI. Lista Pokémon en una cuadrícula con scroll infinito, permite buscarlos por nombre o número y muestra su ficha con imagen, tipos, medidas y estadísticas base.

Cómo ejecutarla
bash
cd pokedex-explorer
npm install
npx expo start

Escanear el código QR con Expo Go (el celular y el PC deben estar en la misma red WiFi). No se usa ninguna librería HTTP: las peticiones se hacen con fetch, que viene incluido.

Funcionalidades
Cuadrícula de 2 columnas con imagen, número de 3 dígitos (#025) y nombre con mayúscula inicial.
Carga inicial de 20 Pokémon y 20 más al llegar al final de la lista (scroll infinito), con indicador de carga al final.
Búsqueda por nombre o número que ignora mayúsculas y espacios al inicio o al final.
Ficha de detalle con imagen grande, distintivos de tipo con color propio, altura en metros, peso en kilogramos y las 6 estadísticas base con barras proporcionales (máximo 255).
Estados de interfaz en cada petición: cargando, error con botón "Reintentar", sin resultados y éxito.
Estructura de carpetas
pokedex-explorer/
├── App.js                      Punto de entrada: decide si se ve la lista o la ficha
└── src/
    ├── services/
    │   └── pokeApi.js          Todas las peticiones a la PokéAPI
    ├── hooks/
    │   ├── usePokemonList.js   Estado de la lista y scroll infinito
    │   ├── usePokemonDetail.js Estado de la ficha de un Pokémon
    │   └── usePokemonSearch.js Estado de la búsqueda
    ├── screens/
    │   ├── ListScreen.js       Vista de lista: título, buscador y cuadrícula
    │   └── DetailScreen.js     Vista de detalle: ficha completa del Pokémon
    ├── components/
    │   ├── PokemonCard.js      Tarjeta de la cuadrícula
    │   ├── SearchBar.js        Campo de búsqueda y botón "Buscar"
    │   ├── TypeBadge.js        Distintivo de color por tipo
    │   ├── StatBar.js          Barra proporcional de una estadística
    │   └── StatusView.js       Vista reutilizable de cargando, error y sin resultados
    ├── theme/
    │   └── colors.js           Paleta general y colores por tipo
    └── utils/
        ├── formatters.js       Formato de datos: id desde URL, URL de imagen, #025, mayúscula
        └── translations.js     Traducción de tipos y estadísticas al español
Responsabilidad de cada capa y por qué se organizó así

La app está dividida en capas que se comunican en una sola dirección:

services  →  hooks  →  screens  →  components
(API)        (estado)  (pantallas) (piezas visuales)

services es la única capa que habla con la API. Hace el fetch, revisa response.ok antes de leer el JSON, trata el 404 como "no encontrado" y entrega los datos ya limpios (por ejemplo, altura en metros y peso en kilogramos). Si mañana cambiara la API, solo se modifica este archivo.

hooks manejan el estado de cada vista (datos, cargando, error, sin resultados) y deciden cuándo se hace cada petición, usando el array de dependencias de useEffect. Así se cumple la regla del taller: ninguna llamada a la API queda mezclada con estilos ni JSX.

screens unen hooks y componentes, y deciden qué estado mostrar. No contienen ningún fetch.

components son piezas visuales reutilizables que solo reciben datos por props y los muestran. StatusView, por ejemplo, se usa tanto en la lista como en la ficha.

theme y utils agrupan valores y funciones que usan varios archivos, para escribirlos una sola vez: los colores por tipo, el formato #025 o las traducciones al español.

Decisiones técnicas
Sin librería de navegación. El cambio entre lista y ficha se hace con un estado en App.js (selectedPokemonId). La lista nunca se desmonta y la ficha se dibuja encima de ella, así al volver se conservan los Pokémon cargados y la posición del scroll.
FlatList en la lista y ScrollView en la ficha. La lista es larga y crece sin límite, por eso usa FlatList (numColumns, keyExtractor, onEndReached). La ficha tiene pocos elementos fijos (tipos y 6 estadísticas), por eso un ScrollView con map es suficiente.
Búsqueda contra la API y no filtrando la lista. La lista solo tiene cargados algunos Pokémon; buscar en la API permite encontrar cualquiera, aunque todavía no se haya cargado.
Peticiones duplicadas. onEndReached puede dispararse varias veces seguidas; usePokemonList usa un useRef como bandera para no repetir la misma petición.
Errores en español. Si no hay internet, fetch lanza un error en inglés; el servicio lo reemplaza por un mensaje claro en español.
Endpoints usados
Endpoint	Uso
GET /pokemon?limit=20&offset={n}	Lista paginada
GET /pokemon/{nombre o id}	Ficha de un Pokémon
raw.githubusercontent.com/PokeAPI/sprites/.../official-artwork/{id}.png	Imagen de cada tarjeta sin pedir la ficha completa
Tecnologías

React Native, Expo (SDK 58), JavaScript, fetch, react-native-safe-area-context.
