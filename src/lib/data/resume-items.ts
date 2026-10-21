/** Cor do selo de status: verde = atual/principal, amarelo = em andamento, cinza = passado/secundário */
export type ResumeTone = 'green' | 'yellow' | 'gray';

export interface ResumeRow {
  index: string;
  title: string;
  status: string;
  tone: ResumeTone;
  /** Uma linha de contexto: o que é, onde foi usado, o que foi feito */
  detail?: string;
  /** Link externo (repositório ou versão publicada) */
  link?: string;
}

export interface ResumeCategory {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  rows: ResumeRow[];
  /** Notas do bloco DETALHES; o bloco só aparece se houver notas */
  notes?: string[];
}

const GH = 'https://github.com/LucasBoeck23';

export const RESUME_CATEGORIES: ResumeCategory[] = [
  {
    id: 'i',
    badge: 'I',
    title: 'EDUCAÇÃO',
    subtitle: 'Formação Acadêmica',
    rows: [
      {
        index: '01',
        title: 'Tecnólogo em Tecnologia da Informação e Comunicação · FAETERJ Petrópolis',
        status: '2024 – 2027',
        tone: 'yellow',
        detail: 'Em andamento, conclusão prevista para 2027',
      },
      {
        index: '02',
        title: 'Residência em TIC / Software · Serratec',
        status: 'mar – jul/2024',
        tone: 'green',
        detail: 'Formação intensiva em desenvolvimento: APIs REST em Java, React e React Native',
      },
    ],
  },
  {
    id: 'ii',
    badge: 'II',
    title: 'HABILIDADES',
    subtitle: 'Stacks / Ferramentas / Conceitos',
    rows: [
      {
        index: '01',
        title: 'Backend: C# / .NET',
        status: 'Principal',
        tone: 'green',
        detail: 'Stack do dia a dia e do AYN Thor Manager (WPF)',
      },
      {
        index: '02',
        title: 'Front-end: TypeScript / Svelte / React / HTML / CSS',
        status: 'Principal',
        tone: 'green',
        detail: 'Este portfólio (Svelte 5) e projetos da residência (React)',
      },
      {
        index: '03',
        title: 'Banco de dados: SQL Server / PostgreSQL / SQLite / NoSQL (Google Cloud)',
        status: 'Principal',
        tone: 'green',
      },
      {
        index: '04',
        title: 'Ferramentas: Git / Docker / CI/CD com GitHub Actions',
        status: 'Principal',
        tone: 'green',
        detail: 'Deploy deste site automatizado com GitHub Actions',
      },
      {
        index: '05',
        title: 'Python',
        status: 'Projetos',
        tone: 'yellow',
        detail: 'Lola, assistente conversacional com IA',
      },
      {
        index: '06',
        title: 'Mobile: Flutter / Dart / React Native',
        status: 'Projetos',
        tone: 'yellow',
        detail: 'Financeiro Mobile e app final da residência',
      },
      {
        index: '07',
        title: 'Conceitos: Clean Architecture / SOLID / MVVM / REST / DDD',
        status: 'Projetos',
        tone: 'yellow',
      },
      {
        index: '08',
        title: 'Java / C / C++',
        status: 'Acadêmico',
        tone: 'gray',
        detail: 'Faculdade, APIs em Java na residência e Soliton (C)',
      },
    ],
    notes: [
      'PRINCIPAL: uso no dia a dia.',
      'PROJETOS: usado em projetos pessoais.',
      'ACADÊMICO: faculdade e cursos.',
    ],
  },
  {
    id: 'iii',
    badge: 'III',
    title: 'PROJETOS',
    subtitle: 'Trabalhos em Destaque',
    rows: [
      {
        index: '01',
        title: 'AYN Thor Manager',
        status: 'Em desenvolvimento',
        tone: 'yellow',
        detail: 'App desktop em C# / WPF que gerencia o AYN Thor pelo PC: espelhamento de tela (scrcpy), arquivos via ADB e app companion Android',
        link: `${GH}/Ayn-Thor-Manager`,
      },
      {
        index: '02',
        title: 'Lola',
        status: 'Em desenvolvimento',
        tone: 'yellow',
        detail: 'Assistente conversacional com IA em Python, com módulos de voz e emoção',
        link: `${GH}/Projeto-Lola`,
      },
      {
        index: '03',
        title: 'Soliton',
        status: 'Em desenvolvimento',
        tone: 'yellow',
        detail: 'Projeto de acessibilidade 360°, escrito em C',
        link: `${GH}/Soliton`,
      },
      {
        index: '04',
        title: 'Roadmap de estudos',
        status: 'No ar',
        tone: 'green',
        detail: 'Roadmap de estudos interativo com interface no estilo de uma IDE',
        link: 'https://lucasboeck23.github.io/roadmap/',
      },
      {
        index: '05',
        title: 'Este portfólio',
        status: 'No ar',
        tone: 'green',
        detail: 'SvelteKit estático no GitHub Pages, com deploy via GitHub Actions e Diário de Bordo atualizado toda semana',
        link: `${GH}/Portifolio`,
      },
      {
        index: '06',
        title: 'Financeiro Mobile',
        status: 'Estudo',
        tone: 'gray',
        detail: 'App Flutter de relatório de gastos',
        link: `${GH}/financeiro_mobile`,
      },
    ],
    notes: ['Clique no nome de um projeto para abrir o repositório ou a versão no ar.'],
  },
  {
    id: 'iv',
    badge: 'IV',
    title: 'EXPERIÊNCIA',
    subtitle: 'Empregos / Cargos',
    rows: [
      {
        index: '01',
        title: 'Desenvolvedor Full Stack Júnior · Alterdata Software',
        status: 'ago/2025 – atual',
        tone: 'green',
        detail: 'Desenvolvimento full stack com C# / .NET',
      },
      {
        index: '02',
        title: 'Trainee de Desenvolvimento · Alterdata Software',
        status: 'jan – ago/2025',
        tone: 'gray',
        detail: 'Programa de trainee, seguido de efetivação como Júnior',
      },
    ],
  },
];
