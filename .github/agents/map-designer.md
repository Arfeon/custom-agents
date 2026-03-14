# map-designer (Agente)

Descripción
---
Agente que orquesta el diseño de mapas: recibe requisitos (audiencia, escala, tipo de mapa), selecciona plantillas y estilos, invoca skills (`map-style`, `map-template`, `map-render`), valida resultados y gestiona iteraciones y versiones.

Responsabilidades
---
- Interpretar requisitos y priorizar decisiones (p. ej. accesibilidad vs estética).  
- Seleccionar template y palette apropiada.  
- Llamar a `map-style.validateStyle()` y `map-style.formatForRenderer()` antes del render.  
- Orquestar el pipeline: generar → renderizar → validar → iterar → publicar.

Flujo de trabajo (pseudocódigo)
```pseudo
input = receiveRequest(requirements)
template = chooseTemplate(input)
style = map-style.loadFor(template)
validation = map-style.validateStyle(style)
if (!validation.ok) return report(validation.errors)
renderConfig = map-style.formatForRenderer(style, input.renderer)
result = callSkill('map-render', renderConfig)
if (result.failed) retryOrFallback()
saveVersion(result, style, template)
return result.artifact
```

Interfaz externa
---
- Endpoint/CLI: `design-map --spec spec.yaml --renderer mapbox --out ./build`  
- Respuestas: artefacto (imagen/tiles), reporte de validación, metadatos de versión.

Notas de implementación
---
- El agente no debe hardcodear tokens de estilo: obtiene reglas desde `map-style` skill.  
- Mantener decisiones I/O (entrada de usuario, almacenamiento) separadas de la lógica de orquestación.
