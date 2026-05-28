# Sistema de Diseño e Identidad Visual — Matchply

Este documento define las directrices visuales, tokens de diseño y principios de interfaz de usuario (UI) para la plataforma web de gestión y optimización de currículums con Inteligencia Artificial.

---

## 1. Filosofía del Diseño & Personalidad
La interfaz debe equilibrar la innovación tecnológica con una usabilidad extremadamente fluida, libre de fricciones cognitivas para un público joven.

* **Público Objetivo:** Jóvenes activos en búsqueda de empleo que demandan velocidad, estética moderna y flujos intuitivos.
* **Emoción Clave:** Fluidez, creatividad y seguridad. El usuario debe sentir que tiene el control absoluto de su marca personal mediante un lienzo limpio y dinámico.
* **Tono de Voz de la Interfaz:** Minimalista, funcional y de nueva generación (*Indie-SaaS*). Se reduce drásticamente el ruido visual, eliminando botones redundantes y priorizando el foco en la tarea actual.

---

## 2. Tokens de Diseño (Paleta de Colores)
La paleta se rige por la regla **60-30-10** para garantizar un contraste balanceado y un descanso visual óptimo en jornadas largas de edición.

### Modo Claro (Predeterminado)
* **60% Fondo / Lienzo:** `#FAFAFA` (Blanco roto neutro que mitiga el cansancio ocular).
* **30% Estructura y Texto:** `#1E1B4B` (Azul/Púrpura de medianoche profundo para textos principales, contenedores secundarios y navegación).
* **10% Acento Empleo (Crecimiento):** `#2ECC71` (Verde esmeralda para el éxito, postulaciones activas y llamadas a la acción estándar).
* **10% Especial (Inteligencia Artificial):** `#8B5CF6` (Púrpura eléctrico. **Uso exclusivo** para herramientas de optimización automatizada y destellos de IA).

### Modo Oscuro (Opcional)
* **60% Fondo / Lienzo:** `#0B0F19` (Azul oscuro abisal).
* **30% Estructura y Texto:** `#F3F4F6` / `#1F2937` (Gris claro para legibilidad de texto y gris pizarra para tarjetas).

---

## 3. Tipografía & Jerarquía
Se emplean dos familias tipográficas complementarias con fuerte rendimiento en renderizado web:

1.  **Títulos y Botones Principales:** `Plus Jakarta Sans` o `Satoshi` (Fuentes geométricas *Sans-Serif* con curvas estilizadas que transmiten vanguardia).
2.  **Cuerpo de Texto y Formularios:** `Inter` (El estándar de legibilidad en interfaces de datos. Crucial para las etiquetas compactas del Kanban y el contenido del CV).

### Escala de Tamaños (Web A4 Adaptada)
* `H1 (Títulos de sección):` 22pt / Bold
* `H2 (Tarjetas / Subsecciones):` 15pt / SemiBold
* `H3 (Etiquetas / Títulos Menores):` 12pt / Medium
* `Body / Inputs:` 10.5pt / Regular

---

## 4. Componentes e Identidad Visual

### Geometría y Contenedores
* **Tarjetas y Paneles Principales (Modulos/Kanban):** `border-radius: 12px;` con sombras suaves y difuminadas (`box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05)`).
* **Botones y Elementos de Entrada:** `border-radius: 8px;` para mantener un balance entre amabilidad y rigor técnico.

### El Botón de Optimización Inteligente
El botón para **"Optimizar con IA"** se diferencia del resto mediante un gradiente lineal sutil en su borde (`linear-gradient(to right, #8B5CF6, transparent)`) y un icono SVG lineal de destello (`sparkles`).

---

## 5. Iconografía & Micro-interacciones (SVG)
Se prohíbe la mezcla de diferentes librerías. Todo el ecosistema de iconos debe pertenecer a **Lucide Icons** o **Phosphor Icons**, configurados con un grosor de trazo estricto de `1.75px`.

### Animaciones al Pasar el Cursor (`hover` con `transition: all 0.3s ease`)
* **Icono de Currículum (Folio):** Simula el dibujado secuencial interno de sus líneas horizontales de texto.
* **Icono de IA (Destellos):** Escalado del 110% acompañado de una rotación sutil de `5deg` hacia la derecha.
* **Icono de Kanban (Columnas):** Desplazamiento animado de un nodo interactivo de la primera columna hacia la segunda.

---

## 6. Consistencia y Retícula (Sistema de Espaciado)
Toda la interfaz se alinea obligatoriamente bajo el sistema de múltiplos de **8px**.

* `Padding interior de tarjetas (CVs y Kanban):` 24px.
* `Separación entre columnas del tablero Kanban:` 32px.
* `Margen vertical entre tarjetas internas de postulación:` 16px.
* `Gaps en formularios de datos de usuario:` 16px.

---

## 7. Flujo de Estados y Carga
* **Estado de Carga IA:** Durante la llamada al LLM, la tarjeta del currículum se cubre con un velo semi-transparente púrpura (`#8B5CF6` al 5% de opacidad) con una animación de barrido de luz vertical (*shimmer effect*). Al completarse, el texto nuevo emerge mediante un *fade-in* suave.
* **Drag & Drop (Kanban):** Al arrastrar una postulación, la tarjeta rota levemente de `1 a 2 grados` simulando inercia física, y la columna receptora activa un contorno suave con el color de acierto (`#2ECC71`).