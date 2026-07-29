const DynamicExperience = ({ experiences, setExperiences }) => {
  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        empresa: '',
        tipo: 'privada',
        pais: '',
        departamento: '',
        municipio: '',
        correo: '',
        telefono: '',
        ingresoDia: '',
        ingresoMes: '',
        ingresoAno: '',
        retiroDia: '',
        retiroMes: '',
        retiroAno: '',
        cargo: '',
        dependencia: '',
        direccion: ''
      }
    ]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  return (
    <div className="dynamic-section">
      <h3>Experiencia Laboral Adicional</h3>
      {experiences.length === 0 && (
        <p style={{ color: '#5a6478', marginBottom: '10px' }}>
          No hay experiencia adicional. Los campos del formulario principal (4 registros) ya están incluidos.
        </p>
      )}
      {experiences.map((exp, index) => (
        <div key={index} className="dynamic-item">
          <div className="dynamic-item-header">
            <span className="dynamic-item-title">Experiencia #{index + 5}</span>
            <button className="remove-button" onClick={() => removeExperience(index)}>
              Eliminar
            </button>
          </div>
          <div className="dynamic-item-fields">
            <div className="dynamic-item-field">
              <label>Empresa</label>
              <input
                type="text"
                value={exp.empresa}
                onChange={(e) => updateExperience(index, 'empresa', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Tipo</label>
              <select
                value={exp.tipo}
                onChange={(e) => updateExperience(index, 'tipo', e.target.value)}
              >
                <option value="publica">Pública</option>
                <option value="privada">Privada</option>
              </select>
            </div>
            <div className="dynamic-item-field">
              <label>País</label>
              <input
                type="text"
                value={exp.pais}
                onChange={(e) => updateExperience(index, 'pais', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Departamento</label>
              <input
                type="text"
                value={exp.departamento}
                onChange={(e) => updateExperience(index, 'departamento', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Municipio</label>
              <input
                type="text"
                value={exp.municipio}
                onChange={(e) => updateExperience(index, 'municipio', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Correo</label>
              <input
                type="email"
                value={exp.correo}
                onChange={(e) => updateExperience(index, 'correo', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Teléfono</label>
              <input
                type="text"
                value={exp.telefono}
                onChange={(e) => updateExperience(index, 'telefono', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Cargo</label>
              <input
                type="text"
                value={exp.cargo}
                onChange={(e) => updateExperience(index, 'cargo', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Dependencia</label>
              <input
                type="text"
                value={exp.dependencia}
                onChange={(e) => updateExperience(index, 'dependencia', e.target.value)}
              />
            </div>
            <div className="dynamic-item-field">
              <label>Dirección</label>
              <input
                type="text"
                value={exp.direccion}
                onChange={(e) => updateExperience(index, 'direccion', e.target.value)}
              />
            </div>
          </div>
          <div className="dynamic-item-fields" style={{ marginTop: '10px' }}>
            <div className="dynamic-item-field">
              <label>Fecha Ingreso (DD/MM/AAAA)</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input
                  type="text"
                  placeholder="DD"
                  maxLength="2"
                  value={exp.ingresoDia}
                  onChange={(e) => updateExperience(index, 'ingresoDia', e.target.value)}
                  style={{ width: '50px' }}
                />
                <input
                  type="text"
                  placeholder="MM"
                  maxLength="2"
                  value={exp.ingresoMes}
                  onChange={(e) => updateExperience(index, 'ingresoMes', e.target.value)}
                  style={{ width: '50px' }}
                />
                <input
                  type="text"
                  placeholder="AAAA"
                  maxLength="4"
                  value={exp.ingresoAno}
                  onChange={(e) => updateExperience(index, 'ingresoAno', e.target.value)}
                  style={{ width: '70px' }}
                />
              </div>
            </div>
            <div className="dynamic-item-field">
              <label>Fecha Retiro (DD/MM/AAAA)</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input
                  type="text"
                  placeholder="DD"
                  maxLength="2"
                  value={exp.retiroDia}
                  onChange={(e) => updateExperience(index, 'retiroDia', e.target.value)}
                  style={{ width: '50px' }}
                />
                <input
                  type="text"
                  placeholder="MM"
                  maxLength="2"
                  value={exp.retiroMes}
                  onChange={(e) => updateExperience(index, 'retiroMes', e.target.value)}
                  style={{ width: '50px' }}
                />
                <input
                  type="text"
                  placeholder="AAAA"
                  maxLength="4"
                  value={exp.retiroAno}
                  onChange={(e) => updateExperience(index, 'retiroAno', e.target.value)}
                  style={{ width: '70px' }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className="add-button" onClick={addExperience}>
        + Agregar Experiencia
      </button>
    </div>
  );
};

export default DynamicExperience;
