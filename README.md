# LogicSim - Documentación Técnica del Proyecto

Este proyecto es un **Simulador de Circuitos Lógicos** interactivo construido con **Next.js**, **React Flow** y **Tailwind CSS**. Permite a los usuarios crear, simular y visualizar circuitos digitales básicos utilizando compuertas lógicas, interruptores y salidas visuales.

A continuación se detalla la función técnica de cada archivo principal en el proyecto.

## 📂 `app/`

### 📄 `page.tsx`
Este es el **punto de entrada principal** y el componente orquestador de la aplicación.
- **Gestión de Estado**: Mantiene el estado global de los `nodes` (nodos) y `edges` (conexiones) utilizando `useState` y los hooks de React Flow (`useReactFlow`).
- **Ciclo de Simulación**: Implementa un `useEffect` que detecta cambios en la topología (conexiones) y dispara el motor de lógica (`runSimulation`) para actualizar el estado del circuito en tiempo real.
- **Interacción**: Maneja eventos de arrastrar y soltar (`onDrop`, `onDragOver` del `Sidebar`) y clicks en nodos (`onNodeClick`) para interactuar con interruptores y botones.
- **Renderizado**: Renderiza el lienzo infinito de `<ReactFlow />`, integrando los controles, el minimapa y el fondo.

### 📄 `layout.tsx`
Define la estructura raíz de la aplicación.
- Configura los metadatos globales (título, descripción).
- Carga las fuentes (Google Fonts) y los estilos globales (`globals.css`).
- Provee el contenedor `html` y `body` base para la renderización de Next.js.

### 📄 `globals.css`
Estilos globales de la aplicación.
- Configura las directivas de **Tailwind CSS** (`@tailwind base`, etc.).
- Define variables de CSS personalizadas para colores de fondo y primer plano.

## 📂 `app/hooks/`

### 📄 `useLogicEngine.ts`
Este hook encapsula el **motor de simulación lógico**. Es el "cerebro" que calcula los valores de verdad del circuito.
- `evaluateNode(node, inputs)`: Función pura que determina la salida de un nodo basado en sus entradas.
  - **Gates (AND, OR, NOT, XOR)**: Aplica lógica booleana estándar.
  - **Fuentes (Switch, Push Button)**: Retorna el estado interno `active`.
  - **Salidas (Light, Display)**: Se activan si alguna entrada es verdadera.
- `runSimulation(nodes, edges, setNodes, setEdges)`:
  1.  **Construye el Grafo**: Crea un mapa de adyacencia y de grados de entrada para recorrer el circuito.
  2.  **Iteración**: Ejecuta un bucle (con límite de iteraciones para evitar ciclos infinitos) que propaga las señales desde las fuentes hacia las salidas. Verifica la estabilidad del circuito en cada paso.
  3.  **Actualización**: Compara el nuevo estado calculado con el anterior y actualiza los estados de React solo si hubo cambios visuales (color de cables o estado de nodos), optimizando el rendimiento.

## 📂 `app/components/`

### 📄 `CustomNodes.tsx`
Define la **apariencia y comportamiento visual** de cada tipo de nodo en el lienzo. Utiliza `memo` para optimizar el renderizado.
- **Componentes Base**: `BaseNode` provee el contenedor estandarizado con estilos y transiciones.
- **Nodos de Entrada**:
  - `SwitchNode`, `PushButtonNode`: Renderizan iconos interactivos que cambian de color según su estado.
- **Compuertas Lógicas**:
  - `GateNode` (Genérico), `AndGateNode`, `OrGateNode`, `NotGateNode`, `XorGateNode`: Renderizan imágenes o iconos representativos y configuran dinámicamente los `Handle` (puntos de conexión) de entrada y salida.
- **Nodos de Salida**:
  - `LightNode`: Simula una bombilla cambiando clases de color (amarillo/gris).
  - `DisplayNode`: Muestra texto "ON/OFF" con estilos condicionales.
- **CustomEdge**: Personaliza la renderización de los cables, permitiendo botones de eliminación sobre la línea y cambios de color dinámicos (azul para activo, gris para inactivo).

### 📄 `Sidebar.tsx` (Panel Izquierdo)
Barra lateral de herramientas que sirve como **paleta de componentes**.
- Implementa el patrón **Drag and Drop** de HTML5. Al iniciar el arrastre (`onDragStart`), transfiere el `type` del nodo al lienzo principal.
- Organiza los componentes en categorías (Inputs, Gates, Outputs) para fácil acceso.

### 📄 `PropertiesSidebar.tsx` (Panel Derecho)
Panel lateral contextual para **edición de propiedades**.
- **Reactividad**: Escucha cambios en el nodo seleccionado (`selectedNode`).
- **Edición**: Permite modificar la etiqueta (`label`) del nodo en tiempo real.
- **Visualización**: Muestra el tipo de componente y su estado actual (ON/OFF) si aplica.
- **Acciones**: Incluye el botón para eliminar el nodo seleccionado.

### 📄 `Header.tsx`
Barra de navegación superior.
- Muestra el título del proyecto ("LogicSim").
- Contiene botones de acción global (actualmente "Desafíos").

## Dependencias Clave
- **@xyflow/react**: Biblioteca central para la renderización de grafos y nodos interactivos.
- **lucide-react**: Conjunto de iconos vectoriales ligeros para la UI.
- **tailwindcss**: Framework de utilidades para el diseño visual rápido y responsivo.
