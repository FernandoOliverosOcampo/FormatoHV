import { useEffect } from 'react';
import { paises, departamentosColombia, municipiosPorDepartamento, ciudadesPrincipales, modalidadesAcademicas } from '../data/colombiaData';

const DataForm = ({ state, setState, additionalExperiencePages, setAdditionalExperiencePages }) => {
  const handleChange = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  // Función para calcular la diferencia entre dos fechas en años y meses
  const calculateExperienceTime = (startDate, endDate) => {
    if (!startDate || !endDate) return { years: 0, months: 0 };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return { years: 0, months: 0 };
    if (end < start) return { years: 0, months: 0 };
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months };
  };

  // Calcular el tiempo total de experiencia por tipo
  const getExperienceTimes = () => {
    let servidorPublicoYears = 0;
    let servidorPublicoMonths = 0;
    let privadoYears = 0;
    let privadoMonths = 0;
    
    // Número total de experiencias (4 principales + adicionales)
    const totalExperiences = 4 + additionalExperiencePages * 4;
    
    for (let i = 0; i < totalExperiences; i++) {
      const ingreso = state[`exp${i}_ingreso`];
      const retiro = state[`exp${i}_retiro`];
      const isPublica = state[`exp${i}_publica`];
      const isPrivada = state[`exp${i}_privada`];
      
      if (ingreso && retiro) {
        const time = calculateExperienceTime(ingreso, retiro);
        
        if (isPublica) {
          servidorPublicoYears += time.years;
          servidorPublicoMonths += time.months;
        } else if (isPrivada) {
          privadoYears += time.years;
          privadoMonths += time.months;
        }
      }
    }
    
    // Convertir meses excedentes a años
    servidorPublicoYears += Math.floor(servidorPublicoMonths / 12);
    servidorPublicoMonths = servidorPublicoMonths % 12;
    
    privadoYears += Math.floor(privadoMonths / 12);
    privadoMonths = privadoMonths % 12;
    
    // Incluir tiempo independiente (ingresado manualmente)
    const independienteYears = parseInt(state[`tiempoIndependienteAnos`]) || 0;
    const independienteMonths = parseInt(state[`tiempoIndependienteMeses`]) || 0;
    
    // Calcular total
    const totalYears = servidorPublicoYears + privadoYears + independienteYears;
    const totalMonths = servidorPublicoMonths + privadoMonths + independienteMonths;
    
    return {
      servidorPublico: { years: servidorPublicoYears, months: servidorPublicoMonths },
      privado: { years: privadoYears, months: privadoMonths },
      total: { 
        years: totalYears + Math.floor(totalMonths / 12), 
        months: totalMonths % 12 
      }
    };
  };


  const handleCheckbox = (field, checked, group) => {
    setState(prev => {
      const newState = { ...prev, [field]: checked };
      if (checked && group) {
        // Desmarcar otros checkboxes del mismo grupo
        Object.keys(prev).forEach(key => {
          if (key !== field && key.startsWith(group)) {
            newState[key] = false;
          }
        });
      }
      return newState;
    });
  };

  // Función auxiliar para construir fecha en formato YYYY-MM-DD desde componentes
  const buildDateValue = (year, month, day) => {
    if (year && month && day) {
      // Validar que la fecha sea válida
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === parseInt(year) && 
          date.getMonth() === parseInt(month) - 1 && 
          date.getDate() === parseInt(day)) {
        return `${year}-${month}-${day}`;
      }
    }
    return '';
  };

  // Función auxiliar para construir fecha en formato YYYY-MM desde componentes
  const buildMonthValue = (year, month) => {
    if (year && month) {
      // Validar que el mes sea válido (1-12)
      const monthNum = parseInt(month);
      if (monthNum >= 1 && monthNum <= 12) {
        return `${year}-${month}`;
      }
    }
    return '';
  };

  // Función para manejar cambio de departamento y limpiar municipio
  const handleDepartamentoChange = (deptoField, municipioField, value) => {
    handleChange(deptoField, value);
    // Limpiar el municipio cuando cambia el departamento
    handleChange(municipioField, '');
  };

  return (
    <div className="data-form">
      <h2>Formulario de Datos Personales</h2>
      
      {/* Información Personal */}
      <div className="form-section">
        <h3>Información Personal</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Entidad Receptora</label>
            <input
              type="text"
              value={state.entidadReceptora || ''}
              onChange={(e) => handleChange('entidadReceptora', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Primer Apellido</label>
            <input
              type="text"
              value={state.primerApellido || ''}
              onChange={(e) => handleChange('primerApellido', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Segundo Apellido</label>
            <input
              type="text"
              value={state.segundoApellido || ''}
              onChange={(e) => handleChange('segundoApellido', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Nombres</label>
            <input
              type="text"
              value={state.nombres || ''}
              onChange={(e) => handleChange('nombres', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Documento de Identidad */}
      <div className="form-section">
        <h3>Documento de Identidad</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Tipo de Documento</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={state.docCC || false}
                  onChange={(e) => handleCheckbox('docCC', e.target.checked, 'doc')}
                />
                C.C.
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={state.docCE || false}
                  onChange={(e) => handleCheckbox('docCE', e.target.checked, 'doc')}
                />
                C.E.
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={state.docPAS || false}
                  onChange={(e) => handleCheckbox('docPAS', e.target.checked, 'doc')}
                />
                Pasaporte
              </label>
            </div>
          </div>
          <div className="form-field">
            <label>Número de Documento</label>
            <input
              type="text"
              value={state.numDocumento || ''}
              onChange={(e) => handleChange('numDocumento', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Sexo</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={state.sexoF || false}
                  onChange={(e) => handleCheckbox('sexoF', e.target.checked, 'sexo')}
                />
                F
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={state.sexoM || false}
                  onChange={(e) => handleCheckbox('sexoM', e.target.checked, 'sexo')}
                />
                M
              </label>
            </div>
          </div>
          <div className="form-field">
            <label>Nacionalidad</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={state.nacCol || false}
                  onChange={(e) => handleCheckbox('nacCol', e.target.checked, 'nacionalidad')}
                />
                Colombiano
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={state.nacExt || false}
                  onChange={(e) => handleCheckbox('nacExt', e.target.checked, 'nacionalidad')}
                />
                Extranjero
              </label>
            </div>
          </div>
          <div className="form-field">
            <label>País de Nacionalidad</label>
            <select
              value={state.paisNacionalidad || ''}
              onChange={(e) => handleChange('paisNacionalidad', e.target.value)}
            >
              <option value="">Seleccione un país</option>
              {paises.map(pais => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Libreta Militar */}
      <div className="form-section">
        <h3>Libreta Militar</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Clase</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={state.libretaPrimera || false}
                  onChange={(e) => handleCheckbox('libretaPrimera', e.target.checked, 'libreta')}
                />
                Primera
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={state.libretaSegunda || false}
                  onChange={(e) => handleCheckbox('libretaSegunda', e.target.checked, 'libreta')}
                />
                Segunda
              </label>
            </div>
          </div>
          <div className="form-field">
            <label>Número de Distrito Militar</label>
            <input
              type="text"
              value={state.libretaNumero || ''}
              onChange={(e) => handleChange('libretaNumero', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Dirección y Distrito Militar (DM)</label>
            <input
              type="text"
              value={state.libretaDM || ''}
              onChange={(e) => handleChange('libretaDM', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Fecha y Lugar de Nacimiento */}
      <div className="form-section">
        <h3>Fecha y Lugar de Nacimiento</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              value={state.fechaNacimiento || buildDateValue(state.fechaNacAno, state.fechaNacMes, state.fechaNacDia)}
              onChange={(e) => {
                const [year, month, day] = e.target.value.split('-');
                handleChange('fechaNacDia', day);
                handleChange('fechaNacMes', month);
                handleChange('fechaNacAno', year);
                handleChange('fechaNacimiento', e.target.value);
              }}
            />
          </div>
          <div className="form-field">
            <label>País de Nacimiento</label>
            <select
              value={state.paisNac || ''}
              onChange={(e) => handleChange('paisNac', e.target.value)}
            >
              <option value="">Seleccione un país</option>
              {paises.map(pais => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Departamento de Nacimiento</label>
            <select
              value={state.deptoNac || ''}
              onChange={(e) => handleDepartamentoChange('deptoNac', 'municipioNac', e.target.value)}
            >
              <option value="">Seleccione un departamento</option>
              {departamentosColombia.map(depto => (
                <option key={depto} value={depto}>{depto}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Municipio de Nacimiento</label>
            <select
              value={state.municipioNac || ''}
              onChange={(e) => handleChange('municipioNac', e.target.value)}
              disabled={!state.deptoNac}
            >
              <option value="">Seleccione un municipio</option>
              {state.deptoNac && municipiosPorDepartamento[state.deptoNac]?.map(municipio => (
                <option key={municipio} value={municipio}>{municipio}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dirección de Correspondencia */}
      <div className="form-section">
        <h3>Dirección de Correspondencia</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Dirección</label>
            <input
              type="text"
              value={state.direccionCorresp || ''}
              onChange={(e) => handleChange('direccionCorresp', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>País</label>
            <select
              value={state.paisCorresp || ''}
              onChange={(e) => handleChange('paisCorresp', e.target.value)}
            >
              <option value="">Seleccione un país</option>
              {paises.map(pais => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Departamento</label>
            <select
              value={state.deptoCorresp || ''}
              onChange={(e) => handleDepartamentoChange('deptoCorresp', 'municipioCorresp', e.target.value)}
            >
              <option value="">Seleccione un departamento</option>
              {departamentosColombia.map(depto => (
                <option key={depto} value={depto}>{depto}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Municipio</label>
            <select
              value={state.municipioCorresp || ''}
              onChange={(e) => handleChange('municipioCorresp', e.target.value)}
              disabled={!state.deptoCorresp}
            >
              <option value="">Seleccione un municipio</option>
              {state.deptoCorresp && municipiosPorDepartamento[state.deptoCorresp]?.map(municipio => (
                <option key={municipio} value={municipio}>{municipio}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Teléfono</label>
            <input
              type="text"
              value={state.telefono || ''}
              onChange={(e) => handleChange('telefono', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={state.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Educación Básica */}
      <div className="form-section">
        <h3>Educación Básica y Media</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Último Grado Aprobado</label>
            <div className="checkbox-group">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(grado => (
                <label key={grado}>
                  <input
                    type="checkbox"
                    checked={state[`grado_${grado}`] || false}
                    onChange={(e) => handleCheckbox(`grado_${grado}`, e.target.checked, 'grado')}
                  />
                  {grado}°
                </label>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label>Título Obtenido</label>
            <input
              type="text"
              value={state.tituloObtenido || ''}
              onChange={(e) => handleChange('tituloObtenido', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Fecha de Grado</label>
            <input
              type="month"
              value={state.fechaGrado || buildMonthValue(state.fechaGradoAno, state.fechaGradoMes)}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                handleChange('fechaGradoMes', month);
                handleChange('fechaGradoAno', year);
                handleChange('fechaGrado', e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      {/* Educación Superior */}
      <div className="form-section">
        <h3>Educación Superior (5 registros principales)</h3>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="education-row">
            <h4>Estudio #{i + 1}</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Modalidad</label>
                <select
                  value={state[`es${i}_modalidad`] || ''}
                  onChange={(e) => handleChange(`es${i}_modalidad`, e.target.value)}
                >
                  <option value="">Seleccione una modalidad</option>
                  {modalidadesAcademicas.map(modalidad => (
                    <option key={modalidad} value={modalidad}>{modalidad}</option>
                  ))}
                </select>
                {state[`es${i}_modalidad`] === 'Otra' && (
                  <input
                    type="text"
                    placeholder="Especifique la modalidad"
                    value={state[`es${i}_modalidadOtra`] || ''}
                    onChange={(e) => handleChange(`es${i}_modalidadOtra`, e.target.value)}
                    style={{ marginTop: '5px' }}
                  />
                )}
              </div>
              <div className="form-field">
                <label>Semestres</label>
                <input
                  type="text"
                  value={state[`es${i}_semestres`] || ''}
                  onChange={(e) => handleChange(`es${i}_semestres`, e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Graduado</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`es${i}_gradSi`] || false}
                      onChange={(e) => handleCheckbox(`es${i}_gradSi`, e.target.checked, `es${i}_grad`)}
                    />
                    Sí
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`es${i}_gradNo`] || false}
                      onChange={(e) => handleCheckbox(`es${i}_gradNo`, e.target.checked, `es${i}_grad`)}
                    />
                    No
                  </label>
                </div>
              </div>
              <div className="form-field">
                <label>Nombre de Estudios</label>
                <input
                  type="text"
                  value={state[`es${i}_nombreEstudios`] || ''}
                  onChange={(e) => handleChange(`es${i}_nombreEstudios`, e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Terminación</label>
                <input
                  type="month"
                  value={state[`es${i}_terminacion`] || buildMonthValue(state[`es${i}_termAno`], state[`es${i}_termMes`])}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split('-');
                    handleChange(`es${i}_termMes`, month);
                    handleChange(`es${i}_termAno`, year);
                    handleChange(`es${i}_terminacion`, e.target.value);
                  }}
                />
              </div>
              <div className="form-field">
                <label>Tarjeta Profesional</label>
                <input
                  type="text"
                  value={state[`es${i}_tarjetaProfesional`] || ''}
                  onChange={(e) => handleChange(`es${i}_tarjetaProfesional`, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Idiomas */}
      <div className="form-section">
        <h3>Idiomas</h3>
        {[0, 1].map(i => (
          <div key={i} className="language-row">
            <h4>Idioma #{i + 1}</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Nombre del Idioma</label>
                <input
                  type="text"
                  value={state[`idi${i}_nombre`] || ''}
                  onChange={(e) => handleChange(`idi${i}_nombre`, e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Habla</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`idi${i}_hablaR`] || false}
                      onChange={(e) => handleCheckbox(`idi${i}_hablaR`, e.target.checked, `idi${i}_habla`)}
                    />
                    R
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`idi${i}_hablaB`] || false}
                      onChange={(e) => handleCheckbox(`idi${i}_hablaB`, e.target.checked, `idi${i}_habla`)}
                    />
                    B
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`idi${i}_hablaMB`] || false}
                      onChange={(e) => handleCheckbox(`idi${i}_hablaMB`, e.target.checked, `idi${i}_habla`)}
                    />
                    MB
                  </label>
                </div>
              </div>
              <div className="form-field">
                <label>Lee</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`idi${i}_leeR`] || false}
                      onChange={(e) => handleCheckbox(`idi${i}_leeR`, e.target.checked, `idi${i}_lee`)}
                    />
                    R
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`idi${i}_leeB`] || false}
                      onChange={(e) => handleCheckbox(`idi${i}_leeB`, e.target.checked, `idi${i}_lee`)}
                    />
                    B
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`idi${i}_leeMB`] || false}
                      onChange={(e) => handleCheckbox(`idi${i}_leeMB`, e.target.checked, `idi${i}_lee`)}
                    />
                    MB
                  </label>
                </div>
              </div>
              <div className="form-field">
                <label>Escribe</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`idi${i}_escribeR`] || false}
                      onChange={(e) => handleCheckbox(`idi${i}_escribeR`, e.target.checked, `idi${i}_escribe`)}
                    />
                    R
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`idi${i}_escribeB`] || false}
                      onChange={(e) => handleCheckbox(`idi${i}_escribeB`, e.target.checked, `idi${i}_escribe`)}
                    />
                    B
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`idi${i}_escribeMB`] || false}
                      onChange={(e) => handleCheckbox(`idi${i}_escribeMB`, e.target.checked, `idi${i}_escribe`)}
                    />
                    MB
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Experiencia Laboral */}
      <div className="form-section">
        <h3>Experiencia Laboral (4 registros principales)</h3>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="experience-row">
            <h4>Experiencia #{i + 1}</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Empresa</label>
                <input
                  type="text"
                  value={state[`exp${i}_empresa`] || ''}
                  onChange={(e) => handleChange(`exp${i}_empresa`, e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Tipo</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`exp${i}_publica`] || false}
                      onChange={(e) => handleCheckbox(`exp${i}_publica`, e.target.checked, `exp${i}_tipo`)}
                    />
                    Pública
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={state[`exp${i}_privada`] || false}
                      onChange={(e) => handleCheckbox(`exp${i}_privada`, e.target.checked, `exp${i}_tipo`)}
                    />
                    Privada
                  </label>
                </div>
              </div>
              <div className="form-field">
                <label>País</label>
                <select
                  value={state[`exp${i}_pais`] || ''}
                  onChange={(e) => handleChange(`exp${i}_pais`, e.target.value)}
                >
                  <option value="">Seleccione un país</option>
                  {paises.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Departamento</label>
                <select
                  value={state[`exp${i}_departamento`] || ''}
                  onChange={(e) => handleDepartamentoChange(`exp${i}_departamento`, `exp${i}_municipio`, e.target.value)}
                >
                  <option value="">Seleccione un departamento</option>
                  {departamentosColombia.map(depto => (
                    <option key={depto} value={depto}>{depto}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Municipio</label>
                <select
                  value={state[`exp${i}_municipio`] || ''}
                  onChange={(e) => handleChange(`exp${i}_municipio`, e.target.value)}
                  disabled={!state[`exp${i}_departamento`]}
                >
                  <option value="">Seleccione un municipio</option>
                  {state[`exp${i}_departamento`] && municipiosPorDepartamento[state[`exp${i}_departamento`]]?.map(municipio => (
                    <option key={municipio} value={municipio}>{municipio}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Correo</label>
                <input
                  type="email"
                  value={state[`exp${i}_correo`] || ''}
                  onChange={(e) => handleChange(`exp${i}_correo`, e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Teléfono</label>
                <input
                  type="text"
                  value={state[`exp${i}_telefono`] || ''}
                  onChange={(e) => handleChange(`exp${i}_telefono`, e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Fecha Ingreso</label>
                <input
                  type="date"
                  value={state[`exp${i}_ingreso`] || buildDateValue(state[`exp${i}_ingresoAno`], state[`exp${i}_ingresoMes`], state[`exp${i}_ingresoDia`])}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split('-');
                    handleChange(`exp${i}_ingresoDia`, day);
                    handleChange(`exp${i}_ingresoMes`, month);
                    handleChange(`exp${i}_ingresoAno`, year);
                    handleChange(`exp${i}_ingreso`, e.target.value);
                  }}
                />
              </div>
              <div className="form-field">
                <label>Fecha Retiro</label>
                <input
                  type="date"
                  value={state[`exp${i}_retiro`] || buildDateValue(state[`exp${i}_retiroAno`], state[`exp${i}_retiroMes`], state[`exp${i}_retiroDia`])}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split('-');
                    handleChange(`exp${i}_retiroDia`, day);
                    handleChange(`exp${i}_retiroMes`, month);
                    handleChange(`exp${i}_retiroAno`, year);
                    handleChange(`exp${i}_retiro`, e.target.value);
                  }}
                />
              </div>
              <div className="form-field">
                <label>Cargo</label>
                <input
                  type="text"
                  value={state[`exp${i}_cargo`] || ''}
                  onChange={(e) => handleChange(`exp${i}_cargo`, e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Dependencia</label>
                <input
                  type="text"
                  value={state[`exp${i}_dependencia`] || ''}
                  onChange={(e) => handleChange(`exp${i}_dependencia`, e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Dirección</label>
                <input
                  type="text"
                  value={state[`exp${i}_direccion`] || ''}
                  onChange={(e) => handleChange(`exp${i}_direccion`, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Experiencia Adicional */}
      <div className="form-section">
        <h3>Experiencia Adicional</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Número de páginas adicionales de experiencia</label>
            <input
              type="number"
              min="0"
              max="10"
              value={additionalExperiencePages || 0}
              onChange={(e) => setAdditionalExperiencePages(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        {Array.from({ length: additionalExperiencePages }).map((_, i) => {
          const baseExpIndex = 4 + i * 4; // Cada página adicional tiene 4 experiencias
          return (
            <div key={`page-${i}`} className="experience-page">
              <div className="experience-header">
                <h4>Página de Experiencia Adicional #{i + 1}</h4>
              </div>
              {[0, 1, 2, 3].map((expI) => {
                const expIndex = baseExpIndex + expI;
                return (
                  <div key={expIndex} className="experience-row">
                    <h5>Experiencia #{expIndex + 1}</h5>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Empresa</label>
                        <input
                          type="text"
                          value={state[`exp${expIndex}_empresa`] || ''}
                          onChange={(e) => handleChange(`exp${expIndex}_empresa`, e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label>Tipo</label>
                        <div className="checkbox-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={state[`exp${expIndex}_publica`] || false}
                              onChange={(e) => handleCheckbox(`exp${expIndex}_publica`, e.target.checked, `exp${expIndex}_tipo`)}
                            />
                            Pública
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={state[`exp${expIndex}_privada`] || false}
                              onChange={(e) => handleCheckbox(`exp${expIndex}_privada`, e.target.checked, `exp${expIndex}_tipo`)}
                            />
                            Privada
                          </label>
                        </div>
                      </div>
                      <div className="form-field">
                        <label>País</label>
                        <select
                          value={state[`exp${expIndex}_pais`] || ''}
                          onChange={(e) => handleChange(`exp${expIndex}_pais`, e.target.value)}
                        >
                          <option value="">Seleccione un país</option>
                          {paises.map(pais => (
                            <option key={pais} value={pais}>{pais}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-field">
                        <label>Departamento</label>
                        <select
                          value={state[`exp${expIndex}_departamento`] || ''}
                          onChange={(e) => handleDepartamentoChange(`exp${expIndex}_departamento`, `exp${expIndex}_municipio`, e.target.value)}
                        >
                          <option value="">Seleccione un departamento</option>
                          {departamentosColombia.map(depto => (
                            <option key={depto} value={depto}>{depto}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-field">
                        <label>Municipio</label>
                        <select
                          value={state[`exp${expIndex}_municipio`] || ''}
                          onChange={(e) => handleChange(`exp${expIndex}_municipio`, e.target.value)}
                          disabled={!state[`exp${expIndex}_departamento`]}
                        >
                          <option value="">Seleccione un municipio</option>
                          {state[`exp${expIndex}_departamento`] && municipiosPorDepartamento[state[`exp${expIndex}_departamento`]]?.map(municipio => (
                            <option key={municipio} value={municipio}>{municipio}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-field">
                        <label>Correo</label>
                        <input
                          type="email"
                          value={state[`exp${expIndex}_correo`] || ''}
                          onChange={(e) => handleChange(`exp${expIndex}_correo`, e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label>Teléfono</label>
                        <input
                          type="text"
                          value={state[`exp${expIndex}_telefono`] || ''}
                          onChange={(e) => handleChange(`exp${expIndex}_telefono`, e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label>Fecha Ingreso</label>
                        <input
                          type="date"
                          value={state[`exp${expIndex}_ingreso`] || buildDateValue(state[`exp${expIndex}_ingresoAno`], state[`exp${expIndex}_ingresoMes`], state[`exp${expIndex}_ingresoDia`])}
                          onChange={(e) => {
                            const [year, month, day] = e.target.value.split('-');
                            handleChange(`exp${expIndex}_ingresoDia`, day);
                            handleChange(`exp${expIndex}_ingresoMes`, month);
                            handleChange(`exp${expIndex}_ingresoAno`, year);
                            handleChange(`exp${expIndex}_ingreso`, e.target.value);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Fecha Retiro</label>
                        <input
                          type="date"
                          value={state[`exp${expIndex}_retiro`] || buildDateValue(state[`exp${expIndex}_retiroAno`], state[`exp${expIndex}_retiroMes`], state[`exp${expIndex}_retiroDia`])}
                          onChange={(e) => {
                            const [year, month, day] = e.target.value.split('-');
                            handleChange(`exp${expIndex}_retiroDia`, day);
                            handleChange(`exp${expIndex}_retiroMes`, month);
                            handleChange(`exp${expIndex}_retiroAno`, year);
                            handleChange(`exp${expIndex}_retiro`, e.target.value);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Cargo</label>
                        <input
                          type="text"
                          value={state[`exp${expIndex}_cargo`] || ''}
                          onChange={(e) => handleChange(`exp${expIndex}_cargo`, e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label>Dependencia</label>
                        <input
                          type="text"
                          value={state[`exp${expIndex}_dependencia`] || ''}
                          onChange={(e) => handleChange(`exp${expIndex}_dependencia`, e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label>Dirección</label>
                        <input
                          type="text"
                          value={state[`exp${expIndex}_direccion`] || ''}
                          onChange={(e) => handleChange(`exp${expIndex}_direccion`, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Tiempo de Experiencia */}
      <div className="form-section">
        <h3>Tiempo de Experiencia (Calculado automáticamente)</h3>
        <div className="experience-time-grid">
          <div className="experience-time-item">
            <label>Servidor</label>
            <div className="date-group compact">
              <input
                type="text"
                placeholder="Años"
                value={getExperienceTimes().servidorPublico.years.toString()}
                readOnly
                title="Calculado automáticamente"
              />
              <input
                type="text"
                placeholder="Meses"
                value={getExperienceTimes().servidorPublico.months.toString()}
                readOnly
                title="Calculado automáticamente"
              />
            </div>
          </div>
          <div className="experience-time-item">
            <label>Privado</label>
            <div className="date-group compact">
              <input
                type="text"
                placeholder="Años"
                value={getExperienceTimes().privado.years.toString()}
                readOnly
                title="Calculado automáticamente"
              />
              <input
                type="text"
                placeholder="Meses"
                value={getExperienceTimes().privado.months.toString()}
                readOnly
                title="Calculado automáticamente"
              />
            </div>
          </div>
          <div className="experience-time-item">
            <label>Independiente</label>
            <div className="date-group compact">
              <input
                type="text"
                placeholder="Años"
                value={state[`tiempoIndependienteAnos`] || ''}
                onChange={(e) => handleChange(`tiempoIndependienteAnos`, e.target.value)}
              />
              <input
                type="text"
                placeholder="Meses"
                value={state[`tiempoIndependienteMeses`] || ''}
                onChange={(e) => handleChange(`tiempoIndependienteMeses`, e.target.value)}
              />
            </div>
          </div>
          <div className="experience-time-item">
            <label>Total</label>
            <div className="date-group compact">
              <input
                type="text"
                placeholder="Años"
                value={getExperienceTimes().total.years.toString()}
                readOnly
                title="Calculado automáticamente"
              />
              <input
                type="text"
                placeholder="Meses"
                value={getExperienceTimes().total.months.toString()}
                readOnly
                title="Calculado automáticamente"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Juramento y Firma */}
      <div className="form-section">
        <h3>Juramento y Firma</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>¿Se encuentra dentro de causales de inhabilidad?</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={state.juramentoSi || false}
                  onChange={(e) => handleCheckbox('juramentoSi', e.target.checked, 'juramento')}
                />
                Sí
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={state.juramentoNo || false}
                  onChange={(e) => handleCheckbox('juramentoNo', e.target.checked, 'juramento')}
                />
                No
              </label>
            </div>
          </div>
          <div className="form-field">
            <label>Ciudad y Fecha de Diligenciamiento</label>
            <select
              value={state.ciudadFecha || ''}
              onChange={(e) => handleChange('ciudadFecha', e.target.value)}
            >
              <option value="">Seleccione una ciudad</option>
              {ciudadesPrincipales.map(ciudad => (
                <option key={ciudad} value={ciudad}>{ciudad}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Texto de Firma (opcional)</label>
            <input
              type="text"
              value={state.firmaTexto || ''}
              onChange={(e) => handleChange('firmaTexto', e.target.value)}
              placeholder="Nombre para mostrar junto a la firma"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataForm;
