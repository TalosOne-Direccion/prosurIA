import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Search, 
  Filter, 
  Eye, 
  X, 
  Building2, 
  Layers, 
  Lightbulb, 
  TrendingUp,
  Lock,
  Unlock
} from 'lucide-react';

// =========================================================================
// SIMPLE ROBUST CSV PARSER FOR GOOGLE SHEETS EXPORTS
// =========================================================================
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let currentVal = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentVal += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(currentVal);
        currentVal = '';
      } else if (char === '\r') {
        // ignore
      } else if (char === '\n') {
        row.push(currentVal);
        result.push(row);
        row = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
  }
  
  if (row.length > 0 || currentVal) {
    row.push(currentVal);
    result.push(row);
  }
  
  return result;
}

// =========================================================================
// REAL DATA FALLBACK (FROM THE REGISTERED SHEET)
// =========================================================================
const INITIAL_MOCK_TEAMS = [
  {
    teamName: "Procesos",
    employeeId: "180109",
    company: "Calzamoda",
    department: "Auditoria y Procesos",
    members: "Diego López Guzmán",
    painPoint: "La planeación de compras en la empresa RIO VINYL DE MEXICO se realiza mediante procesos manuales que consolidan información de diversas fuentes extraídas del sistema ERP (Microsip) y requieren validaciones fuera del sistema."
  },
  {
    teamName: "T-800",
    employeeId: "230788",
    company: "CaFi",
    department: "Marketing",
    members: "Oswaldo Rafael Hernández Rodríguez",
    painPoint: "Actualmente, el proceso de asignación de leads se realiza de manera manual. Para ello, es necesario extraer la información de los prospectos y copiarla a una hoja de cálculo de Excel."
  },
  {
    teamName: "Impulso Inteligente",
    employeeId: "110941",
    company: "Grupo Chesa",
    department: "BDC",
    members: "Angel Francisco Lievano Trejo",
    painPoint: "En el BDC manejamos información de varias fuentes (DMS, CRM, PROSUR, SIMA) de cada agencia y de las tres marcas. Cada sistema entrega un formato distinto."
  },
  {
    teamName: "TEAM AMOS",
    employeeId: "180081",
    company: "CaFi",
    department: "OPERATIVA - COMERCIAL",
    members: "ANGELINA ASUNSUNCION DIAZ HERNANDEZ, MONTSERRAT SANDOVAL ZEPEDA, OSWALDO RAFAEL HERNANDEZ RODRIGUEZ, MAYRA BERENICE MONTOYA GARCIA",
    painPoint: "El proceso de contacto al cliente de renovación de seguros es tardado."
  },
  {
    teamName: "AI",
    employeeId: "1",
    company: "Grupo Chesa",
    department: "MANTENIMIENTO",
    members: "RICARDO CASTILLEJA DELGADO",
    painPoint: "1.-Reloj checador desactualizado. Actividades de Bitácora repetitivas, horarios apretados y fuera de realidades. Mejora en la revision de unidades en horario nocturno."
  },
  {
    teamName: "IA conec",
    employeeId: "280257",
    company: "Grupo Chesa",
    department: "Ventas",
    members: "Erick jhovanny zebadua cerda, Ibis Velez Morales",
    painPoint: "Tareas repetitivas que consumen tiempo: Redactar desde cero mensajes de WhatsApp para cada prospecto y clasificar manualmente quién está frío, tibio o caliente."
  }
];

const INITIAL_MOCK_PROJECTS = [
  {
    teamName: "Procesos",
    employeeId: "180109",
    projectName: "Resurtido_compras_rv",
    diagnosis: "La planeación de compras en la empresa RIO VINYL DE MEXICO requiere la extracción, validación y consolidación manual de información desde el ERP (Microsip) hacia herramientas externas como hojas de cálculo.",
    solution: "Se creará un sistema que ejecutará automáticamente todo el proceso de planeación al inicio de cada mes. Adicionalmente, la persona encargada podrá solicitarlo enviando un correo.",
    metric: "Tiempo por ciclo: de 4 horas a menos de 10 minutos. Errores de cálculo: de variable a cero."
  },
  {
    teamName: "T-800",
    employeeId: "230788",
    projectName: "Automatización de captura, asignación de leads y atención de prospectos",
    diagnosis: "Actualmente, el proceso de asignación de leads se realiza de manera manual. Este procedimiento depende completamente de la intervención humana, lo que genera una carga operativa considerable.",
    solution: "Se propone implementar una automatización integrada entre Kommo, Google Sheet y agentes de IA de Eleven Labs mediante herramientas de automatización de procesos (n8n o make).",
    metric: "Automatizar el 100% de la asignación de leads y ahorrar al menos 20 horas de trabajo semanales."
  },
  {
    teamName: "Impulso Inteligente",
    employeeId: "110941",
    projectName: "PULSO BDC Servicio",
    diagnosis: "En el BDC utilizamos información de varias fuentes (DMS, CRM, PROSUR, SIMA). Hoy esto nos consume alrededor de 12 horas-persona por semana, genera errores de captura y cuando el tablero está listo, la información ya envejeció.",
    solution: "Un tablero que reciba uno o varios Excel de cualquier sucursal o fuente, detecte automáticamente el tipo de reporte, estandarice los encabezados y deduzca la marca a partir del VIN.",
    metric: "Horas-persona ahorradas por semana en consolidación y clasificación (de 12 horas a 1 hora por corte)."
  },
  {
    teamName: "TEAM AMOS",
    employeeId: "180081",
    projectName: "automatización de adquisición de seguros",
    diagnosis: "Proceso tardado para contactar al cliente para el otorgamiento para la renovación de pólizas de seguro.",
    solution: "Con ayuda de la IA se pretende disminuir considerablemente los tiempos de respuesta y contacto a cliente para la renovación de las pólizas de seguro.",
    metric: "Ahorro en procesos de autorización de la pólizas de seguro y contacto al cliente."
  },
  {
    teamName: "AI",
    employeeId: "1",
    projectName: "Implementacion de calidad (tiempo, procesos y revision)",
    diagnosis: "El reloj checador tiene asincronia con la hora actual. Los procesos de bitacora, evaluacion y calidad no tienen distribucion logica. La revision de unidades nocturnas tiene areas de oportunidad.",
    solution: "Sincronización NTP (Network Time Protocol) automática de biométricos con servidores oficiales. Asistente IA para auditorías cruzadas. Escáner fotográfico de daños nocturno con visión por computadora.",
    metric: "Resultados inmediatos, prácticos, 100% verificables y reducción drástica de tiempos muertos."
  },
  {
    teamName: "IA conec",
    employeeId: "280257",
    projectName: "IA conec",
    diagnosis: "El asesor divide gran parte de su tiempo redactando mensajes de seguimiento desde cero para ~200 contactos.",
    solution: "Un asistente de IA que clasifica automáticamente a cada prospecto según respuestas de WhatsApp y genera mensajes de seguimiento personalizados por modelo.",
    metric: "Tiempo de redacción: de 5-8 min a < 1 min. Prospectos atendidos: de 15-20 a la cartera completa priorizada. Ahorro de 1 a 2 horas diarias."
  }
];

export default function RegistrationTabs() {
  const [activeTab, setActiveTab] = useState<'registro' | 'alcance' | 'proyectos'>('registro');
  
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
    members?: string;
    painPoint?: string;
  }

  interface RegisteredProject {
    teamName: string;
    employeeId: string;
    projectName: string;
    diagnosis: string;
    solution: string;
    metric: string;
  }

  // State for all registered entities
  const [registeredTeams, setRegisteredTeams] = useState<RegisteredTeam[]>([]);
  const [registeredProjects, setRegisteredProjects] = useState<RegisteredProject[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isManualTeam, setIsManualTeam] = useState(false);

  // Admin Mode State
  const [adminToken, setAdminToken] = useState<string>(() => localStorage.getItem('prosur_admin_token') || '');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');

  // Search and Filter States for the registered projects dashboard
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedReg, setSelectedReg] = useState<any | null>(null);

  const loadFromLocalStorage = () => {
    // Load local projects
    const localProjectsString = localStorage.getItem('prosur_registered_projects');
    if (localProjectsString) {
      try {
        const parsed = JSON.parse(localProjectsString);
        if (Array.isArray(parsed)) {
          setRegisteredProjects(parsed);
        }
      } catch (err) {}
    }

    // Load local teams
    const teams = localStorage.getItem('prosur_registered_teams');
    if (teams) {
      try {
        const parsed = JSON.parse(teams);
        if (Array.isArray(parsed)) {
          const mapped = parsed.map((item: any) => {
            if (typeof item === 'string') {
              return {
                teamName: item,
                employeeId: '',
                company: '',
                department: ''
              };
            }
            return item;
          });
          setRegisteredTeams(mapped);
        }
      } catch (err) {}
    }
  };

  const processCsvData = (csvText: string) => {
    const parsedRows = parseCSV(csvText);
    
    // Find header row by searching for "nombre del equipo"
    const headerIndex = parsedRows.findIndex(row => row[0] && row[0].toLowerCase().includes("nombre del equipo"));
    
    if (headerIndex !== -1) {
      const dataRows = parsedRows.slice(headerIndex + 1);
      
      const teams: RegisteredTeam[] = [];
      const projects: RegisteredProject[] = [];
      
      dataRows.forEach(row => {
        if (!row[0] || !row[0].trim()) return; // skip empty rows
        
        const teamName = row[0].trim();
        const employeeId = (row[1] || '').trim();
        const company = (row[2] || '').trim();
        const department = (row[3] || '').trim();
        const members = (row[4] || '').trim();
        const painPoint = (row[5] || '').trim();
        
        teams.push({
          teamName,
          employeeId,
          company,
          department,
          members,
          painPoint
        });
        
        const projectName = (row[6] || '').trim();
        const diagnosis = (row[7] || '').trim();
        const solution = (row[8] || '').trim();
        const metric = (row[9] || '').trim();
        
        if (projectName) {
          projects.push({
            teamName,
            employeeId,
            projectName,
            diagnosis,
            solution,
            metric
          });
        }
      });
      
      setRegisteredTeams(teams);
      setRegisteredProjects(projects);
      
      // Pre-select in Form 2
      if (teams.length > 0 && !isManualTeam) {
        setF2Data(prev => ({
          ...prev,
          teamName: prev.teamName || teams[0].teamName,
          employeeId: prev.employeeId || teams[0].employeeId
        }));
      }
    }
  };

  // Load registered teams and projects from Google Sheet CSV via fallback local proxy
  const fetchTeamsAndProjects = async (tokenToUse?: string) => {
    setIsLoadingTeams(true);
    
    // Load local storage first
    loadFromLocalStorage();

    const activeToken = tokenToUse !== undefined ? tokenToUse : adminToken;

    try {
      let csvText = '';
      
      // We always query through `/sheet-proxy` now, appending ?token= if present
      const proxyUrl = activeToken ? `/sheet-proxy?token=${encodeURIComponent(activeToken)}` : '/sheet-proxy';
      
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Proxy fetch returned not OK");
      
      // Check X-Is-Admin header to confirm if admin access was granted
      const isAdminHeader = response.headers.get('X-Is-Admin');
      if (isAdminHeader === 'true') {
        setIsAdminMode(true);
        if (activeToken) {
          localStorage.setItem('prosur_admin_token', activeToken);
        }
      } else {
        setIsAdminMode(false);
        if (tokenToUse !== undefined) {
          localStorage.removeItem('prosur_admin_token');
          setAdminToken('');
        }
      }

      csvText = await response.text();

      if (csvText) {
        processCsvData(csvText);
      }
    } catch (e) {
      console.error("Error al obtener datos reales de Google Sheet:", e);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('prosur_admin_token');
    setAdminToken('');
    setIsAdminMode(false);
    // Reload projects in public view
    fetchTeamsAndProjects('');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!inputCode.trim()) {
      setAdminError('Por favor ingresa un código.');
      return;
    }
    
    setIsLoadingTeams(true);
    try {
      const activeToken = inputCode.trim();
      const proxyUrl = activeToken ? `/sheet-proxy?token=${encodeURIComponent(activeToken)}` : '/sheet-proxy';
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Error de red al consultar el servidor.");
      
      const isAdminHeader = response.headers.get('X-Is-Admin');
      if (isAdminHeader === 'true') {
        setAdminToken(activeToken);
        setIsAdminMode(true);
        localStorage.setItem('prosur_admin_token', activeToken);
        setShowAdminModal(false);
        setInputCode('');
        
        const csvText = await response.text();
        if (csvText) {
          processCsvData(csvText);
        }
      } else {
        setAdminError('Código de acceso incorrecto.');
      }
    } catch (err: any) {
      setAdminError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setIsLoadingTeams(false);
    }
  };

  useEffect(() => {
    fetchTeamsAndProjects();
  }, []);

  // Fetch teams again whenever the active tab changes
  useEffect(() => {
    if (activeTab === 'alcance' || activeTab === 'proyectos') {
      fetchTeamsAndProjects();
    }
  }, [activeTab]);

  const successRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility on success
  useEffect(() => {
    if ((f1Status === 'success' || f2Status === 'success') && successRef.current) {
      successRef.current.focus();
    }
  }, [f1Status, f2Status]);

  // Combine Mock + API + LocalStorage registrations
  const getUnifiedRegistrations = () => {
    const teamsMap = new Map<string, RegisteredTeam>();

    // 1. Mock teams (Real data fallback)
    INITIAL_MOCK_TEAMS.forEach(team => {
      teamsMap.set(team.teamName.toLowerCase(), team);
    });

    // 2. API & local storage teams
    registeredTeams.forEach(team => {
      teamsMap.set(team.teamName.toLowerCase(), {
        ...teamsMap.get(team.teamName.toLowerCase()),
        ...team
      });
    });

    const projectsMap = new Map<string, RegisteredProject>();

    // 1. Mock projects (Real data fallback)
    INITIAL_MOCK_PROJECTS.forEach(proj => {
      projectsMap.set(proj.teamName.toLowerCase(), proj);
    });

    // 2. Local storage projects
    registeredProjects.forEach(proj => {
      projectsMap.set(proj.teamName.toLowerCase(), {
        ...projectsMap.get(proj.teamName.toLowerCase()),
        ...proj
      });
    });

    const unifiedList: Array<{
      teamName: string;
      employeeId: string;
      company: string;
      department: string;
      members?: string;
      painPoint?: string;
      projectName?: string;
      diagnosis?: string;
      solution?: string;
      metric?: string;
      status: 'registered' | 'scope_submitted';
    }> = [];

    teamsMap.forEach((team, key) => {
      const project = projectsMap.get(key);
      if (project) {
        unifiedList.push({
          ...team,
          projectName: project.projectName,
          diagnosis: project.diagnosis,
          solution: project.solution,
          metric: project.metric,
          status: 'scope_submitted'
        });
      } else {
        unifiedList.push({
          ...team,
          status: 'registered'
        });
      }
    });

    return unifiedList.sort((a, b) => {
      if (a.status === b.status) {
        return a.teamName.localeCompare(b.teamName);
      }
      return a.status === 'scope_submitted' ? -1 : 1;
    });
  };

  // Get teams list for selection dropdown
  const getDropdownTeams = () => {
    const teamsMap = new Map<string, RegisteredTeam>();

    INITIAL_MOCK_TEAMS.forEach(team => {
      teamsMap.set(team.teamName.toLowerCase(), team);
    });

    registeredTeams.forEach(team => {
      teamsMap.set(team.teamName.toLowerCase(), {
        ...teamsMap.get(team.teamName.toLowerCase()),
        ...team
      });
    });

    return Array.from(teamsMap.values()).sort((a, b) => a.teamName.localeCompare(b.teamName));
  };

  const handleF1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setF1Status('submitting');

    try {
      // Envío real a Google Sheets
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'registro',
          ...f1Data
        })
      });

      // Guardar el equipo registrado localmente (completo)
      const newTeamObj: RegisteredTeam = {
        teamName: f1Data.teamName.trim(),
        employeeId: f1Data.employeeId.trim(),
        company: f1Data.company,
        department: f1Data.department,
        members: f1Data.members,
        painPoint: f1Data.painPoint
      };
      
      const localTeamsString = localStorage.getItem('prosur_registered_teams');
      let localTeamsList: any[] = [];
      if (localTeamsString) {
        try {
          localTeamsList = JSON.parse(localTeamsString);
        } catch (err) {}
      }
      
      // Filter out duplicate
      localTeamsList = localTeamsList.filter(t => {
        const name = typeof t === 'string' ? t : t.teamName;
        return name.toLowerCase() !== newTeamObj.teamName.toLowerCase();
      });
      localTeamsList.push(newTeamObj);
      localStorage.setItem('prosur_registered_teams', JSON.stringify(localTeamsList));

      setRegisteredTeams(prev => {
        const exists = prev.some(t => t.teamName.toLowerCase() === newTeamObj.teamName.toLowerCase());
        if (!exists) {
          return [...prev, newTeamObj];
        }
        return prev.map(t => t.teamName.toLowerCase() === newTeamObj.teamName.toLowerCase() ? newTeamObj : t);
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

      // Guardar el proyecto registrado localmente
      const newProjectObj: RegisteredProject = {
        teamName: f2Data.teamName.trim(),
        employeeId: f2Data.employeeId.trim(),
        projectName: f2Data.projectName.trim(),
        diagnosis: f2Data.diagnosis.trim(),
        solution: f2Data.solution.trim(),
        metric: f2Data.metric.trim()
      };

      const localProjectsString = localStorage.getItem('prosur_registered_projects');
      let localProjectsList: RegisteredProject[] = [];
      if (localProjectsString) {
        try {
          localProjectsList = JSON.parse(localProjectsString);
        } catch (err) {}
      }
      
      // Filter out duplicate
      localProjectsList = localProjectsList.filter(p => p.teamName.toLowerCase() !== newProjectObj.teamName.toLowerCase());
      localProjectsList.push(newProjectObj);
      localStorage.setItem('prosur_registered_projects', JSON.stringify(localProjectsList));

      setRegisteredProjects(prev => {
        const exists = prev.some(p => p.teamName.toLowerCase() === newProjectObj.teamName.toLowerCase());
        if (exists) {
          return prev.map(p => p.teamName.toLowerCase() === newProjectObj.teamName.toLowerCase() ? newProjectObj : p);
        } else {
          return [...prev, newProjectObj];
        }
      });

      setF2Status('success');
      // Limpiar datos
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

  const handleTabChange = (tab: 'registro' | 'alcance' | 'proyectos') => {
    setActiveTab(tab);
    setF1Status('idle');
    setF2Status('idle');
  };

  const renderConfidentialField = (title: string, value: string | undefined, icon: React.ReactNode) => {
    const textVal = value || '';
    const isProtected = textVal === '[Protegido]' || textVal === '[Protegido por confidencialidad]' || textVal.toLowerCase().includes('protegido');
    
    return (
      <div>
        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b pb-1 border-gray-100">
          {icon}
          {title}
        </h4>
        {isProtected ? (
          <div className="relative overflow-hidden bg-gray-50/50 border border-gray-250/60 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex-1 filter blur-[2.5px] select-none text-xs text-gray-300 font-mono leading-relaxed select-none pointer-events-none">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </div>
            <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-600 border border-gray-200 shadow-sm animate-pulse">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                Protegido por confidencialidad
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/30 p-4 rounded-xl border border-gray-250/40">
            {textVal}
          </p>
        )}
      </div>
    );
  };

  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-prosur-red focus:ring-prosur-red sm:text-sm p-3 border bg-white/90 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  // Data processing for the dashboard
  const unifiedRegistrations = getUnifiedRegistrations();
  
  // Calculate metrics
  const totalTeams = unifiedRegistrations.length;
  const totalScopes = unifiedRegistrations.filter(r => r.status === 'scope_submitted').length;
  const uniqueCompanies = new Set(unifiedRegistrations.map(r => r.company).filter(Boolean)).size;

  // Filter registrations based on search & filter state
  const filteredRegistrations = unifiedRegistrations.filter(reg => {
    const matchesSearch = 
      reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.projectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.solution || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.department.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCompany = !selectedCompany || reg.company === selectedCompany;
    const matchesDepartment = !selectedDepartment || reg.department === selectedDepartment;
    
    return matchesSearch && matchesCompany && matchesDepartment;
  });

  // Get unique values for filters
  const allCompanies = Array.from(new Set(unifiedRegistrations.map(r => r.company).filter(Boolean))).sort();
  const allDepartments = Array.from(new Set(unifiedRegistrations.map(r => r.department).filter(Boolean))).sort();

  return (
    <section id="registro" className="py-20 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Participa en el Reto</h2>
          <p className="text-lg text-prosur-gray">
            Completa tu registro inicial, envía el alcance de tu proyecto o explora los proyectos participantes.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabs Header */}
          <div 
            className="flex flex-col sm:flex-row border-b border-gray-200 bg-white/50" 
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
            <button
              role="tab"
              aria-selected={activeTab === 'proyectos'}
              aria-controls="panel-proyectos"
              id="tab-proyectos"
              onClick={() => handleTabChange('proyectos')}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-prosur-red ${
                activeTab === 'proyectos' 
                  ? 'border-b-2 border-prosur-red text-prosur-red bg-red-50/50' 
                  : 'text-prosur-gray hover:text-gray-700 hover:bg-gray-50/50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                Proyectos Registrados
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-prosur-red">
                  {totalTeams}
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
                      <div className={getDropdownTeams().length > 0 && !isManualTeam ? "sm:col-span-2" : ""}>
                        <div className="flex justify-between items-center mb-1">
                          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                            Equipo participante <span className="text-prosur-red" aria-hidden="true">*</span>
                          </label>
                          {getDropdownTeams().length > 0 && isManualTeam && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsManualTeam(false);
                                const dropdown = getDropdownTeams();
                                if (dropdown.length > 0) {
                                  setF2Data(prev => ({ 
                                    ...prev, 
                                    teamName: dropdown[0].teamName,
                                    employeeId: dropdown[0].employeeId
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
                            Cargando lista de equipos...
                          </div>
                        ) : getDropdownTeams().length > 0 && !isManualTeam ? (
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
                                  const dropdown = getDropdownTeams();
                                  const selected = dropdown.find(t => t.teamName === e.target.value);
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
                              {getDropdownTeams().map((team) => (
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
                      {(!isLoadingTeams && (getDropdownTeams().length === 0 || isManualTeam)) ? (
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

            {/* Panel 3: Proyectos Registrados */}
            <div 
              role="tabpanel" 
              id="panel-proyectos" 
              aria-labelledby="tab-proyectos"
              hidden={activeTab !== 'proyectos'}
            >
              {/* Admin Mode Warning/Action Banner */}
              {isAdminMode ? (
                <div className="bg-green-50/80 rounded-xl p-4 border border-green-200/60 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
                      <Unlock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-800">Modo Administrador Activo</p>
                      <p className="text-xs text-green-600 font-medium">Tienes acceso para ver todos los detalles y desgloses de los proyectos.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleAdminLogout}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    Cerrar Sesión Admin
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-gray-500/10 rounded-lg text-gray-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700">Vista Pública Activa</p>
                      <p className="text-xs text-gray-500 font-medium">Las propuestas de ideas y desgloses están protegidos para evitar plagios entre equipos.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setAdminError('');
                      setInputCode('');
                      setShowAdminModal(true);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold rounded-lg transition-colors focus:outline-none flex items-center gap-1.5 shadow-xs"
                  >
                    <Unlock className="w-3.5 h-3.5 text-gray-500" />
                    Acceso Organizador
                  </button>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100/60 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-2.5 bg-prosur-red/10 rounded-lg text-prosur-red">
                    <Building2 className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-xs text-prosur-gray font-semibold uppercase tracking-wider">Equipos Inscritos</p>
                    <p className="text-xl font-bold text-gray-900">{totalTeams}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100/60 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-600">
                    <Lightbulb className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-xs text-prosur-gray font-semibold uppercase tracking-wider">Alcances Entregados</p>
                    <p className="text-xl font-bold text-gray-950">{totalScopes}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100/60 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-2.5 bg-green-500/10 rounded-lg text-green-600">
                    <TrendingUp className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-xs text-prosur-gray font-semibold uppercase tracking-wider">Empresas Participantes</p>
                    <p className="text-xl font-bold text-gray-900">{uniqueCompanies}</p>
                  </div>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar equipo, proyecto o área..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-8 py-2 w-full rounded-lg border border-gray-300 bg-white/80 shadow-sm focus:border-prosur-red focus:ring-prosur-red text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white/80 py-2 px-3 shadow-sm focus:border-prosur-red focus:ring-prosur-red text-sm"
                  >
                    <option value="">Todas las Empresas</option>
                    {allCompanies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white/80 py-2 px-3 shadow-sm focus:border-prosur-red focus:ring-prosur-red text-sm"
                  >
                    <option value="">Todas las Áreas</option>
                    {allDepartments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cards Grid */}
              {filteredRegistrations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-base text-gray-600 font-semibold">No se encontraron proyectos registrados</p>
                  <p className="text-sm text-gray-400 mt-1">Prueba a ajustar tus filtros de búsqueda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRegistrations.map((reg, idx) => (
                    <div 
                      key={idx}
                      className="group relative bg-white/70 hover:bg-white rounded-xl border border-gray-200/80 hover:border-prosur-red/20 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden"
                    >
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-prosur-red to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      
                      <div>
                        <div className="flex justify-between items-center gap-2 mb-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            reg.status === 'scope_submitted' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {reg.status === 'scope_submitted' ? 'Alcance Entregado' : 'Solo Registro'}
                          </span>
                          <span className="text-xs font-medium text-gray-600 bg-gray-100/90 px-2 py-0.5 rounded-md border border-gray-200/50">
                            {reg.company}
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-gray-900 mb-1 leading-snug group-hover:text-prosur-red transition-colors">
                          {reg.projectName || `Equipo: ${reg.teamName}`}
                        </h4>
                        
                        <p className="text-xs text-prosur-gray mb-3.5 font-medium">
                          Área: <span className="text-gray-700 font-semibold">{reg.department}</span>
                        </p>

                        <div className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {reg.status === 'scope_submitted' ? (
                            <>
                              <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider mb-0.5">Solución IA</span>
                              {reg.solution}
                            </>
                          ) : (
                            <>
                              <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider mb-0.5">Desafío / Problema</span>
                              {reg.painPoint}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          {reg.status === 'scope_submitted' ? 'Fase 2 Completada' : 'Fase 1 Completada'}
                        </span>
                        
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-prosur-red hover:text-red-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Component */}
              {selectedReg && (
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
                  role="dialog"
                  aria-modal="true"
                  onClick={() => setSelectedReg(null)}
                >
                  <div 
                    className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedReg(null)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Cerrar detalles"
                    >
                      <X className="w-5.5 h-5.5" />
                    </button>

                    <div className="mb-6">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          selectedReg.status === 'scope_submitted' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {selectedReg.status === 'scope_submitted' ? 'Alcance Entregado' : 'Solo Registro'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                          {selectedReg.company}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                        {selectedReg.projectName || 'Registro de Equipo'}
                      </h3>
                      <p className="text-sm text-prosur-gray mt-1 font-medium">
                        Presentado por el equipo <strong className="text-gray-800 font-semibold">{selectedReg.teamName}</strong>
                        {selectedReg.employeeId && selectedReg.employeeId !== '[Protegido]' && (
                          <> (Colaborador ID: {selectedReg.employeeId})</>
                        )}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/50">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Área o Departamento</p>
                          <p className="text-sm text-gray-800 font-semibold mt-0.5">{selectedReg.department}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Integrantes del Equipo</p>
                          {selectedReg.members === '[Protegido]' ? (
                            <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-200/80 shadow-xs animate-pulse">
                              <Lock className="w-3 h-3 text-gray-400" /> Protegido
                            </span>
                          ) : (
                            <p className="text-sm text-gray-855 font-semibold mt-0.5 whitespace-pre-line">{selectedReg.members || 'No especificados'}</p>
                          )}
                        </div>
                      </div>

                      {renderConfidentialField(
                        "Situación Actual / El Problema",
                        selectedReg.diagnosis || selectedReg.painPoint || 'Sin descripción detallada del problema.',
                        <AlertCircle className="w-4 h-4 text-prosur-red" />
                      )}

                      {selectedReg.status === 'scope_submitted' && (
                        <>
                          {renderConfidentialField(
                            "La Solución Propuesta (Inteligencia Artificial)",
                            selectedReg.solution,
                            <Lightbulb className="w-4 h-4 text-blue-500" />
                          )}

                          {renderConfidentialField(
                            "Métrica de Éxito",
                            selectedReg.metric,
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          )}
                        </>
                      )}

                      {selectedReg.status !== 'scope_submitted' && (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/70 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-amber-800">¡Alcance del Proyecto Pendiente!</p>
                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                              Este equipo completó el Registro Rápido con éxito, pero aún no ha entregado los detalles técnicos de su solución de IA. Si formas parte de este equipo, dirígete a la pestaña **Entrega de Alcance** para completar el envío.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={() => setSelectedReg(null)}
                        className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Login Modal */}
              {showAdminModal && (
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
                  role="dialog"
                  aria-modal="true"
                  onClick={() => setShowAdminModal(false)}
                >
                  <div 
                    className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setShowAdminModal(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Cerrar modal"
                    >
                      <X className="w-5.5 h-5.5" />
                    </button>

                    <div className="mb-6 text-center">
                      <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-prosur-red mb-3">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        Acceso Organizador
                      </h3>
                      <p className="text-sm text-prosur-gray mt-1 font-medium">
                        Ingresa el código de administrador para revelar las ideas completas de todos los equipos.
                      </p>
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      {adminError && (
                        <div className="p-3 bg-red-50 text-xs font-semibold text-red-600 border border-red-200 rounded-lg">
                          {adminError}
                        </div>
                      )}
                      <div>
                        <label htmlFor="adminCode" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Código de Acceso</label>
                        <input
                          type="password"
                          id="adminCode"
                          required
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-prosur-red text-center text-lg font-bold tracking-widest"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoadingTeams}
                        className="w-full py-2.5 px-4 bg-prosur-red hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-all focus:outline-none hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100"
                      >
                        {isLoadingTeams ? 'Verificando...' : 'Desbloquear Datos'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}