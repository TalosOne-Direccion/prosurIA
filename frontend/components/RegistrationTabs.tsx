import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function RegistrationTabs() {
  const [activeTab, setActiveTab] = useState<'registro' | 'alcance'>('registro');
  
  // =========================================================================
  // URL DE GOOGLE APPS SCRIPT INTEGRADA
  // =========================================================================
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2AEEjvF-fUKop_Ai1pVshkpjcvGXE--YkmX_qHxYwqyG7dVkCq3v-thEwWSWsVp8r/exec";
  
  // Form 1 State
  const [f1Data, setF1Data] = useState({
    teamName: '',
    employeeId: '',
    company: '',
    department: '',
    members: '',
    painPoint: ''
  });
  const [f1Status, setF1Status] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Form 2 State
  const [f2Data, setF2Data] = useState({
    teamName: '',
    employeeId: '',
    projectName: '',
    diagnosis: '',
    solution: '',
    metric: ''
  });
  const [f2Status, setF2Status] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  interface RegisteredTeam {
    teamName: string;
    employeeId: string;
    company: string;
    department: string;
  }

  // Persistent registration state
  const [registeredTeams, setRegisteredTeams] = useState<RegisteredTeam[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isManualTeam, setIsManualTeam] = useState(false);

  // Load registered teams from Google Sheet (GET)
  const fetchTeamsFromSheet = async () => {
    setIsLoadingTeams(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      if (!response.ok) throw new Error("HTTP error " + response.status);
      const data = await response.json();
      if (Array.isArray(data)) {
        setRegisteredTeams(data);
        if (data.length > 0 && !isManualTeam) {
          setF2Data(prev => ({
            ...prev,
            teamName: data[0].teamName,
            employeeId: data[0].employeeId
          }));
        }
      }
    } catch (e) {
      console.error("Error al obtener equipos de Google Sheet:", e);
      // Fallback a localStorage
      const teams = localStorage.getItem('prosur_registered_teams');
      if (teams) {
        try {
          const parsed = JSON.parse(teams);
          if (Array.isArray(parsed)) {
            const mapped = parsed.map((name: string) => ({
              teamName: name,
              employeeId: '',
              company: '',
              department: ''
            }));
            setRegisteredTeams(mapped);
            if (mapped.length > 0 && !isManualTeam) {
              setF2Data(prev => ({
                ...prev,
                teamName: mapped[0].teamName,
                employeeId: ''
              }));
            }
          }
        } catch (err) {}
      }
    } finally {
      setIsLoadingTeams(false);
    }
  };

  useEffect(() => {
    fetchTeamsFromSheet();
  }, []);

  // Fetch teams again whenever the active tab changes to 'alcance'
  useEffect(() => {
    if (activeTab === 'alcance') {
      fetchTeamsFromSheet();
    }
  }, [activeTab]);

  const successRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility on success
  useEffect(() => {
    if ((f1Status === 'success' || f2Status === 'success') && successRef.current) {
      successRef.current.focus();
    }
  }, [f1Status, f2Status]);

  const handleF1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setF1Status('submitting');

    try {
      // Envío real a Google Sheets
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Necesario para evitar problemas de CORS con Google Scripts
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'registro',
          ...f1Data
        })
      });

      // Guardar el equipo registrado localmente
      const newTeamObj: RegisteredTeam = {
        teamName: f1Data.teamName.trim(),
        employeeId: f1Data.employeeId.trim(),
        company: f1Data.company,
        department: f1Data.department
      };
      
      const localTeamsString = localStorage.getItem('prosur_registered_teams');
      let localTeamsList: string[] = [];
      if (localTeamsString) {
        try {
          localTeamsList = JSON.parse(localTeamsString);
        } catch (err) {}
      }
      if (!localTeamsList.includes(newTeamObj.teamName)) {
        localTeamsList.push(newTeamObj.teamName);
        localStorage.setItem('prosur_registered_teams', JSON.stringify(localTeamsList));
      }

      setRegisteredTeams(prev => {
        const exists = prev.some(t => t.teamName.toLowerCase() === newTeamObj.teamName.toLowerCase());
        if (!exists) {
          return [...prev, newTeamObj];
        }
        return prev;
      });

      // Pre-seleccionar en Form 2
      setF2Data(prev => ({ 
        ...prev, 
        teamName: newTeamObj.teamName,
        employeeId: newTeamObj.employeeId
      }));
      setIsManualTeam(false);

      setF1Status('success');
      setF1Data({ teamName: '', employeeId: '', company: '', department: '', members: '', painPoint: '' });
      setTimeout(() => setF1Status('idle'), 8000);

    } catch (error) {
      console.error("Error al enviar:", error);
      setF1Status('error');
      setTimeout(() => setF1Status('idle'), 5000);
    }
  };

  const handleF2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setF2Status('submitting');

    try {
      // Envío real a Google Sheets
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'alcance',
          ...f2Data
        })
      });

      setF2Status('success');
      // Limpiar datos pero conservar o resetear el equipo según selección
      setF2Data({ 
        teamName: registeredTeams.length > 0 && !isManualTeam ? registeredTeams[0].teamName : '', 
        employeeId: registeredTeams.length > 0 && !isManualTeam ? registeredTeams[0].employeeId : '', 
        projectName: '', 
        diagnosis: '', 
        solution: '', 
        metric: '' 
      });
      setTimeout(() => setF2Status('idle'), 8000);

    } catch (error) {
      console.error("Error al enviar:", error);
      setF2Status('error');
      setTimeout(() => setF2Status('idle'), 5000);
    }
  };

  const handleTabChange = (tab: 'registro' | 'alcance') => {
    setActiveTab(tab);
    setF1Status('idle');
    setF2Status('idle');
  };

  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-prosur-red focus:ring-prosur-red sm:text-sm p-3 border bg-white/90 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <section id="registro" className="py-20 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Participa en el Reto</h2>
          <p className="text-lg text-prosur-gray">
            Completa tu registro inicial y posteriormente envía el alcance de tu proyecto.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabs Header */}
          <div 
            className="flex border-b border-gray-200 bg-white/50" 
            role="tablist" 
            aria-label="Formularios de participación"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'registro'}
              aria-controls="panel-registro"
              id="tab-registro"
              onClick={() => handleTabChange('registro')}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-prosur-red ${
                activeTab === 'registro' 
                  ? 'border-b-2 border-prosur-red text-prosur-red bg-red-50/50' 
                  : 'text-prosur-gray hover:text-gray-700 hover:bg-gray-50/50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                Registro Rápido
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Activo ahora
                </span>
              </span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'alcance'}
              aria-controls="panel-alcance"
              id="tab-alcance"
              onClick={() => handleTabChange('alcance')}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-prosur-red ${
                activeTab === 'alcance' 
                  ? 'border-b-2 border-prosur-red text-prosur-red bg-red-50/50' 
                  : 'text-prosur-gray hover:text-gray-700 hover:bg-gray-50/50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                Entrega de Alcance
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  Límite: 23 de Julio
                </span>
              </span>
            </button>
          </div>

          {/* Tab Panels */}
          <div className="p-6 sm:p-10">
            
            {/* Panel 1: Registro Rápido */}
            <div 
              role="tabpanel" 
              id="panel-registro" 
              aria-labelledby="tab-registro"
              hidden={activeTab !== 'registro'}
            >
              {f1Status === 'success' ? (
                <div 
                  ref={successRef}
                  tabIndex={-1}
                  className="rounded-lg bg-green-50 p-6 border border-green-200 text-center focus:outline-none"
                  aria-live="polite"
                >
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-medium text-green-800 mb-2">¡Registro exitoso!</h3>
                  <p className="text-green-700">Tu equipo ha sido inscrito correctamente. Prepárense para innovar.</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={() => setF1Status('idle')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      Registrar otro equipo
                    </button>
                    <button 
                      onClick={() => {
                        setF1Status('idle');
                        setActiveTab('alcance');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-prosur-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-prosur-red transition-all hover:scale-[1.02]"
                    >
                      Completar entrega de alcance
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleF1Submit} className="space-y-6" noValidate={false}>
                  {f1Status === 'error' && (
                    <div className="rounded-md bg-red-50 p-4 border border-red-200">
                      <p className="text-sm text-red-700">Hubo un error al enviar el formulario. Por favor, intenta de nuevo.</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="teamName" className={labelClasses}>Nombre del equipo <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <input
                        type="text"
                        id="teamName"
                        name="teamName"
                        required
                        value={f1Data.teamName}
                        onChange={(e) => setF1Data({...f1Data, teamName: e.target.value})}
                        className={inputClasses}
                        placeholder="Ej. Los Innovadores"
                        aria-required="true"
                        disabled={f1Status === 'submitting'}
                      />
                    </div>

                    <div>
                      <label htmlFor="employeeId" className={labelClasses}>Número de colaborador <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        required
                        value={f1Data.employeeId}
                        onChange={(e) => setF1Data({...f1Data, employeeId: e.target.value})}
                        className={inputClasses}
                        placeholder="Ej. 12345"
                        aria-required="true"
                        disabled={f1Status === 'submitting'}
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className={labelClasses}>Empresa a la que pertenecen <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <select
                        id="company"
                        name="company"
                        required
                        value={f1Data.company}
                        onChange={(e) => setF1Data({...f1Data, company: e.target.value})}
                        className={inputClasses}
                        aria-required="true"
                        disabled={f1Status === 'submitting'}
                      >
                        <option value="" disabled>Selecciona una empresa</option>
                        <option value="Grupo Chesa">Grupo Chesa</option>
                        <option value="5 Pinos">5 Pinos</option>
                        <option value="Calzamoda">Calzamoda</option>
                        <option value="CaFi">CaFi</option>
                        <option value="Grupo Prosur">Grupo Prosur</option>
                        <option value="Otra">Otra</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="department" className={labelClasses}>Área o Departamento <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        required
                        value={f1Data.department}
                        onChange={(e) => setF1Data({...f1Data, department: e.target.value})}
                        className={inputClasses}
                        placeholder="Ej. Recursos Humanos"
                        aria-required="true"
                        disabled={f1Status === 'submitting'}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="members" className={labelClasses}>Nombres de Integrantes <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <textarea
                        id="members"
                        name="members"
                        rows={3}
                        required
                        value={f1Data.members}
                        onChange={(e) => setF1Data({...f1Data, members: e.target.value})}
                        className={inputClasses}
                        aria-describedby="members-help"
                        aria-required="true"
                        disabled={f1Status === 'submitting'}
                      />
                      <p id="members-help" className="mt-2 text-sm text-prosur-gray">
                        Escribe un integrante por línea o separa los nombres con comas.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="painPoint" className={labelClasses}>¿Qué problema o tarea repetitiva tienen hoy en su área? <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <textarea
                        id="painPoint"
                        name="painPoint"
                        rows={4}
                        required
                        maxLength={500}
                        value={f1Data.painPoint}
                        onChange={(e) => setF1Data({...f1Data, painPoint: e.target.value})}
                        className={inputClasses}
                        placeholder="Describe brevemente el problema actual..."
                        aria-describedby="painPoint-help"
                        aria-required="true"
                        disabled={f1Status === 'submitting'}
                      />
                      <div className="flex justify-between mt-2">
                        <p id="painPoint-help" className="text-sm text-prosur-gray">
                          Describe el problema que intentarán resolver.
                        </p>
                        <p className="text-sm text-prosur-gray" aria-live="polite">
                          {f1Data.painPoint.length}/500
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={f1Status === 'submitting'}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-prosur-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-prosur-red transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      {f1Status === 'submitting' ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                          Enviando registro...
                        </>
                      ) : (
                        'Inscribir a mi equipo'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Panel 2: Entrega de Alcance */}
            <div 
              role="tabpanel" 
              id="panel-alcance" 
              aria-labelledby="tab-alcance"
              hidden={activeTab !== 'alcance'}
            >
              {f2Status === 'success' ? (
                <div 
                  ref={successRef}
                  tabIndex={-1}
                  className="rounded-lg bg-green-50 p-6 border border-green-200 text-center focus:outline-none"
                  aria-live="polite"
                >
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-medium text-green-800 mb-2">¡Alcance enviado!</h3>
                  <p className="text-green-700">Hemos recibido los detalles de tu proyecto. ¡Mucho éxito en el desarrollo!</p>
                  <button 
                    onClick={() => setF2Status('idle')}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Enviar otra actualización
                  </button>
                </div>
              ) : (
                <form onSubmit={handleF2Submit} className="space-y-6" noValidate={false}>
                  
                  {f2Status === 'error' && (
                    <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-6">
                      <p className="text-sm text-red-700">Hubo un error al enviar el formulario. Por favor, intenta de nuevo.</p>
                    </div>
                  )}

                  <div className="rounded-md bg-blue-50/80 p-4 mb-6 border border-blue-100">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700 font-medium">
                          Completa esta sección cuando tu proyecto ya tenga una idea y un alcance más definidos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Selector de equipo o ingreso manual */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className={registeredTeams.length > 0 && !isManualTeam ? "sm:col-span-2" : ""}>
                        <div className="flex justify-between items-center mb-1">
                          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                            Equipo participante <span className="text-prosur-red" aria-hidden="true">*</span>
                          </label>
                          {registeredTeams.length > 0 && isManualTeam && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsManualTeam(false);
                                if (registeredTeams.length > 0) {
                                  setF2Data(prev => ({ 
                                    ...prev, 
                                    teamName: registeredTeams[0].teamName,
                                    employeeId: registeredTeams[0].employeeId
                                  }));
                                }
                              }}
                              className="text-xs text-prosur-red hover:text-red-700 font-medium transition-colors"
                            >
                              Seleccionar de la lista
                            </button>
                          )}
                        </div>
                        
                        {isLoadingTeams ? (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500">
                            <Loader2 className="animate-spin h-4 w-4 text-prosur-red" />
                            Cargando lista de equipos desde Google Sheets...
                          </div>
                        ) : registeredTeams.length > 0 && !isManualTeam ? (
                          <div className="relative">
                            <select
                              id="teamName"
                              name="teamName"
                              required
                              value={f2Data.teamName}
                              onChange={(e) => {
                                if (e.target.value === '__manual__') {
                                  setIsManualTeam(true);
                                  setF2Data(prev => ({ ...prev, teamName: '', employeeId: '' }));
                                } else {
                                  const selected = registeredTeams.find(t => t.teamName === e.target.value);
                                  setF2Data(prev => ({ 
                                    ...prev, 
                                    teamName: e.target.value,
                                    employeeId: selected ? selected.employeeId : ''
                                  }));
                                }
                              }}
                              className={inputClasses}
                              aria-required="true"
                              disabled={f2Status === 'submitting'}
                            >
                              <option value="" disabled>Selecciona tu equipo</option>
                              {registeredTeams.map((team) => (
                                <option key={team.teamName} value={team.teamName}>
                                  {team.teamName} (Colaborador: {team.employeeId || 'N/A'} - {team.department || 'Sin área'})
                                </option>
                              ))}
                              <option value="__manual__">✏️ Escribir otro nombre de equipo...</option>
                            </select>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="text"
                              id="teamName"
                              name="teamName"
                              required
                              value={f2Data.teamName}
                              onChange={(e) => setF2Data(prev => ({ ...prev, teamName: e.target.value }))}
                              className={inputClasses}
                              placeholder="Ej. Los Innovadores"
                              aria-required="true"
                              disabled={f2Status === 'submitting'}
                            />
                          </div>
                        )}
                      </div>

                      {/* Campo para el número de colaborador */}
                      {(!isLoadingTeams && (registeredTeams.length === 0 || isManualTeam)) ? (
                        <div>
                          <label htmlFor="employeeId" className={labelClasses}>
                            Número de colaborador <span className="text-prosur-red" aria-hidden="true">*</span>
                          </label>
                          <input
                            type="text"
                            id="employeeId"
                            name="employeeId"
                            required
                            value={f2Data.employeeId}
                            onChange={(e) => setF2Data(prev => ({ ...prev, employeeId: e.target.value }))}
                            className={inputClasses}
                            placeholder="Ej. 12345"
                            aria-required="true"
                            disabled={f2Status === 'submitting'}
                          />
                        </div>
                      ) : !isLoadingTeams && f2Data.teamName ? (
                        <div className="sm:col-span-2 p-3 bg-gray-50/80 rounded-md border border-gray-200 flex justify-between items-center text-sm">
                          <div>
                            <span className="text-gray-500 font-medium">Vinculado a colaborador:</span>{' '}
                            <span className="text-gray-950 font-semibold">{f2Data.employeeId || 'N/A'}</span>
                          </div>
                          <div className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                            Equipo verificado
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <label htmlFor="projectName" className={labelClasses}>Nombre definitivo del proyecto <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        required
                        value={f2Data.projectName}
                        onChange={(e) => setF2Data({...f2Data, projectName: e.target.value})}
                        className={inputClasses}
                        aria-required="true"
                        disabled={f2Status === 'submitting'}
                      />
                    </div>

                    <div>
                      <label htmlFor="diagnosis" className={labelClasses}>Situación actual (El problema) <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <textarea
                        id="diagnosis"
                        name="diagnosis"
                        rows={3}
                        required
                        value={f2Data.diagnosis}
                        onChange={(e) => setF2Data({...f2Data, diagnosis: e.target.value})}
                        className={inputClasses}
                        aria-describedby="diagnosis-help"
                        aria-required="true"
                        disabled={f2Status === 'submitting'}
                      />
                      <p id="diagnosis-help" className="mt-2 text-sm text-prosur-gray">
                        Describe cuánto tiempo, esfuerzo o recursos se gastan actualmente en esta tarea.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="solution" className={labelClasses}>La Solución Propuesta <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <textarea
                        id="solution"
                        name="solution"
                        rows={4}
                        required
                        value={f2Data.solution}
                        onChange={(e) => setF2Data({...f2Data, solution: e.target.value})}
                        className={inputClasses}
                        aria-describedby="solution-help"
                        aria-required="true"
                        disabled={f2Status === 'submitting'}
                      />
                      <p id="solution-help" className="mt-2 text-sm text-prosur-gray font-medium">
                        Pregunta guía: "¿Cómo funciona y qué tipo de inteligencia artificial utiliza?"
                      </p>
                    </div>

                    <div>
                      <label htmlFor="metric" className={labelClasses}>¿Cómo mediremos el éxito? <span className="text-prosur-red" aria-hidden="true">*</span></label>
                      <input
                        type="text"
                        id="metric"
                        name="metric"
                        required
                        value={f2Data.metric}
                        onChange={(e) => setF2Data({...f2Data, metric: e.target.value})}
                        className={inputClasses}
                        aria-describedby="metric-help"
                        aria-required="true"
                        disabled={f2Status === 'submitting'}
                      />
                      <p id="metric-help" className="mt-2 text-sm text-prosur-gray">
                        Ejemplo: horas ahorradas a la semana, menos errores, o tareas hechas más rápido.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={f2Status === 'submitting'}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-prosur-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-prosur-red transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      {f2Status === 'submitting' ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                          Enviando alcance...
                        </>
                      ) : (
                        'Enviar Alcance del Proyecto'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}