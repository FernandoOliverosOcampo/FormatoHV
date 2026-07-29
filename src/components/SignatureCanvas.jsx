import { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ signature, setSignature }) => {
  const sigCanvas = useRef();
  const [mode, setMode] = useState('draw'); // 'draw' o 'upload'
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (sigCanvas.current && signature && mode === 'draw') {
      sigCanvas.current.fromDataURL(signature);
    }
    if (signature && mode === 'upload') {
      setPreviewImage(signature);
    }
  }, [signature, mode]);

  const clear = () => {
    if (mode === 'draw') {
      sigCanvas.current.clear();
    }
    setSignature(null);
    setPreviewImage(null);
  };

  const save = () => {
    if (mode === 'draw') {
      setSignature(sigCanvas.current.toDataURL());
    } else {
      setSignature(previewImage);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="signature-container">
      <h3>Firma Digital</h3>
      
      <div className="signature-mode-toggle">
        <button 
          className={mode === 'draw' ? 'btn primary' : 'btn ghost'}
          onClick={() => setMode('draw')}
          style={{ marginRight: '10px' }}
        >
          ✏️ Dibujar
        </button>
        <button 
          className={mode === 'upload' ? 'btn primary' : 'btn ghost'}
          onClick={() => setMode('upload')}
        >
          📤 Subir Imagen
        </button>
      </div>

      {mode === 'draw' ? (
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'signature-canvas',
            width: 400,
            height: 150
          }}
        />
      ) : (
        <div className="signature-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginBottom: '10px' }}
          />
          {previewImage && (
            <img 
              src={previewImage} 
              alt="Vista previa de firma" 
              style={{ 
                maxWidth: '400px', 
                maxHeight: '150px',
                border: '2px dashed #ced4da',
                borderRadius: '4px'
              }}
            />
          )}
          {!previewImage && (
            <div style={{ 
              padding: '40px', 
              border: '2px dashed #ced4da', 
              borderRadius: '4px',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              Sube una imagen de tu firma (PNG, JPG)
            </div>
          )}
        </div>
      )}

      <div className="signature-controls">
        <button className="btn danger" onClick={clear}>Limpiar</button>
        <button className="btn primary" onClick={save}>Guardar Firma</button>
      </div>
    </div>
  );
};

export default SignaturePad;
