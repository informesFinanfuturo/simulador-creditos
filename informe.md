# Informe de Extracción de Código Fuente

## Simulador de Crédito Múltiple con Retanqueo

### Resumen de la extracción

He completado la extracción del código fuente de la aplicación web "Simulador de Crédito Múltiple con Retanqueo". A continuación, presento un resumen de los archivos extraídos y su estructura:

### Archivos extraídos

1. **index.html** - Archivo HTML principal que contiene:
   - Estructura del documento HTML
   - Estilos CSS embebidos en la etiqueta `<style>` dentro del `<head>`
   - Referencias al archivo JavaScript externo

2. **app.js** - Archivo JavaScript que contiene:
   - Clase `CreditSimulator` que maneja toda la lógica de la aplicación
   - Funciones para calcular la amortización de créditos múltiples con retanqueo
   - Gestión de eventos y manipulación del DOM
   - Validación de formularios y presentación de resultados

### Estructura de la aplicación

La aplicación es un simulador de créditos que permite:
- Configurar múltiples créditos (de 1 a 10)
- Establecer montos, intereses, plazos y puntos de retanqueo para cada crédito
- Calcular y visualizar la tabla de amortización completa
- Ver un resumen de la simulación con totales de períodos, montos e intereses

### Características técnicas

- **Tecnologías utilizadas**: HTML5, CSS3, JavaScript (ES6+)
- **Estilo de programación**: Orientado a objetos (clase CreditSimulator)
- **Diseño responsivo**: La aplicación se adapta a diferentes tamaños de pantalla
- **No se utilizan bibliotecas externas**: Todo el código es nativo, sin dependencias

### Instrucciones de uso

Para ejecutar la aplicación localmente:
1. Descargue los archivos `index.html` y `app.js`
2. Mantenga ambos archivos en el mismo directorio
3. Abra el archivo `index.html` en cualquier navegador web moderno

### Observaciones

- El CSS está embebido directamente en el archivo HTML, no hay archivos CSS externos
- No se detectaron recursos adicionales como imágenes, fuentes externas u otros archivos
- La aplicación funciona completamente de forma local sin necesidad de conexión a internet

Este informe completa la extracción solicitada del código fuente de la aplicación.
