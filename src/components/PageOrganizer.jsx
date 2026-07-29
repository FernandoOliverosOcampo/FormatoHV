import { useState, useMemo } from 'react';

const PageOrganizer = ({ 
  isOpen, 
  onClose, 
  pdfPageOrder, 
  setPdfPageOrder, 
  additionalExperiencePages,
  setAdditionalExperiencePages
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Crear lista de páginas para mostrar
  const allPages = useMemo(() => {
    return pdfPageOrder.map((page, i) => {
      if (page.type === 'main') {
        return {
          id: `main-${page.index}`,
          type: 'main',
          index: page.index,
          label: `Página ${page.index + 1}`
        };
      } else {
        const expNum = pdfPageOrder.filter(p => p.type === 'experience').findIndex(p => p.index === page.index) + 1;
        return {
          id: `exp-${page.index}`,
          type: 'experience',
          index: page.index,
          label: `Experiencia Adicional #${expNum}`
        };
      }
    });
  }, [pdfPageOrder]);

  const movePage = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    console.log('movePage called:', { fromIndex, toIndex, pdfPageOrder });
    
    // Mover directamente en el array unificado
    const newOrder = [...pdfPageOrder];
    const [movedPage] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedPage);
    
    console.log('After move:', newOrder);
    
    setPdfPageOrder(newOrder);
  };

  const removePage = (index) => {
    const page = pdfPageOrder[index];
    if (page.type === 'main') {
      const mainPages = pdfPageOrder.filter(p => p.type === 'main');
      if (mainPages.length <= 1) return; // Mínimo 1 página principal
      const newOrder = pdfPageOrder.filter(p => !(p.type === 'main' && p.index === page.index));
      setPdfPageOrder(newOrder);
    } else {
      const newOrder = pdfPageOrder.filter(p => !(p.type === 'experience' && p.index === page.index));
      setAdditionalExperiencePages(newOrder.filter(p => p.type === 'experience').length);
      setPdfPageOrder(newOrder);
    }
  };

  const addExperiencePage = () => {
    const currentExpPages = pdfPageOrder.filter(p => p.type === 'experience').length;
    const newExpPage = { type: 'experience', index: currentExpPages };
    setPdfPageOrder([...pdfPageOrder, newExpPage]);
    setAdditionalExperiencePages(currentExpPages + 1);
  };

  const handleDragStart = (e, index) => {
    console.log('Drag start:', index);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    console.log('Drop:', { draggedIndex, toIndex });
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      movePage(draggedIndex, toIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    console.log('Drag end');
    setDraggedIndex(null);
  };

  if (!isOpen) return null;

  return (
    <div className="page-organizer-overlay">
      <div className="page-organizer-modal">
        <div className="page-organizer-header">
          <h2>Organizar Páginas del PDF</h2>
          <button className="btn ghost" onClick={onClose}>✕</button>
        </div>
        <div className="page-organizer-content">
          <div className="pages-grid">
            {allPages.map((page, index) => (
              <div
                key={page.id}
                className={`page-thumbnail ${draggedIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                style={{ cursor: 'move' }}
              >
                <div className="thumbnail-image" style={{ pointerEvents: 'none' }}>
                  {page.type === 'main' ? (
                    <img 
                      src={`/page${page.index + 1}.jpg`}
                      alt={page.label}
                      onError={(e) => { e.target.src = `/page${page.index + 1}.png`; }}
                    />
                  ) : (
                    <img 
                      src="/page2.jpg"
                      alt={page.label}
                      onError={(e) => { e.target.src = '/page2.png'; }}
                    />
                  )}
                </div>
                <div className="thumbnail-label" style={{ pointerEvents: 'none' }}>
                  <span>{page.label}</span>
                  <button 
                    className="btn delete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removePage(index);
                    }}
                    disabled={page.type === 'main' && pdfPageOrder.filter(p => p.type === 'main').length <= 1}
                    style={{ pointerEvents: 'auto' }}
                  >
                    🗑️
                  </button>
                </div>
                <div className="thumbnail-controls" style={{ pointerEvents: 'none' }}>
                  <button 
                    className="btn move-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Up button clicked for index:', index);
                      movePage(index, index - 1);
                    }}
                    disabled={index === 0}
                    style={{ pointerEvents: 'auto' }}
                  >
                    ↑
                  </button>
                  <button 
                    className="btn move-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Down button clicked for index:', index);
                      movePage(index, index + 1);
                    }}
                    disabled={index === allPages.length - 1}
                    style={{ pointerEvents: 'auto' }}
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="page-organizer-footer">
            <div className="add-buttons">
              <button className="btn ghost" onClick={addExperiencePage}>
                + Página de Experiencia
              </button>
            </div>
            <div className="footer-actions">
              <p>Arrastra las páginas para reordenarlas o usa los botones ↑↓</p>
              <button className="btn primary" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageOrganizer;
