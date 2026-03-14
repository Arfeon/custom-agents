# map-style.SKILL

Descripción
---
Skill que contiene la fuente de verdad para estilos y patrones de mapas: paletas de color, tokens, reglas de etiquetado, símbolos, validadores y ejemplos. Diseñada para ser invocada por agentes (p. ej. `map-designer`) o por procesos automatizados.

Contenido principal
---
- `meta`: nombre, versión, autor
- `colorPalettes`: objetos con tokens CSS / hex / rgba
- `labelRules`: reglas de prioridad / tamaño / visibilidad por zoom
- `symbolSet`: definiciones de símbolos (IDs, geometría, fallback)
- `validateStyle(style)`: función que valida una configuración y devuelve lista de errores/warnings
- `formatForRenderer(style, renderer)`: convierte la configuración a la forma que espera el renderer (Mapbox, Leaflet, etc.)

Ejemplo de `colorPalettes` (JSON)
```json
{
  "palettes": {
    "default": {
      "background": "#ffffff",
      "land": "#f2efe6",
      "water": "#a6cee3",
      "roadPrimary": "#ffffff",
      "roadSecondary": "#f8f4f0",
      "accent": "#ff6f61"
    }
  }
}
```

API / funciones (pseudocódigo)
```js
function validateStyle(style) {
  const errors = [];
  if (!style.palette) errors.push('palette missing');
  // reglas: contraste, token naming, required layers
  return { ok: errors.length === 0, errors };
}

function formatForRenderer(style, renderer) {
  if (renderer === 'mapbox') return mapboxFormat(style);
  if (renderer === 'leaflet') return leafletFormat(style);
}
```

Versionado y cambios
---
- Mantener `meta.version` semántico. Actualizaciones de tokens o reglas deben incrementar versión menor/patch.

Buenas prácticas
---
- Mantener paletas y tokens atómicos (nombres estables).
- Incluir ejemplos concretos (JSON + imagen de referencia).
- Separar `style` (valores) de `template` (capas/orden).

Uso desde un agente
---
- El agente consulta `map-style` para validar y formatear antes de renderizar.
- `map-style` no toma decisiones de orquestación: devuelve datos y utilidades.
