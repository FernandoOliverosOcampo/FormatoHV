# Instrucciones para Convertir PDF a JPG

Para que la aplicación funcione correctamente, necesitas convertir el archivo PDF del formulario a imágenes JPG. Esto garantiza que los campos se alineen perfectamente.

## Opción 1: Usar un Convertidor Online (Más Fácil)

1. Ve a un sitio de conversión de PDF a JPG como:
   - https://www.ilovepdf.com/pdf_to_jpg
   - https://smallpdf.com/pdf-to-jpg
   - https://pdf2jpg.net/

2. Sube el archivo `formato-unico-de-hoja-de-vida-persona-natural.pdf` que está en la carpeta `public/`

3. Conviértelo a JPG (asegúrate de que sea de alta calidad)

4. Descarga las 3 páginas y renómbralas así:
   - Página 1 → `page1.jpg`
   - Página 2 → `page2.jpg`
   - Página 3 → `page3.jpg`

5. Mueve los archivos a la carpeta `public/` de este proyecto

## Opción 2: Usar Adobe Acrobat Reader

1. Abre el PDF con Adobe Acrobat Reader
2. Ve a Archivo → Exportar → Imagen → JPG
3. Selecciona todas las páginas
4. Guarda en la carpeta `public/` con los nombres `page1.jpg`, `page2.jpg`, `page3.jpg`

## Opción 3: Usar Herramientas de Línea de Comandos (Avanzado)

Si tienes ImageMagick instalado:

```bash
cd public
convert formato-unico-de-hoja-de-vida-persona-natural.pdf page%d.jpg
```

Si tienes Python con pdf2image instalado:

```bash
cd public
python -c "from pdf2image import convert_from_path; images = convert_from_path('formato-unico-de-hoja-de-vida-persona-natural.pdf'); [f.save(f'page{i+1}.jpg') for i, f in enumerate(images)]"
```

## Verificación

Después de convertir, verifica que:
- Los archivos `page1.jpg`, `page2.jpg`, `page3.jpg` existan en la carpeta `public/`
- Las imágenes sean claras y legibles
- El tamaño de las imágenes sea aproximadamente 820px de ancho

Una vez que tengas las imágenes, la aplicación funcionará correctamente con los campos perfectamente alineados.
