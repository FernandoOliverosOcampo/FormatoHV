import { modalidadesAcademicas } from '../data/colombiaData';

const DynamicEducation = ({ education, setEducation }) => {
  const addEducation = () => {
    setEducation([
      ...education,
      {
        modalidad: '',
        modalidadOtra: '',
        semestres: '',
        graduado: 'si',
        nombreEstudios: '',
        terminacionMes: '',
        terminacionAno: '',
        tarjetaProfesional: ''
      }
    ]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  return (
    <div className="dynamic-section">
      <h3>Educación Superior Adicional</h3>
      {education.length === 0 && (
        <p style={{ color: '#5a6478', marginBottom: '10px' }}>
          No hay educación adicional. Los campos del formulario principal (5 registros) ya están incluidos.
        </p>
      )}
      {education.map((edu, index) => (
        <div key={index} className="dynamic-item">
          <div className="dynamic-item-header">
            <span className="dynamic-item-title">Estudio #{index + 6}</span>
            <button className="remove-button" onClick={() => removeEducation(index)}>
              Eliminar
            </button>
          </div>
          <div className="dynamic-item-fields">
            <div className="dynamic-item-field">
              <label>Modalidad</label>
              <select
                value={edu.modalidad}
                onChange={(e) => updateEducation(index, 'modalidad', e.target.value)}
              >
                <option value="">Seleccione una modalidad</option>
                {modalidadesAcademicas.map(modalidad => (
                  <option key={modalidad} value={modalidad}>{modalidad}</option>
                ))}
              </select>
              {edu.modalidad === 'Otra' && (
                <input
                  type="text"
                  placeholder="Especifique la modalidad"
                  value={edu.modalidadOtra || ''}
                  onChange={(e) => updateEducation(index, 'modalidadOtra', e.target.value)}
                  style={{ marginTop: '5px' }}
                />
              )}
            </div>
            <div className="dynamic-item-field">
              <label>Semestres</label>
              <input
                type="text"
                value={edu.semestres}
                onChange={(e) => updateEducation(index, 'semestres', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Graduado</label>
              <select
                value={edu.graduado}
                onChange={(e) => updateEducation(index, 'graduado', e.target.value)}
              >
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="dynamic-item-field">
              <label>Nombre de Estudios</label>
              <input
                type="text"
                value={edu.nombreEstudios}
                onChange={(e) => updateEducation(index, 'nombreEstudios', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Mes Terminación</label>
              <input
                type="text"
                value={edu.terminacionMes}
                onChange={(e) => updateEducation(index, 'terminacionMes', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Año Terminación</label>
              <input
                type="text"
                value={edu.terminacionAno}
                onChange={(e) => updateEducation(index, 'terminacionAno', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Tarjeta Profesional</label>
              <input
                type="text"
                value={edu.tarjetaProfesional}
                onChange={(e) => updateEducation(index, 'tarjetaProfesional', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button className="add-button" onClick={addEducation}>
        + Agregar Estudio
      </button>
    </div>
  );
};

export default DynamicEducation;
