export interface ResumeRow {
  index: string;
  title: string;
  status: string;
}

export interface ResumeCategory {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  rank: number;
  rows: ResumeRow[];
}

export const RESUME_CATEGORIES: ResumeCategory[] = [
  {
    id: 'i',
    badge: 'I',
    title: 'EDUCAÇÃO',
    subtitle: 'Formação Acadêmica',
    rank: 2,
    rows: [
      { index: '01', title: 'FAETERJ Petrópolis - TI', status: 'Cursando (2024-2027)' },
      { index: '02', title: 'Residência TIC Software - Serratec', status: 'Completo (2024)' },
    ],
  },
  {
    id: 'ii',
    badge: 'II',
    title: 'HABILIDADES',
    subtitle: 'Linguagens / Stacks / Conceitos',
    rank: 7,
    rows: [
      { index: '01', title: 'Backend: C# / Python', status: 'Experiente' },
      { index: '02', title: 'Frontend: Svelte / React / HTML / CSS / JS / TS', status: 'Experiente' },
      { index: '03', title: 'Mobile: Flutter / React Native', status: 'Experiente' },
      { index: '04', title: 'Banco de Dados: PostgreSQL / SQL Server / SQLite / NoSQL (Google Cloud)', status: 'Experiente' },
      { index: '05', title: 'Outras: Java / C / C++', status: 'Intermediário' },
      { index: '06', title: 'Conceitos: Clean Arch / SOLID / MVVM / REST / DDD', status: 'Intermediário' },
      { index: '07', title: 'Ferramentas: Git / Docker / CI-CD', status: 'Intermediário' },
    ],
  },
  {
    id: 'iii',
    badge: 'III',
    title: 'PROJETOS',
    subtitle: 'Trabalhos em Destaque',
    rank: 5,
    rows: [
      { index: '01', title: 'Soliton - Acessibilidade 360°', status: 'Em Progresso' },
      { index: '02', title: 'Roadmap C# / .NET', status: 'Em Progresso' },
      { index: '03', title: 'Lola - Agente IA Conversacional', status: 'Em Progresso' },
      { index: '04', title: 'Financeiro Mobile (Flutter)', status: 'Em Progresso' },
      { index: '05', title: 'AYN Thor Manager', status: 'Em Progresso' },
    ],
  },
  {
    id: 'iv',
    badge: 'IV',
    title: 'EXPERIÊNCIA',
    subtitle: 'Empregos / Cargos',
    rank: 3,
    rows: [
      { index: '01', title: 'Dev Júnior - Alterdata Software', status: 'Ativo (ago/2025)' },
      { index: '02', title: 'Dev Trainee - Alterdata Software', status: 'Completo (jan-ago/2025)' },
      { index: '03', title: 'Residente - Serratec', status: 'Completo (mar-jul/2024)' },
    ],
  },
];
