# Preguntas de reflexión

_Escribe tus respuestas debajo de cada pregunta._

**Alumno:** Mikel

---

## Paso 1 · Explorando la API

| Pregunta | Mi respuesta |
|---|---|
| ¿Cuántos personajes trae cada página? | 20 (`info.count` es el total y `info.pages` cuántas páginas hay) |
| ¿Qué campo me dice si existe una página siguiente? | `info.next`: trae la URL de la siguiente página |
| ¿Qué valor tiene ese campo en la última página? | `null` |
| ¿Qué código HTTP devuelve una búsqueda sin resultados? | 404, con el cuerpo `{ "error": "There is nothing here" }` |
| ¿Qué campos del personaje usa `CharacterCard`? | `name`, `status`, `species` e `image` (el `id` lo uso yo como key de la lista) |

## Paso 2 · Petición HTTP

**¿Qué diferencia hay entre que `fetch` "falle" y que el servidor responda con un error? ¿Qué debo revisar en la respuesta?**

> `fetch` solo rechaza la promesa cuando la petición no se completa: no hay internet, falla el DNS, se cae la conexión. Si el servidor contesta, aunque sea con 404 o 500, la promesa se resuelve normal. Por eso hay que revisar `response.ok` (true solo si el código está entre 200 y 299) y `response.status` para saber qué pasó. En mi servicio, el 404 de una búsqueda lo trato como "sin resultados" y cualquier otro código que no sea ok lanza un `Error` con el código.

## Paso 3 · Estado

**¿Por qué guardo los personajes en estado y no en una variable normal?**

> Si fuera una variable normal, React no se entera cuando le asigno los personajes, entonces no vuelve a dibujar la pantalla. Además, la función del componente se vuelve a ejecutar en cada render y la variable se reiniciaría. Con `useState` el valor sobrevive entre renders, y al llamar al setter React vuelve a renderizar con los datos nuevos.

## Paso 4 · useEffect

1. **¿Qué pasa si omito por completo el arreglo de dependencias?**

> El efecto se ejecuta después de cada render. Como mi efecto actualiza estado, eso provoca otro render, que vuelve a correr el efecto, que vuelve a pedir datos... y queda un bucle infinito de peticiones.

2. **¿Qué significa dejar el arreglo vacío?**

> Que el efecto no depende de nada que pueda cambiar, entonces solo se ejecuta una vez, después del primer render (cuando la pantalla se monta). Es justo lo que quiero para la carga inicial.

3. **¿Por qué la función que recibe `useEffect` no debe ser `async` directamente?**

> Una función `async` siempre regresa una promesa, y React espera que el efecto regrese nada o una función de limpieza. Una promesa no sirve como limpieza (y React avisa con una advertencia). Por eso defino una función `async` adentro del efecto y la llamo ahí mismo.

## Paso 5 · FlatList

1. **¿Para qué sirve la prop que extrae la llave de cada elemento?**

> `keyExtractor` le da a cada elemento una llave única y estable; yo uso `String(item.id)` porque React espera texto. Con esa llave React sabe qué elemento es cuál entre renders: cuando se agregan o quitan personajes, reutiliza los que ya existen en lugar de redibujar todo, y no se mezclan los datos entre filas.

2. **¿Por qué usar `FlatList` en lugar de un `ScrollView` con `.map()`?**

> Un `ScrollView` con `.map()` dibuja todos los elementos de una vez, aunque no se vean. Con cientos de personajes con imagen eso gasta memoria y se pone lento. `FlatList` virtualiza: solo dibuja lo que está en pantalla más un margen y va reciclando conforme hago scroll. Además ya trae integrados la paginación (`onEndReached`), el pull to refresh, los separadores y la lista vacía.

## Paso 6 · Carga y error

**¿Por qué es mejor mostrar un mensaje con un botón "Reintentar" que dejar la pantalla vacía?**

> Con la pantalla vacía el usuario no sabe si está cargando, si no hay datos o si algo se rompió, y la única salida es cerrar la app. El mensaje le explica qué pasó y el botón le da una forma de recuperarse ahí mismo, por ejemplo cuando vuelve a tener internet.

## Paso 8 · Paginación

**¿Qué problema aparece si la función de "cargar más" se dispara varias veces seguidas? ¿Cómo lo evité?**

> 

## Paso 9 · Pull to refresh

**¿Por qué usé un estado distinto (`refreshing`) y no el mismo de la carga inicial?**

> 

## Paso 10 · Búsqueda

1. **¿Qué es el debounce y qué problema resuelve?**

> 

2. **¿Para qué sirve la función de limpieza (cleanup) que se devuelve en un `useEffect`? Da un ejemplo de esta práctica.**

> 

3. **Si el usuario escribe rápido y las respuestas llegan en desorden, ¿qué podría salir mal?**

> 

## Cierre

**Menciona dos mejoras que le harías a la app si tuvieras una hora más:**

> 
