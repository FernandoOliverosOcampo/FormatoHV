import { useState, useEffect, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import SignaturePad from './components/SignatureCanvas';
import DataForm from './components/DataForm';
import PageOrganizer from './components/PageOrganizer';
import './App.css';

// Configurar PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PAGE_W = 612, PAGE_H = 792;

function App() {
  const [state, setState] = useState({});
  const [cleanView, setCleanView] = useState(false);
  const [status, setStatus] = useState('');
  const [signature, setSignature] = useState(null);
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' o 'form'
  const [numPages, setNumPages] = useState(null);
  const [pdfImages, setPdfImages] = useState({}); // Imágenes generadas del PDF
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [additionalExperiencePages, setAdditionalExperiencePages] = useState(0); // Número de páginas adicionales de experiencia
  const [pdfPageOrder, setPdfPageOrder] = useState([{ type: 'main', index: 0 }, { type: 'main', index: 1 }, { type: 'main', index: 2 }]); // Orden unificado de todas las páginas (principales y experiencia)
  const [isPageOrganizerOpen, setIsPageOrganizerOpen] = useState(false); // Modal de organización de páginas
  
  const pagesRef = useRef([]);
  const elementsRef = useRef({});

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Función para renderizar página de PDF a imagen
  const renderPageToImage = async (pdf, pageNumber) => {
    const page = await pdf.getPage(pageNumber);
    const scale = 1.34; // Escala para coincidir con 820px de ancho (612 * 1.34 ≈ 820)
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.95),
      width: viewport.width,
      height: viewport.height
    };
  };

  // Generar imágenes del PDF al cargar
  useEffect(() => {
    if (numPages) {
      const generateImages = async () => {
        setIsGeneratingImages(true);
        try {
          const loadingTask = pdfjs.getDocument('/formato-unico-de-hoja-de-vida-persona-natural.pdf');
          const pdf = await loadingTask.promise;
          
          const images = {};
          for (let i = 1; i <= numPages; i++) {
            const imageData = await renderPageToImage(pdf, i);
            images[i] = imageData;
          }
          
          setPdfImages(images);
        } catch (error) {
          console.error('Error generando imágenes:', error);
        } finally {
          setIsGeneratingImages(false);
        }
      };
      
      generateImages();
    }
  }, [numPages]);

  const STORAGE_KEY = 'formatoUnicoHV_personaNatural_v2';

  // Definición de campos
  const FIELDS = [
    // Página 1
    { id: 'entidadReceptora', page: 0, x: 441, y: 60, w: 120, h: 12, type: 'text', size: 7 },
    { id: 'primerApellido', page: 0, x: 64, y: 179, w: 158, h: 16, type: 'text' },
    { id: 'segundoApellido', page: 0, x: 230, y: 179, w: 163, h: 16, type: 'text' },
    { id: 'nombres', page: 0, x: 399, y: 179, w: 148, h: 16, type: 'text' },
    
    // Tipo documento
    { id: 'docCC', page: 0, x: 81, y: 210, w: 9, h: 9, type: 'chk', group: 'doc' },
    { id: 'docCE', page: 0, x: 112, y: 210, w: 9, h: 9, type: 'chk', group: 'doc' },
    { id: 'docPAS', page: 0, x: 147, y: 210, w: 9, h: 9, type: 'chk', group: 'doc' },
    { id: 'numDocumento', page: 0, x: 182, y: 210, w: 112, h: 14, type: 'text' },
    
    // Sexo
    { id: 'sexoF', page: 0, x: 316, y: 210, w: 9, h: 9, type: 'chk', group: 'sexo' },
    { id: 'sexoM', page: 0, x: 340, y: 210, w: 9, h: 9, type: 'chk', group: 'sexo' },
    
    // Nacionalidad
    { id: 'nacCol', page: 0, x: 383, y: 209, w: 9, h: 9, type: 'chk', group: 'nacionalidad' },
    { id: 'nacExt', page: 0, x: 455, y: 209, w: 9, h: 9, type: 'chk', group: 'nacionalidad' },
    { id: 'paisNacionalidad', page: 0, x: 480, y: 205, w: 68, h: 14, type: 'text', size: 7 },
    
    // Libreta militar
    { id: 'libretaPrimera', page: 0, x: 145, y: 240, w: 9, h: 9, type: 'chk', group: 'libreta' },
    { id: 'libretaSegunda', page: 0, x: 260, y: 240, w: 9, h: 9, type: 'chk', group: 'libreta' },
    { id: 'libretaNumero', page: 0, x: 336, y: 236, w: 135, h: 14, type: 'text' },
    { id: 'libretaDM', page: 0, x: 495, y: 236, w: 58, h: 14, type: 'text' },
    
    // Fecha nacimiento
    { id: 'fechaNacDia', page: 0, x: 133, y: 275, w: 25, h: 14, type: 'text', align: 'center' },
    { id: 'fechaNacMes', page: 0, x: 183, y: 275, w: 25, h: 14, type: 'text', align: 'center' },
    { id: 'fechaNacAno', page: 0, x: 235, y: 275, w: 35, h: 14, type: 'text', align: 'center' },
    
    // Lugar nacimiento
    { id: 'paisNac', page: 0, x: 112, y: 293, w: 155, h: 14, type: 'text' },
    { id: 'deptoNac', page: 0, x: 112, y: 310, w: 155, h: 14, type: 'text' },
    { id: 'municipioNac', page: 0, x: 112, y: 327, w: 155, h: 14, type: 'text' },
    
    // Dirección correspondencia
    { id: 'direccionCorresp', page: 0, x: 291, y: 270, w: 258, h: 14, type: 'text' },
    { id: 'paisCorresp', page: 0, x: 315, y: 293, w: 122, h: 14, type: 'text' },
    { id: 'deptoCorresp', page: 0, x: 473, y: 293, w: 76, h: 14, type: 'text' },
    { id: 'municipioCorresp', page: 0, x: 342, y: 309, w: 212, h: 14, type: 'text' },
    { id: 'telefono', page: 0, x: 342, y: 327, w: 96, h: 14, type: 'text' },
    { id: 'email', page: 0, x: 465, y: 327, w: 105, h: 14, type: 'text', size: 8 },
    
    // Grados educación básica
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g, i) => ({
      id: `grado_${g}`,
      page: 0,
      x: [106, 122.8, 140.3, 157.3, 173.8, 191, 208.1, 225, 242, 259, 276][i] - 4,
      y: 464,
      w: 9,
      h: 9,
      type: 'chk',
      group: 'grado'
    })),
    
    // Título obtenido
    { id: 'tituloObtenido', page: 0, x: 356, y: 432, w: 256, h: 13, type: 'text', size: 7 },
    { id: 'fechaGradoMes', page: 0, x: 350, y: 462, w: 20, h: 13, type: 'text', align: 'center' },
    { id: 'fechaGradoAno', page: 0, x: 405, y: 462, w: 45, h: 13, type: 'text', align: 'center' },
    
    // Educación superior (5 filas)
    ...[580, 598.3, 616.6, 634.9, 653.2].map((y, i) => [
      { id: `es${i}_modalidad`, page: 0, x: 64, y: y, w: 50, h: 14, type: 'text', size: 7 },
      { id: `es${i}_semestres`, page: 0, x: 116, y: y, w: 60, h: 14, type: 'text', size: 7, align: 'center' },
      { id: `es${i}_gradSi`, page: 0, x: 187, y: y - 0, w: 8, h: 8, type: 'chk', group: `es${i}_grad` },
      { id: `es${i}_gradNo`, page: 0, x: 209, y: y - 0, w: 8, h: 8, type: 'chk', group: `es${i}_grad` },
      { id: `es${i}_nombreEstudios`, page: 0, x: 228, y: y, w: 190, h: 14, type: 'text', size: 7 },
      { id: `es${i}_termMes`, page: 0, x: 428, y: y, w: 15, h: 14, type: 'text', size: 7, align: 'center' },
      { id: `es${i}_termAno`, page: 0, x: 449, y: y, w: 48, h: 14, type: 'text', size: 7, align: 'center' },
      { id: `es${i}_tarjetaProfesional`, page: 0, x: 505, y: y, w: 62, h: 14, type: 'text', size: 6.5 }
    ]).flat(),
    
    // Idiomas (2 filas)
    ...[710, 726].map((y, i) => [
      { id: `idi${i}_nombre`, page: 0, x: 155, y: y, w: 100, h: 13, type: 'text', size: 7 },
      ...Object.entries({ habla: [306.5, 323.5, 340], lee: [357.5, 374.5, 391], escribe: [408.5, 425.5, 442.5] })
        .map(([k, xs]) => 
          ['R', 'B', 'MB'].map((lvl, li) => ({
            id: `idi${i}_${k}${lvl}`,
            page: 0,
            x: xs[li] - 4,
            y: y + 2,
            w: 8,
            h: 8,
            type: 'chk',
            group: `idi${i}_${k}`
          }))
        ).flat()
    ]).flat(),
    
    // Página 2 - Experiencia laboral (4 filas)
    ...[
      { empresa: 219.6, depto: 249.6, tel: 279.6, cargo: 309.6 },
      { empresa: 350.2, depto: 380.2, tel: 410.2, cargo: 440.2 },
      { empresa: 479.8, depto: 509.8, tel: 539.8, cargo: 569.8 },
      { empresa: 610.2, depto: 640.2, tel: 670.2, cargo: 700.2 }
    ].map((b, i) => [
      { id: `exp${i}_empresa`, page: 1, x: 65, y: b.empresa + 8, w: 258, h: 14, type: 'text', size: 7 },
      { id: `exp${i}_publica`, page: 1, x: 345, y: b.empresa + 12, w: 8, h: 8, type: 'chk', group: `exp${i}_tipo` },
      { id: `exp${i}_privada`, page: 1, x: 393, y: b.empresa + 12, w: 8, h: 8, type: 'chk', group: `exp${i}_tipo` },
      { id: `exp${i}_pais`, page: 1, x: 450, y: b.empresa + 8, w: 99, h: 14, type: 'text', size: 7 },
      { id: `exp${i}_departamento`, page: 1, x: 65, y: b.depto + 8, w: 169, h: 14, type: 'text', size: 7 },
      { id: `exp${i}_municipio`, page: 1, x: 243, y: b.depto + 8, w: 166, h: 14, type: 'text', size: 7 },
      { id: `exp${i}_correo`, page: 1, x: 418, y: b.depto + 8, w: 131, h: 14, type: 'text', size: 6.5 },
      { id: `exp${i}_telefono`, page: 1, x: 65, y: b.tel + 7, w: 165, h: 15, type: 'text', size: 7 },
      { id: `exp${i}_ingresoDia`, page: 1, x: 262, y: b.tel + 12, w: 15, h: 10, type: 'text', size: 6.5, align: 'center' },
      { id: `exp${i}_ingresoMes`, page: 1, x: 311, y: b.tel + 12, w: 16, h: 10, type: 'text', size: 6.5, align: 'center' },
      { id: `exp${i}_ingresoAno`, page: 1, x: 361, y: b.tel + 12, w: 33, h: 10, type: 'text', size: 6.5, align: 'center' },
      { id: `exp${i}_retiroDia`, page: 1, x: 429, y: b.tel + 12, w: 15, h: 10, type: 'text', size: 6.5, align: 'center' },
      { id: `exp${i}_retiroMes`, page: 1, x: 478, y: b.tel + 12, w: 16, h: 10, type: 'text', size: 6.5, align: 'center' },
      { id: `exp${i}_retiroAno`, page: 1, x: 528, y: b.tel + 12, w: 28, h: 10, type: 'text', size: 6.5, align: 'center' },
      { id: `exp${i}_cargo`, page: 1, x: 65, y: b.cargo + 9, w: 168, h: 14, type: 'text', size: 7 },
      { id: `exp${i}_dependencia`, page: 1, x: 243, y: b.cargo + 9, w: 157, h: 14, type: 'text', size: 7 },
      { id: `exp${i}_direccion`, page: 1, x: 413, y: b.cargo + 9, w: 136, h: 14, type: 'text', size: 7 }
    ]).flat(),
    
    // Página 3
    ...[['Servidor', 188.2], ['Privado', 216.2], ['Independiente', 244.2], ['Total', 272.2]].map(r => [
      { id: `tiempo${r[0]}Anos`, page: 2, x: 365, y: r[1] - 3, w: 55, h: 13, type: 'text', align: 'center' },
      { id: `tiempo${r[0]}Meses`, page: 2, x: 438, y: r[1] - 3, w: 58, h: 13, type: 'text', align: 'center' }
    ]).flat(),
    
    { id: 'juramentoSi', page: 2, x: 268, y: 365, w: 9, h: 9, type: 'chk', group: 'juramento' },
    { id: 'juramentoNo', page: 2, x: 300, y: 365, w: 9, h: 9, type: 'chk', group: 'juramento' },
    { id: 'ciudadFecha', page: 2, x: 220, y: 445, w: 326, h: 13, type: 'text', size: 8 },
    { id: 'firmaTexto', page: 2, x: 240, y: 480, w: 150, h: 16, type: 'text', size: 9, style: 'italic' }
  ];

  // Cargar estado desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setState(saved.state || {});
        setSignature(saved.signature || null);
        setAdditionalExperiencePages(saved.additionalExperiencePages || 0);
        // Migración del formato antiguo al nuevo
        if (saved.experiencePageOrder && saved.pdfPageOrder) {
          // Convertir formato antiguo a nuevo formato unificado
          const unifiedOrder = [
            ...saved.pdfPageOrder.map(idx => ({ type: 'main', index: idx })),
            ...saved.experiencePageOrder.map(idx => ({ type: 'experience', index: idx }))
          ];
          setPdfPageOrder(unifiedOrder);
        } else if (saved.pdfPageOrder) {
          // Ya está en el nuevo formato
          setPdfPageOrder(saved.pdfPageOrder);
        } else {
          // Valor por defecto
          setPdfPageOrder([{ type: 'main', index: 0 }, { type: 'main', index: 1 }, { type: 'main', index: 2 }]);
        }
      } else {
        // Primer uso - valor por defecto
        setPdfPageOrder([{ type: 'main', index: 0 }, { type: 'main', index: 1 }, { type: 'main', index: 2 }]);
      }
    } catch (e) {
      console.error('Error loading state:', e);
      setPdfPageOrder([{ type: 'main', index: 0 }, { type: 'main', index: 1 }, { type: 'main', index: 2 }]);
    }
  }, []);

  // Guardar estado en localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          state,
          signature,
          additionalExperiencePages,
          pdfPageOrder
        }));
        showStatus('Guardado ✓');
      } catch (e) {
        showStatus('No se pudo guardar');
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [state, signature, additionalExperiencePages, pdfPageOrder]);

  const showStatus = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(''), 1800);
  };

  const handleFieldChange = (fieldId, value) => {
    setState(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId, checked, group) => {
    setState(prev => {
      const newState = { ...prev, [fieldId]: checked };
      if (checked && group) {
        FIELDS.filter(f => f.group === group && f.id !== fieldId).forEach(f => {
          newState[f.id] = false;
        });
      }
      return newState;
    });
  };

  const clearForm = () => {
    if (!confirm('¿Seguro que quieres borrar todos los datos ingresados? Esta acción no se puede deshacer.')) return;
    setState({});
    setSignature(null);
    setAdditionalExperiencePages(0);
    setPdfPageOrder([{ type: 'main', index: 0 }, { type: 'main', index: 1 }, { type: 'main', index: 2 }]);
    localStorage.removeItem(STORAGE_KEY);
    showStatus('Formulario limpio');
  };

  const toggleCleanView = () => {
    setCleanView(!cleanView);
    // Aplicar clase al body para que el CSS funcione correctamente
    if (!cleanView) {
      document.body.classList.add('clean');
    } else {
      document.body.classList.remove('clean');
    }
  };

  // Función para agregar una página de experiencia al orden unificado
  const addExperiencePageToOrder = () => {
    const currentExpPages = pdfPageOrder.filter(p => p.type === 'experience').length;
    const newExpPage = { type: 'experience', index: currentExpPages };
    setPdfPageOrder([...pdfPageOrder, newExpPage]);
  };

  // Función para inicializar el orden cuando cambia el número de páginas
  useEffect(() => {
    const currentExpPages = pdfPageOrder.filter(p => p.type === 'experience').length;
    if (currentExpPages !== additionalExperiencePages && additionalExperiencePages > currentExpPages) {
      // Agregar páginas de experiencia faltantes
      const newOrder = [...pdfPageOrder];
      for (let i = currentExpPages; i < additionalExperiencePages; i++) {
        newOrder.push({ type: 'experience', index: i });
      }
      setPdfPageOrder(newOrder);
    }
  }, [additionalExperiencePages]);

  // Aplicar clase clean al body cuando cambia cleanView
  useEffect(() => {
    if (cleanView) {
      document.body.classList.add('clean');
    } else {
      document.body.classList.remove('clean');
    }
  }, [cleanView]);

  // Auto-ajuste de texto
  const adjustTextSize = (text, maxWidth, maxSize = 8, minSize = 5.5) => {
    // Estimación simple - en producción usar canvas para medir
    const avgCharWidth = maxSize * 0.6;
    const estimatedWidth = text.length * avgCharWidth;
    if (estimatedWidth <= maxWidth) return maxSize;
    const ratio = maxWidth / estimatedWidth;
    return Math.max(minSize, maxSize * ratio);
  };

  const downloadPDF = async () => {
    try {
      showStatus('Generando PDF...');
      
      // Cargar el PDF original
      const originalPdfBytes = await fetch('/formato-unico-de-hoja-de-vida-persona-natural.pdf')
        .then(res => res.arrayBuffer());
      
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // Crear un nuevo PDF para reconstruir en el orden correcto
      const newPdfDoc = await PDFDocument.create();
      const newFont = await newPdfDoc.embedFont(StandardFonts.Helvetica);
      
      // Procesar cada página en el orden unificado
      for (const page of pdfPageOrder) {
        if (page.type === 'main') {
          // Copiar página principal del PDF original
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [page.index]);
          newPdfDoc.addPage(copiedPage);
          
          const newPage = newPdfDoc.getPage(newPdfDoc.getPageCount() - 1);
          
          // Procesar campos de esta página principal
          FIELDS.filter(f => f.page === page.index).forEach(f => {
            const value = state[f.id];
            
            if (f.type === 'chk') {
              if (value) {
                const size = Math.min(f.w, f.h) * 0.85;
                newPage.drawText('X', {
                  x: f.x + (f.w - size * 0.62) / 2,
                  y: PAGE_H - (f.y + f.h) + (f.h - size) / 2 + 1,
                  size: size,
                  font: newFont,
                  color: rgb(0.05, 0.05, 0.1)
                });
              }
            } else {
              if (!value) return;
              let size = f.size || 8;
              const maxWidth = f.w - 2;
              
              const adjustedSize = adjustTextSize(value.toString(), maxWidth, size);
              size = Math.min(size, adjustedSize);
              
              let x = f.x + 1;
              if (f.align === 'center') {
                const textWidth = value.toString().length * size * 0.6;
                x = f.x + Math.max(1, (f.w - textWidth) / 2);
              }
              
              const y = PAGE_H - (f.y + f.h) + (f.h - size) / 2 + 1.5;
              newPage.drawText(value.toString(), {
                x: x,
                y: y,
                size: size,
                font: newFont,
                color: rgb(0.05, 0.05, 0.25)
              });
            }
          });
        } else {
          // Página de experiencia - copiar página 2 como plantilla
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [1]);
          newPdfDoc.addPage(copiedPage);
          
          const newPage = newPdfDoc.getPage(newPdfDoc.getPageCount() - 1);
          
          // Cada página adicional tiene 4 experiencias
          const baseExpIndex = 4 + page.index * 4;
          
          // 4 registros de experiencia por página adicional
          const experiencePositions = [
            { empresa: 219.6, depto: 249.6, tel: 279.6, cargo: 309.6 },
            { empresa: 349.8, depto: 379.8, tel: 409.8, cargo: 439.8 },
            { empresa: 479.8, depto: 509.8, tel: 539.8, cargo: 569.8 },
            { empresa: 610.2, depto: 640.2, tel: 670.2, cargo: 700.2 }
          ];
          
          experiencePositions.forEach((b, expI) => {
            const expIndex = baseExpIndex + expI;
            const fields = [
              { id: `exp${expIndex}_empresa`, x: 65, y: b.empresa + 8, w: 258 },
              { id: `exp${expIndex}_publica`, x: 345, y: b.empresa + 12, w: 8, h: 8, type: 'chk' },
              { id: `exp${expIndex}_privada`, x: 393, y: b.empresa + 12, w: 8, h: 8, type: 'chk' },
              { id: `exp${expIndex}_pais`, x: 450, y: b.empresa + 8, w: 99 },
              { id: `exp${expIndex}_departamento`, x: 65, y: b.depto + 8, w: 169 },
              { id: `exp${expIndex}_municipio`, x: 243, y: b.depto + 8, w: 166 },
              { id: `exp${expIndex}_correo`, x: 418, y: b.depto + 8, w: 131 },
              { id: `exp${expIndex}_telefono`, x: 65, y: b.tel + 7, w: 165, h: 15 },
              { id: `exp${expIndex}_ingresoDia`, x: 262, y: b.tel + 12, w: 15, h: 10 },
              { id: `exp${expIndex}_ingresoMes`, x: 311, y: b.tel + 12, w: 16, h: 10 },
              { id: `exp${expIndex}_ingresoAno`, x: 361, y: b.tel + 12, w: 33, h: 10 },
              { id: `exp${expIndex}_retiroDia`, x: 429, y: b.tel + 12, w: 15, h: 10 },
              { id: `exp${expIndex}_retiroMes`, x: 478, y: b.tel + 12, w: 16, h: 10 },
              { id: `exp${expIndex}_retiroAno`, x: 528, y: b.tel + 12, w: 28, h: 10 },
              { id: `exp${expIndex}_cargo`, x: 65, y: b.cargo + 9, w: 168 },
              { id: `exp${expIndex}_dependencia`, x: 243, y: b.cargo + 9, w: 157 },
              { id: `exp${expIndex}_direccion`, x: 413, y: b.cargo + 9, w: 136 }
            ];
            
            fields.forEach(f => {
              const value = state[f.id];
              if (value) {
                if (f.type === 'chk') {
                  if (value) {
                    const size = 8;
                    newPage.drawText('X', {
                      x: f.x,
                      y: PAGE_H - (f.y + 8) + 1,
                      size: size,
                      font: newFont,
                      color: rgb(0.05, 0.05, 0.1)
                    });
                  }
                } else {
                  let size = 7;
                  const maxWidth = f.w || 200;
                  const adjustedSize = adjustTextSize(value.toString(), maxWidth, size);
                  size = Math.min(size, adjustedSize);
                  
                  newPage.drawText(value.toString(), {
                    x: f.x,
                    y: PAGE_H - f.y,
                    size: size,
                    font: newFont,
                    color: rgb(0.05, 0.05, 0.25)
                  });
                }
              }
            });
          });
        }
      }

      // Agregar firma si existe
      if (signature) {
        // Convertir la firma de base64 a bytes
        const signatureBytes = await fetch(signature).then(res => res.arrayBuffer());
        
        // Detectar el tipo de imagen desde el data URL
        let signatureImage;
        if (signature.startsWith('data:image/png')) {
          signatureImage = await newPdfDoc.embedPng(signatureBytes);
        } else if (signature.startsWith('data:image/jpeg') || signature.startsWith('data:image/jpg')) {
          signatureImage = await newPdfDoc.embedJpg(signatureBytes);
        } else {
          // Intentar como PNG por defecto para otros formatos
          try {
            signatureImage = await newPdfDoc.embedPng(signatureBytes);
          } catch (e) {
            console.error('Error al incrustar la firma:', e);
            showStatus('Error: formato de imagen no soportado');
          }
        }
        
        if (signatureImage) {
          // Encontrar la página principal 2 (índice 2 en el PDF original)
          const signaturePageIndex = pdfPageOrder.findIndex(p => p.type === 'main' && p.index === 2);
          if (signaturePageIndex !== -1) {
            const page = newPdfDoc.getPage(signaturePageIndex);
            const { width, height } = signatureImage.scale(0.4);
            
            // Ajustar posición de la firma al campo correcto (FIRMA DEL SERVIDOR PÚBLICO O CONTRATISTA)
            page.drawImage(signatureImage, {
              x: 240,
              y: PAGE_H - 500,
              width: width,
              height: height
            });
          }
        }
      }

      const finalPdfBytes = await newPdfDoc.save();
      const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      const fileName = (state.primerApellido || 'formato') + '_' + (state.nombres || 'hoja_de_vida');
      a.href = url;
      a.download = fileName.replace(/\s+/g, '_') + '.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      showStatus('PDF descargado ✓');
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error generando el PDF: ' + err.message);
    }
  };

  return (
    <div className={cleanView ? 'clean' : ''}>
      <header>
        <h1>
          Formato Único de Hoja de Vida — Persona Natural
          <span className="sub">Herramienta local · sin conexión · tus datos nunca salen de tu computador</span>
        </h1>
        <span id="status">{status}</span>
        <button className="btn ghost" onClick={() => setViewMode(viewMode === 'pdf' ? 'form' : 'pdf')}>
          {viewMode === 'pdf' ? '📝 Formulario' : '📄 Vista PDF'}
        </button>
        {viewMode === 'pdf' && (
          <>
            <button className="btn ghost" onClick={toggleCleanView}>
              {cleanView ? '✏️ Vista de edición' : '👁️ Vista limpia'}
            </button>
            <button className="btn ghost" onClick={() => setIsPageOrganizerOpen(true)}>
              📋 Organizar Páginas
            </button>
          </>
        )}
        <button className="btn danger" onClick={clearForm}>
          🗑️ Limpiar formulario
        </button>
        <button className="btn primary" onClick={downloadPDF}>
          ⬇️ Descargar PDF
        </button>
      </header>

      <div className="layout">
        <div className="doc-area" id="docArea">
          {viewMode === 'pdf' ? (
            <div className="pdf-document">
              {isGeneratingImages && <div className="status">Generando imágenes del PDF...</div>}
              {pdfPageOrder.map((page, i) => {
                if (page.type === 'main') {
                  const pageNum = page.index + 1;
                  return (
                    <div key={`page-${page.index}-${i}`} className="page" ref={el => pagesRef.current[i] = el}>
                      <span className="tag">Página {pageNum}</span>
                      {pdfImages[pageNum] ? (
                        <img 
                          src={pdfImages[pageNum].dataUrl} 
                          alt={`Página ${pageNum}`} 
                          style={{ width: '100%', height: 'auto' }}
                        />
                      ) : (
                        <Document 
                          file="/formato-unico-de-hoja-de-vida-persona-natural.pdf"
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page 
                            pageNumber={pageNum} 
                            width={820}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </Document>
                      )}
                      {FIELDS.filter(f => f.page === page.index).map(f => (
                        <input
                          key={f.id}
                          className="field"
                          type={f.type === 'chk' ? 'checkbox' : 'text'}
                          checked={f.type === 'chk' ? state[f.id] || false : undefined}
                          value={f.type === 'text' ? state[f.id] || '' : undefined}
                          onChange={(e) => {
                            if (f.type === 'chk') {
                              handleCheckboxChange(f.id, e.target.checked, f.group);
                            } else {
                              handleFieldChange(f.id, e.target.value);
                            }
                          }}
                          style={{
                            left: `${(f.x / PAGE_W) * 100}%`,
                            top: `${(f.y / PAGE_H) * 100}%`,
                            width: `${(f.w / PAGE_W) * 100}%`,
                            height: `${(f.h / PAGE_H) * 100}%`,
                            fontSize: `${Math.max(7, (f.size || 8))}pt`,
                            textAlign: f.align || 'left',
                            fontStyle: f.style === 'italic' ? 'italic' : 'normal'
                          }}
                        />
                      ))}
                    </div>
                  );
                } else {
                  // Página de experiencia
                  const baseExpIndex = 4 + page.index * 4;
                  const expNum = pdfPageOrder.filter(p => p.type === 'experience').findIndex(p => p.index === page.index) + 1;
                  return (
                    <div key={`exp-add-${page.index}-${i}`} className="page">
                      <span className="tag">Experiencia Adicional #{expNum}</span>
                      <img 
                        src="/page2.jpg" 
                        alt={`Experiencia Adicional #${expNum}`}
                        onError={(e) => {
                          e.target.src = '/page2.png';
                        }}
                        style={{ width: '100%', height: 'auto' }}
                      />
                      {/* 4 campos de experiencia para esta página adicional */}
                      {[
                        { empresa: 219.6, depto: 249.6, tel: 279.6, cargo: 309.6 },
                        { empresa: 349.8, depto: 379.8, tel: 409.8, cargo: 439.8 },
                        { empresa: 479.8, depto: 509.8, tel: 539.8, cargo: 569.8 },
                        { empresa: 610.2, depto: 640.2, tel: 670.2, cargo: 700.2 }
                      ].map((b, expI) => {
                        const expIndex = baseExpIndex + expI;
                        return [
                          { id: `exp${expIndex}_empresa`, x: 65, y: b.empresa + 8, w: 258 },
                          { id: `exp${expIndex}_publica`, x: 345, y: b.empresa + 12, w: 8, h: 8, type: 'chk' },
                          { id: `exp${expIndex}_privada`, x: 393, y: b.empresa + 12, w: 8, h: 8, type: 'chk' },
                          { id: `exp${expIndex}_pais`, x: 450, y: b.empresa + 8, w: 99 },
                          { id: `exp${expIndex}_departamento`, x: 65, y: b.depto + 8, w: 169 },
                          { id: `exp${expIndex}_municipio`, x: 243, y: b.depto + 8, w: 166 },
                          { id: `exp${expIndex}_correo`, x: 418, y: b.depto + 8, w: 131 },
                          { id: `exp${expIndex}_telefono`, x: 65, y: b.tel + 7, w: 165, h: 15 },
                          { id: `exp${expIndex}_ingresoDia`, x: 262, y: b.tel + 12, w: 15, h: 10 },
                          { id: `exp${expIndex}_ingresoMes`, x: 311, y: b.tel + 12, w: 16, h: 10 },
                          { id: `exp${expIndex}_ingresoAno`, x: 361, y: b.tel + 12, w: 33, h: 10 },
                          { id: `exp${expIndex}_retiroDia`, x: 429, y: b.tel + 12, w: 15, h: 10 },
                          { id: `exp${expIndex}_retiroMes`, x: 478, y: b.tel + 12, w: 16, h: 10 },
                          { id: `exp${expIndex}_retiroAno`, x: 528, y: b.tel + 12, w: 28, h: 10 },
                          { id: `exp${expIndex}_cargo`, x: 65, y: b.cargo + 9, w: 168 },
                          { id: `exp${expIndex}_dependencia`, x: 243, y: b.cargo + 9, w: 157 },
                          { id: `exp${expIndex}_direccion`, x: 413, y: b.cargo + 9, w: 136 }
                        ].map(f => (
                          <input
                            key={f.id}
                            className="field"
                            type={f.type === 'chk' ? 'checkbox' : 'text'}
                            checked={f.type === 'chk' ? state[f.id] || false : undefined}
                            value={f.type === 'text' ? state[f.id] || '' : undefined}
                            onChange={(e) => {
                              if (f.type === 'chk') {
                                handleCheckboxChange(f.id, e.target.checked, f.group);
                              } else {
                                handleFieldChange(f.id, e.target.value);
                              }
                            }}
                            style={{
                              left: `${(f.x / PAGE_W) * 100}%`,
                              top: `${(f.y / PAGE_H) * 100}%`,
                              width: `${(f.w || 100) / PAGE_W * 100}%`,
                              height: `${(f.h || 14) / PAGE_H * 100}%`,
                              fontSize: `${Math.max(7, (f.size || 8))}pt`,
                              textAlign: f.align || 'left'
                            }}
                          />
                        ));
                      }).flat()}
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <DataForm 
              state={state} 
              setState={setState} 
              additionalExperiencePages={additionalExperiencePages}
              setAdditionalExperiencePages={setAdditionalExperiencePages}
            />
          )}

          {/* Sección de firma - siempre visible */}
          <SignaturePad 
            signature={signature} 
            setSignature={setSignature} 
          />
        </div>

        <PageOrganizer
          isOpen={isPageOrganizerOpen}
          onClose={() => setIsPageOrganizerOpen(false)}
          pdfPageOrder={pdfPageOrder}
          setPdfPageOrder={setPdfPageOrder}
          additionalExperiencePages={additionalExperiencePages}
          setAdditionalExperiencePages={setAdditionalExperiencePages}
        />

        <div className="sidebar">
          <h2>¿Cómo funciona?</h2>
          <ol>
            <li>Usa el botón "📝 Formulario" para llenar tus datos en un formulario estructurado.</li>
            <li>Usa el botón "📄 Vista PDF" para ver cómo se ve la información en el documento original.</li>
            <li>Tus datos se guardan automáticamente en este navegador (localStorage) — puedes cerrar y volver después.</li>
            <li>En vista PDF, usa "Vista limpia" para revisar cómo se ve sin los recuadros amarillos.</li>
            <li>Cuando esté todo listo, pulsa "Descargar PDF" para generar el documento oficial diligenciado.</li>
          </ol>
          <div className="hint">
            💡 <strong>Modo Formulario:</strong> Llena todos tus datos de forma organizada y estructurada.
          </div>
          <div className="hint">
            📄 <strong>Modo PDF:</strong> Verifica la alineación de los campos sobre el documento original.
          </div>
          <div className="hint">
            📝 Puedes agregar experiencia laboral y educación superior adicional usando los formularios al final.
          </div>
          <div className="hint">
            ✍️ Usa el panel de firma digital para dibujar o subir una imagen de tu firma.
          </div>
          <div className="warn">
            ⚠️ Todo ocurre en tu navegador. No hay servidor, no hay pagos, no se sube ningún dato a internet.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
