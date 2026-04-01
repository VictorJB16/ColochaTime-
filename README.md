# ColochaTime

Tu asistente de productividad personal — simple, rápido y 100% offline.

## Características

- **Gestión de Tareas**: Agrega, completa y elimina tareas con marca de tiempo opcional
- **Registro de Comidas**: Controla tu alimentación (Desayuno, Almuerzo, Cena, Snacks)
- **Timeline Integrado**: Vista unificada de tu día con tareas y comidas ordenadas por hora
- **Estadísticas**: Progreso del día, tareas completadas y más
- **Modo Oscuro**: Cambio automático según preferencia del sistema
- **Persistencia Permanente**: Todos los datos se guardan en tu navegador para siempre
- **100% Offline**: No necesita conexión a internet, sin backend, sin APIs

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Estructura del Proyecto

```
ColochaTime/
├── src/
│   ├── components/
│   │   ├── Header.astro      # Navegación y toggle de tema
│   │   ├── Stats.astro        # Estadísticas del día
│   │   ├── TaskManager.astro  # Gestión de tareas
│   │   ├── MealTracker.astro  # Registro de comidas
│   │   ├── Timeline.astro     # Vista integrada
│   │   └── Footer.astro       # Footer
│   ├── layouts/
│   │   └── Layout.astro       # Layout base
│   ├── pages/
│   │   └── index.astro        # Página principal
│   └── scripts/
│       └── storage.js         # Lógica de localStorage
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Persistencia de Datos

Los datos se guardan permanentemente en localStorage del navegador:
- Los datos solo se eliminan cuando tú lo decides
- Cada sección tiene su propio botón "Eliminar todos"
- No hay límite de tiempo ni auto-limpieza

## Tecnologías

- Astro 5.x
- Tailwind CSS 3.x
- JavaScript vanilla
- localStorage

---

Hecho con para productividad personal
