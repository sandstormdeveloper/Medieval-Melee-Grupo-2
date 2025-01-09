# Medieval Melee
### Medieval Melee es un juego que se centra en el combate entre personajes, con una temática medieval

## Integrantes
### Daniel de la Fuente Díaz, d.delafuente.2022@alumnos.urjc.es, dondanic77
### Pablo García García, p.garciag.2022@alumnos.urjc.es, sandstormdeveloper
### Guillermo Hauschild Arencibia, g.hauschild.2022@alumnos.urjc.es, ghauschild
### Hugo Orejas Peláez, h.orejas.2022@alumnos.urjc.es, kelele26

## Game Design Document (GDD)
### Introducción
Este es el documento de diseño de Medieval Melee. Es un videojuego en 2D para PC que se centra en el combate entre personajes. Su objetivo es detallar todos los elementos que conformarán el videojuego, sirviendo como una guía inicial para que los futuros colaboradores conozcan las características del proyecto.

#### -Inspiraciones
Este videojuego está inspirado en juegos de lucha casuales como Super Smash Bros y Brawlhalla, donde el objetivo es derrotar al oponente expulsandolo del escenario mediante golpes en vez de tener que disminuir su barra de vida.

#### -Concepto del juego
Medieval Melee es un videojuego de lucha en el que los jugadores controlan pequeños personajes que deben sobrevivir en un duelo a muerte contra otro jugador, que tendrá el mismo objetivo. Los personajes no sólo lucharán por conseguir la victoria, sino también por obtener el honor que conlleva triunfar en la justa.

#### -Historia del juego
En un reino lejano donde la paz ha sido rota por una disputa entre las facciones más poderosas de la región, el Rey decretó un torneo único llamado Medieval Melee. Este torneo no solo busca coronar al guerrero más hábil, sino también decidir el destino del reino.

Cada combatiente representa su facción con un único objetivo, obtener el “Estandarte del Honor”, un antiguo emblema que simboliza el derecho a gobernar y la gloria eterna.

El torneo se lleva a cabo en lugares emblemáticos del reino, como las ruinas de un majestuoso castillo, el bullicioso mercado medieval y el estratégico puerto de la ciudadela. Cada escenario, cargado de historia, se convierte en el campo de batalla donde los guerreros compiten por el honor supremo. Según la leyenda, aquel que triunfe en el torneo será considerado como un símbolo de valentía y destreza.

Las puertas del torneo se abren, y el destino de los combatientes queda en sus propias manos. Aquí no hay lugar para dudas ni vacilaciones; sólo la habilidad, la astucia y el coraje decidirán quién se alza como vencedor. Guerreros, aferrad vuestras armas, tomad vuestros puestos y luchad con todo por el honor. ¡El duelo está por comenzar!

#### -Características principales
Entre las características principales de Medieval Melee destacan las siguientes:
- Combate dinámico: es un aspecto central, fomentando enfrentamientos constantes entre los personajes, donde los jugadores deberán emplear  diferentes estrategias para derrotar a su oponente y sacarlo del escenario. 
- Partidas rápidas: las partidas tienen una duración máxima de 5 minutos, de esta forma se refuerza la dinámica del juego, centrando la atención en combates intensos y continuos. La partida termina cuando a un jugador no le quedan más vidas. 
- Mapas cerrados: están diseñados para promover dichos encuentros rápidos, obligando a los jugadores a enfrentarse y quitándoles la posibilidad de huir.
- Tácticas: el modelo de juego permite una amplia variedad de tácticas, tanto ofensivas como defensivas, brindando a los jugadores la libertad de utilizar su estrategia para alcanzar la victoria.

#### -Género
Medieval Melee es un juego de acción y lucha competitiva ambientado en un entorno medieval. El videojuego se enfoca en los enfrentamientos cuerpo a cuerpo entre los personajes. A continuación, se desglosan los subgéneros más importantes del juego.
- Arena Multiplayer: se desarrolla en mapas definidos donde los jugadores se enfrentan con armas medievales. En Medieval Melee, la narrativa tiene un papel secundario, los mapas cerrados están diseñados para fomentar los combates rápidos y estratégicos.
- Combate cuerpo a cuerpo: el combate cuerpo a cuerpo es el pilar central de Medieval Melee. Los jugadores se enfrentarán con armas medievales, tales como  espadas, hachas, dagas, lanzas y escudos, ofreciendo variedad de estilos de lucha. 
- Subgénero de lucha: Medieval Melee se enmarca dentro del subgénero de los videojuegos de lucha, inspirado en videojuegos como Super Smash Bros, Brawlhalla y Multiversus. En este tipo de juegos, para derrotar a tu oponente debes sacarlo del escenario. A diferencia de los sistemas tradicionales, no hay indicadores de vida, sino que cada jugador tiene un porcentaje de daño recibido que, cuanto más alto sea, más lejos será enviado el jugador al ser golpeado. 

#### -Estilo visual
El videojuego se presenta con un estilo visual en pixel art en 2D, lo que le da un toque retro al juego que rememora los juegos clásicos del pasado. Los personajes se verán con un aspecto detallado, pese a la simplicidad del estilo pixelado.

El estilo se inspira en juegos icónicos como Shovel Knight y The Legend of Zelda, donde los entornos son muy coloridos y los personajes están claramente definidos, lo que facilita la identificación de las características principales del personaje. 

La paleta de colores está compuesta por colores vibrantes que permiten distinguir los cascos, las armaduras y las armas. Además, los héroes cuentan con detalles en colores saturados que resaltan su presencia y centran la atención del jugador en ellos. 

#### -Plataformas
Medieval Melee se lanzará para PC, ofreciendo una experiencia de juego adaptada a los controles y características de este formato. La elección de PC se basa en la simplicidad de controles que otorga el teclado de un ordenador.

### Mecánicas
#### -Jugabilidad
Los jugadores participan en partidas rápidas de 1 contra 1, puede ser tanto en modo local como en línea. Cada jugador controla un caballero medieval que empieza sin armamento, teniendo que coger un arma para poder hacer un mayor daño al enemigo. 
- Movilidad: en cuanto a la movilidad de los jugadores, estos tendrán completa libertad de moverse por el mapa en dos dimensiones, lo que les permitirá tanto evadirse del oponente como acercarse y atacar.
- Recolección de Armas: los jugadores comienzan sin armas, obligándolos a moverse por el mapa para recoger armamento como espadas, mazos, o arcos. Cada arma otorga diferentes habilidades y estilos de ataque, la elección del arma afecta el estilo de juego, permitiendo una mayor personalización estratégica:
  - Espada: Ataques rápidos y rango corto.
  - Martillo: Ataques más lentos pero con mayor daño.
  - Arco: Ataques a distancia, ideales para mantener a raya al oponente.
  - Mazo: Ataques medios y con rango medio.
  - Bastón: Ataques rápidos y con potencia media.
- Recompensas y mejoras: los jugadores recibirán mejoras en forma de armas durante la partida para que sientan que hay un progreso. Empezarán sin armamento y a medida que avanza la partida el armamento cambiará hacia uno mejor tras recoger un arma.
- Obstáculos y plataformas: en los diferentes mapas están diseñados con obstáculos que permitirán a los jugadores ocultarse  y protegerse de los ataques del adversario como de plataformas, que permiten que los jugadores se suban a ellas para darle algo más de profundidad al combate.
- Tiempo por partida: el tiempo de partida dependerá del tiempo que un jugador pierde todas sus vidas. Cada partida tiene una duración aproximada de entre 3 y 5 minutos, favoreciendo un ritmo de partida ágil y dinámico. 

#### -Controles
Los controles de Medieval Melee son  sencillos e intuitivos, diseñados para que los jugadores puedan aprender rápidamente las mecánicas de combate.  En el modo local, el segundo jugador utilizará los controles asignados al jugador 2, mientras que en el modo en red, ambos jugadores emplearán los controles del jugador 1. A continuación, se detallan los controles correspondientes:
- Movimiento:
  - Jugador 1: W [saltar], A [izquierda], D [derecha]
  - Jugador 2: ↑ [saltar], ← [izquierda], → [derecha]
- Acciones:
  - Jugador 1: S [ataque]
  - Jugador 2: ↓ [ataque]

### Personajes
En Medieval Melee podremos utilizar distintos personajes en combate con habilidades variadas dependiendo del arma que obtengamos durante la partida. Estos son: 
- Personaje base: Al comienzo de la partida, el jugador tendrá un personaje sin armas que solo podrá asestar débiles golpes al contrincante usando sus puños. Para transformarse, deberá coger un arma del escenario  
- Cuerpo a cuerpo: Se caracterizan por utilizar distintas armas como mazas, martillos y espadas. Su rango de ataque es cercano y tiene más potencia que el personaje base. Dependiendo del arma, el personaje tendrá distintas características:
  - Caballero (Espada): Rango menor, potencia menor, velocidad de ataque alta.

    ![Figura 1](/assets/personaje1.png)
  - Rey (Maza): Rango medio, potencia media, velocidad de ataque media

    ![Figura 2](/assets/personaje2.png)
  - Paladín (Martillo): Rango medio, potencia alta, velocidad de ataque baja.

    ![Figura 3](/assets/personaje3.png)
- Mago: Utiliza un bastón y magia a distancia para atacar en una línea recta.

  ![Figura 4](/assets/personaje4.png)
- Arquero: Utiliza un arco y flechas para atacar a distancia. Su ataque es más lento pero más potente que el del     mago.

  ![Figura 5](/assets/personaje5.png)

### Escenarios
Los escenarios en Medieval Melee están diseñados para fomentar combates rápidos, intensos y estratégicos en entornos cerrados bidimensionales. Cada mapa está compuesto por varias plataformas de diferentes alturas, formas y tamaños, fomentando la movilidad vertical y los ataques desde distintos ángulos. Los mapas reflejan una ambientación medieval única que ofrece distintas oportunidades tácticas que influencian a la jugabilidad. A continuación se detallan los principales escenarios del juego:
- Castillo en ruinas: Un escenario con plataformas irregulares formadas por las ruinas de un castillo. Las plataformas son pedazos de muros colapsados y torres derrumbadas.
  
  ![Figura 6](/assets/escenario1.png)
- Mercado medieval: Un mercado medieval con plataformas en forma de carretas, techos de puestos o casas y barriles amontonados.
  
  ![Figura 7](/assets/escenario2.png)
- Puerto de la ciudadela: Las plataformas están formadas por un puerto con plataformas a distintas alturas que fomentan el movimiento vertical de este escenario.
  
  ![Figura 8](/assets/escenario3.png)

### Interfaz
#### -Diagrama de flujo
A continuación se muestra un diagrama de flujo sencillo que refleja la transición entre pantallas.

![Figura 9](/assets/diagrama.png)

#### -Menú principal
Esta es la primera pantalla que se verá al iniciar el juego. Desde este menú se podrá acceder a las siguientes opciones:
- Juego local: A través de este botón se accederá a una partida en local, en la que ambos jugadores jugaran en el mismo ordenador y usarán el mismo teclado.
- Juego en red: El juego será igual que la versión local, pero en este caso cada jugador podrá jugar desde una máquina diferente.
- Ajustes: En la pantalla de ajustes se podrán modificar ciertos aspectos básicos del juego, como el volúmen o el modo de pantalla (ventana/completa).
- Créditos: Aquí se podrán visualizar los créditos del juego, incluidas las tareas realizadas y su reparto.
- Salir: Al pulsar este botón simplemente se cerrará la aplicación.

![Figura 10](/assets/interfaz1.png)

#### -Menú de ajustes
En este menú de ajustes bastante básico, se podrá modificar el volumen del juego (de los efectos y de la música por separado) y cambiar el modo de pantalla. Además, se podrá volver al menú principal.

![Figura 11](/assets/interfaz2.png)

#### -Interfaz de juego
En partida, la interfaz consta de un icono de cada jugador en la parte inferior central de la pantalla junto a su porcentaje de daño, cuanto mayor sea este porcentaje, mayor será el impulso que reciba al ser golpeado.

![Figura 12](/assets/interfaz3.png)

#### -Interfaz de fin de juego
Al acabar la partida, el juego sacará una pantalla de victoria para el jugador vencedor con una pequeña frase. Ej.: “PLAYER 1 WINS!”.

![Figura 13](/assets/interfaz4.png)

#### -Créditos
En la pantalla de créditos se mostrarán las tareas realizadas para llevar a cabo la realización del proyecto, así como su reparto. Se tratará de una pantalla de créditos clásica, sin complicaciones.

![Figura 14](/assets/interfaz5.png)

### Audio
#### -Efectos
En el juego se incluirán efectos de sonidos para aumentar la inmersión del jugador en la temática medieval y de lucha del juego. Los sonidos ayudarán a darle más vida al juego. A parte de ser incluidos en la propia partida, también estarán presentes en las interfaces del menú principal.

#### -Música
Menú principal: la música del menú principal está en sintonía con la  ambientación medieval del videojuego, pero es relajada y suave, para no generar tensión en el jugador antes de la partida.

Partidas: dentro de las partidas, es decir, durante los combates, la música pasará a ser más animada e intensa, aumentando la sensación de acción. Los ritmos rápidos crearán una atmósfera de tensión y emoción.

## Mejoras Fase 2
En esta segunda fase de desarrollo, Medieval Melee ha dado un gran paso hacia su identidad final. Se ha implementado el modo de juego local, permitiendo a los jugadores enfrentarse cara a cara en un mismo dispositivo, lo que fomenta la competencia directa y la diversión compartida. Además, se han añadido nuevos diseños de personajes que no solo amplían la variedad visual, sino que también ofrecen una mayor diversidad en estilos de combate, dándole vida a cada guerrero. Un escenario base ha sido establecido, sirviendo como el primer campo de batalla para las épicas justas medievales. Finalmente, para complementar la experiencia, se ha integrado música tanto en el menú principal como durante las partidas, reforzando la atmósfera del juego y sumergiendo a los jugadores en la acción y la ambientación medieval. Esta fase marca un avance significativo en la construcción del mundo y las sensaciones del juego.

### Personajes
En esta segunda fase, se ha trabajado en la diferenciación de personajes para mejorar la experiencia de juego. Se han añadido tres nuevos diseños: un arquero y un caballero azul, ambos asociados al jugador 1, y un paladín, asociado al jugador 2. Esto no solo aporta variedad visual, sino que también facilita la identificación de los personajes durante el transcurso de la partida, ayudando a los jugadores a concentrarse en el combate sin confusiones. Estas incorporaciones permiten reconocer de forma inmediata quién controla a cada combatiente, reforzando la claridad y la fluidez en los enfrentamientos.
![Figura 15](/assets/personajes.png)

### Audio
En cuanto a la música del juego, se han desarrollado dos canciones instrumentales inspiradas en la música de la Edad Media, diseñadas específicamente para enriquecer la experiencia del jugador. La primera es una pieza más calmada y melódica, que ambienta el menú principal con un tono sereno y envolvente, preparando al jugador para el desafío que está por venir. La segunda, mucho más animada y rítmica, acompaña las batallas, intensificando la acción y sumergiendo a los jugadores en la adrenalina de los combates. Ambas piezas refuerzan la ambientación medieval y aportan una capa adicional de inmersión al juego.

### Escenario
Se ha diseñado un escenario base para ofrecer un entorno funcional y equilibrado en el que los jugadores puedan centrarse en la dinámica del combate. Este escenario base sirve como el campo de batalla inicial, con plataformas sencillas y una disposición que favorece la acción continua. Sin embargo, este es solo el comienzo. En futuras actualizaciones se añadirán más escenarios, cada uno con su propia apariencia y características únicas, lo que permitirá a los jugadores disfrutar de una mayor variedad de entornos y estrategias de combate. A continuación, se muestra el escenario base.

![Figura 16](/assets/escenario.png)

### Pantallas del juego
En este apartado se presentan las pantallas clave del juego. Cada pantalla está diseñada para optimizar la experiencia del jugador y facilitar la navegación durante el juego. A continuación, se muestran las imágenes de referencia correspondientes.

![Figura 27](/assets/diagrama_pantallas.png)

- Pantalla menú principal
![Figura 18](/assets/pantalla_menu2.png)
En el menú principal, el título "Medieval Melee" ocupa el centro con una fuente llamativa, mientras las opciones de "Jugar", "Créditos" y "Ajustes" están dispuestas de forma simple, invitando al jugador a entrar rápidamente en acción.

 - Pantalla in game
![Figura 19](/assets/ingame.png)
La pantalla de partida muestra a dos luchadores pixelados enfrentándose en una arena flotante con plataformas. Los indicadores de los jugadores, junto al escenario, logran un equilibrio entre claridad visual y la acción dinámica del combate.

 - Pantalla victoria 
![Figura 20](/assets/pantalla_victoria.PNG)
La pantalla de victoria celebra al ganador con un mensaje claro, "Player 1 Wins" o "Player 2 Wins", acompañado de opciones sencillas como "Volver a Jugar" y "Salir", manteniendo el enfoque en la emoción del triunfo.

  - Pantalla créditos
![Figura 21](/assets/pantalla_créditos2.png)
La pantalla de créditos destaca el título "Créditos" en letras pixeladas grandes, seguido por una lista ordenada de los desarrolladores, ofreciendo un toque sencillo y personal para reconocer al equipo detrás del juego.

## Mejoras Fase 3
En esta tercera fase de desarrollo Medieval Melee ha continuado su evolución para ofrecer una experiencia más completa y moderna. Como primera mejora, se han corregido los errores identificados en la fase anterior, garantizando una experiencia de juego más estable y fluida. Entre las principales novedades, destaca la incorporación de un sistema de chat en el juego, así como un menú de inicio de sesión antes de entrar al juego. Además, se ha incorporado un menú de ajustes que permite controlar el volumen del juego, lo que incluye la opción de ajustar el nivel de la música, tanto para aumentarlo como para reducirlo.

### Chat en el juego
Se ha implementado un sistema de chat que permite a los jugadores comunicarse entre sí. Este sistema está gestionado por tres elementos principales:

  -ChatController: Es el encargado de gestionar el funcionamiento del chat. Permite enviar mensajes a través de un método POST y recuperar los mensajes recientes utilizando un método GET. Esto asegura que los       jugadores puedan mantenerse al tanto de las conversaciones en tiempo real. 
  
  -ChatMessage: Representa los atributos de cada mensaje, como el contenido del mensaje, el autor y la marca de tiempo. Esta clase es fundamental para estructurar y organizar los datos del chat.
    
  -Escena de chat: Es la interfaz visual que muestra todos los mensajes enviados y recibidos. También incluye un campo de texto para que los jugadores puedan escribir y enviar sus propios mensajes de forma         intuitiva.
  
- Pantalla del chat:
![Figura 22](/assets/pantallachat.png)
Una interfaz sencilla y funcional que permite a los jugadores comunicarse, mostrando mensajes en texto sobre un fondo oscuro que garantiza claridad y fácil lectura.


### Menú de inicio de sesión
Se ha añadido un menú de inicio de sesión previo antes de acceder al videojuego.  El objetivo de esta funcionalidad es permitir a los usuarios acceder a la aplicación mediante la introducción de un nombre de usuario y una contraseña, validando las credenciales a través de un sistema de autenticación basado en una base de datos relacional.
En cuanto al desarrollo de esta funcionalidad, se siguieron los siguientes pasos:

Primero, se creó una clase User que representa la entidad de usuario en la base de datos. Esta clase contiene atributos como el nombre de usuario, la contraseña y el número de partidas jugadas.

Posteriormente, se implementó un repositorio (UserRepository) para acceder y consultar los datos almacenados.

La clase UserService se encarga de gestionar y coordinar las operaciones relacionadas con los usuarios. Esta clase se comunica con el repositorio para acceder y modificar los datos, aplica la lógica de negocio (como la validación de contraseñas, entre otros procesos) y actúa como un servicio en la aplicación. De esta forma, se separa la lógica de negocio del acceso directo a los datos.

Además, se implementó la clase UserController para permitir la interacción de los usuarios con la aplicación. Esta clase recibe y procesa las solicitudes relacionadas con los usuarios, llama a UserService para ejecutar la lógica de negocio y, finalmente, devuelve los resultados o gestiona los errores. Entre las operaciones que controla se encuentran la búsqueda de usuarios, el inicio de sesión, el registro de nuevos usuarios, la actualización de datos y la eliminación de usuarios.

Por otro lado, se ha desarrollado la escena de inicio de sesión y se ha implementado el formulario de inicio de sesión dentro de esta escena.

- Pantalla de inicio de sesión:
![Figura 23](/assets/pantalla_inicio_de_sesión.png)
Una interfaz clara y sencilla con campos para introducir usuario y contraseña, acompañada de dos botones destacados: Log In para acceder rápidamente y Register para crear una nueva cuenta. El diseño minimalista permite al jugador centrarse en las acciones esenciales sin distracciones.

### Menú de ajustes
En el menú de ajustes que se ha implementado, los usuarios pueden controlar el volumen de la música, permitiendo al jugador aumentar o disminuir el nivel de sonido según sus preferencias. Esta funcionalidad mejora la experiencia del usuario, otorgándole mayor control sobre los aspectos sonoros del juego para adaptarlo a sus necesidades.

- Pantalla de menú de ajustes:
![Figura 24](/assets/pantalla_menú_de_ajustes.png)
Un panel intuitivo que permite ajustar el volumen del juego, con un diseño minimalista y limpio, acompañado por el fondo medieval que mantiene la inmersión visual del jugador. Además, en esta pantalla, el jugador podrá borrar su usuario si así lo desea.

### Menú de pausa
Un menú de pausa sencillo. Permite reanudar la partida o volver al menú y abandonar la partida.

- Pantalla de menú de pausa:
![Figura 25](/assets/pausa.png)

### Diagrama de pantallas (actualizado)
![Figura 26](/assets/diagrama_pantallas2.png)
![Figura 27](/assets/diagrama_pantallas.jpg)

### Diagrama de clases y API REST
![Figura 28](/assets/diagrama_api.png)

### Instrucciones para ejecutar la aplicación
- Requisitos previos:
  - JDK: Asegúrate de tener instalada la versión Java 17 o superior.
  - Maven: Necesitas Maven instalado para gestionar las dependencias.

- Compilación del proyecto:
  - Ubícate en la raíz del proyecto donde está el archivo pom.xml.
  - Ejecuta el siguiente comando para compilar y empaquetar el proyecto --> .\mvnw.cmd package

- Ejecución de la aplicación:
  - Ejecuta el archivo .jar con el siguiente comando --> java -jar .\target\medieval_melee-0.0.1-SNAPSHOT.jar

    
## Mejoras Fase 4
En esta cuarta fase de desarrollo, Medieval Melee da un paso crucial hacia la experiencia multijugador completa al integrar la comunicación en tiempo real mediante WebSockets. Esta mejora permite que los jugadores interactúen de forma dinámica y sincronizada, manteniendo el flujo del juego en partidas en red. Además de la comunicación síncrona, se han definido mensajes clave que se intercambian entre cliente y servidor para garantizar una experiencia fluida y libre de interrupciones.
