# Instrucciones para Completar el Proyecto

## Estado Actual

El proyecto ha sido reorganizado con React + Vite y cuenta con las siguientes funcionalidades implementadas:

✅ **Completado:**
- Estructura de proyecto React + Vite
- Separación de archivos (HTML, CSS, JS)
- Sistema de campos del formulario principal
- Guardado automático en localStorage
- Vista limpia para revisión
- Componente de firma digital
- Campos dinámicos para experiencia laboral adicional
- Campos dinámicos para educación superior adicional
- Auto-ajuste básico de tamaño de texto
- Generación de PDF con pdf-lib
- Responsive design

## Pasos Pendientes para Completar

### 1. Convertir el PDF a imágenes PNG (CRÍTICO)

Los archivos `page1.png`, `page2.png` y `page3.png` en la carpeta `public/` están vacíos y deben ser reemplazados con las imágenes reales del PDF.

**Opciones para convertir:**

#### Opción A: Adobe Acrobat (Recomendada)
1. Abre el PDF con Adobe Acrobat
2. Ve a File > Export To > Image > PNG
3. Exporta cada página individualmente
4. Nombra los archivos como: `page1.png`, `page2.png`, `page3.png`
5. Colócalos en la carpeta `public/`

#### Opción B: Herramientas online
1. Visita smallpdf.com o ilovepdf.com
2. Sube el PDF
3. Conviértelo a PNG
4. Descarga cada página
5. Renombra los archivos como `page1.png`, `page2.png`, `page3.png`
6. Colócalos en la carpeta `public/`

#### Opción C: Línea de comandos (Linux/Mac)
```bash
pdftoppm -png formato-unico-de-hoja-de-vida-persona-natural.pdf page
# Esto generará page-1.png, page-2.png, page-3.png
# Renombra a page1.png, page2.png, page3.png
```

### 2. Probar la aplicación

1. Instala las dependencias (si no lo has hecho):
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:3000`

4. Verifica que:
   - Las imágenes de las páginas se muestran correctamente
   - Los campos están posicionados sobre el PDF
   - Puedes escribir en los campos
   - Los checkboxes funcionan
   - El guardado automático funciona
   - La vista limpia funciona
   - La firma digital funciona
   - Los campos dinámicos funcionan

### 3. Ajustar posición de campos (si es necesario)

Si los campos no están alineados correctamente con el PDF, puedes ajustar las coordenadas en `src/App.jsx`:

```javascript
// Busca la definición de FIELDS y ajusta las coordenadas x, y, w, h
{ id: 'nombreCampo', page: 0, x: 64, y: 179, w: 158, h: 16, type: 'text' }
```

Las coordenadas están basadas en un sistema donde:
- PAGE_W = 612 (ancho de página en puntos)
- PAGE_H = 792 (alto de página en puntos)

### 4. Implementar paginación para experiencia/educación adicional (Opcional)

Actualmente, los campos dinámicos para experiencia y educación adicional se muestran en el formulario pero no se generan páginas adicionales en el PDF.

Para implementar esto, necesitarías:

1. Crear una plantilla de página adicional en PDF
2. Modificar la función `downloadPDF` en `src/App.jsx` para:
   - Detectar si hay experiencia/educación adicional
   - Agregar nuevas páginas al PDF
   - Dibujar los campos adicionales en las nuevas páginas

### 5. Mejorar el auto-ajuste de texto (Opcional)

El auto-ajuste de texto actual es una estimación simple. Para mejorarlo:

1. Usa un canvas invisible para medir el ancho real del texto
2. Implementa un algoritmo más preciso de reducción de fuente
3. Considera wrapping de texto para campos muy largos

### 6. Construcción para producción

Cuando todo esté funcionando correctamente:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`. Puedes deployarlos a cualquier servidor estático (Netlify, Vercel, GitHub Pages, etc.).

## Archivos del Proyecto

```
editor_HV_PUBLICA/
├── public/
│   ├── formato-unico-de-hoja-de-vida-persona-natural.pdf (✅ copiado)
│   ├── page1.png (⚠️ necesita ser reemplazado)
│   ├── page2.png (⚠️ necesita ser reemplazado)
│   └── page3.png (⚠️ necesita ser reemplazado)
├── src/
│   ├── components/
│   │   ├── SignatureCanvas.jsx (✅ firma digital)
│   │   ├── DynamicExperience.jsx (✅ experiencia dinámica)
│   │   └── DynamicEducation.jsx (✅ educación dinámica)
│   ├── App.jsx (✅ componente principal)
│   ├── App.css (✅ estilos)
│   ├── main.jsx (✅ punto de entrada)
│   └── index.css (✅ estilos globales)
├── index.html (✅ HTML principal)
├── package.json (✅ dependencias)
├── vite.config.js (✅ configuración Vite)
├── README.md (✅ documentación)
├── INSTRUCCIONES.md (este archivo)
├── .gitignore (✅ archivos ignorados)
└── index_old.html (backup del archivo original)
```

## Soporte

Si encuentras algún problema:

1. Verifica que las imágenes PNG estén correctamente generadas
2. Revisa la consola del navegador para errores
3. Asegúrate de que todas las dependencias estén instaladas
4. Verifica que el PDF original esté en la carpeta `public/`

## Notas de Seguridad

- Todos los datos se guardan localmente en el navegador
- No se envía ninguna información a servidores externos
- La herramienta funciona completamente offline después de la carga inicial
- El PDF generado se crea localmente en el navegador
