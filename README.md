# Editor de Formato Único de Hoja de Vida

Herramienta local para diligenciar el Formato Único de Hoja de Vida de Persona Natural de Colombia.

## Características

- ✅ Edición directa sobre el PDF visualizado
- ✅ Guardado automático en localStorage
- ✅ Vista limpia para revisión
- ✅ Generación de PDF con datos diligenciados
- ✅ Firma digital integrada
- ✅ Campos dinámicos para experiencia laboral adicional
- ✅ Campos dinámicos para educación superior adicional
- ✅ Auto-ajuste de tamaño de texto para que quepa en los campos
- ✅ 100% local - sin servidor, sin envío de datos a internet

## Instalación

1. Asegúrate de tener Node.js instalado (versión 16 o superior)
2. Instala las dependencias:

```bash
npm install
```

## Configuración

El PDF original debe estar en la carpeta `public/` con el nombre `formato-unico-de-hoja-de-vida-persona-natural.pdf`.

Las imágenes de las páginas del PDF (convertidas a JPG) deben estar en la carpeta `public/`:
- `page1.jpg`
- `page2.jpg`
- `page3.jpg`

### Convertir PDF a imágenes

⚠️ **IMPORTANTE**: Los archivos `page1.jpg`, `page2.jpg` y `page3.jpg` son necesarios para visualizar el formulario con los campos perfectamente alineados.

Para obtener las imágenes JPG del PDF, sigue las instrucciones detalladas en [INSTRUCCIONES_JPG.md](INSTRUCCIONES_JPG.md).

Resumen rápido:
- **Opción más fácil**: Usa un convertidor online como https://www.ilovepdf.com/pdf_to_jpg
- **Opción con Adobe Acrobat**: Archivo > Exportar > Imagen > JPG
- **Opción avanzada**: Usa herramientas de línea de comandos (ImageMagick, pdf2image, etc.)

Luego coloca las imágenes resultantes en la carpeta `public/` con los nombres:
- `page1.jpg` (primera página)
- `page2.jpg` (segunda página) 
- `page3.jpg` (tercera página)

## Uso

1. Inicia el servidor de desarrollo:

```bash
npm run dev
```

2. Abre tu navegador en `http://localhost:3000`

3. **Dos modos de trabajo**:
   - **📝 Formulario**: Llena tus datos en un formulario estructurado y organizado por secciones
   - **📄 Vista PDF**: Verifica cómo se reflejan los datos en el documento original con campos perfectamente alineados

4. Diligencia el formulario:
   - Llena los campos en el formulario estructurado
   - Usa los checkboxes para las opciones de sí/no
   - Agrega experiencia laboral adicional si es necesario
   - Agrega educación superior adicional si es necesario
   - Usa el panel de firma digital para dibujar o subir tu firma

5. Descarga el PDF diligenciado con el botón "Descargar PDF"

## Construcción para producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

## Tecnologías

- React 18
- Vite
- pdf-lib
- react-signature-canvas

## Estructura del proyecto

```
editor_HV_PUBLICA/
├── public/
│   ├── formato-unico-de-hoja-de-vida-persona-natural.pdf
│   ├── page1.png
│   ├── page2.png
│   └── page3.png
├── src/
│   ├── components/
│   │   ├── SignatureCanvas.jsx
│   │   ├── DynamicExperience.jsx
│   │   └── DynamicEducation.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Notas

- Todos los datos se guardan localmente en el navegador (localStorage)
- No se envía ninguna información a servidores externos
- La herramienta funciona completamente offline después de la carga inicial
- Las imágenes de las páginas del PDF son necesarias para la visualización
- La experiencia y educación adicional se mostrarán en el formulario, pero la generación de páginas adicionales en el PDF está en desarrollo
