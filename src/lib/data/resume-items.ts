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
    title: 'EDUCATION',
    subtitle: 'University / Coursework',
    rank: 3,
    rows: [
      { index: '01', title: 'General Education', status: 'Complete' },
      { index: '02', title: 'Computer Science Core', status: 'In Progress' },
      { index: '03', title: 'Elective Track', status: 'Queued' },
      { index: '04', title: 'Capstone Prep', status: 'Pending' },
    ],
  },
  {
    id: 'ii',
    badge: 'II',
    title: 'SKILLS',
    subtitle: 'Frontend / Design / UI',
    rank: 4,
    rows: [
      { index: '01', title: 'HTML / CSS / JS', status: 'Complete' },
      { index: '02', title: 'React / Svelte', status: 'Complete' },
      { index: '03', title: 'UI/UX Design', status: 'In Progress' },
      { index: '04', title: 'Animation & Motion', status: 'In Progress' },
    ],
  },
  {
    id: 'iii',
    badge: 'III',
    title: 'PROJECTS',
    subtitle: 'Featured Work',
    rank: 5,
    rows: [
      { index: '01', title: 'Persona 3 Portfolio', status: 'Active' },
      { index: '02', title: 'E-commerce Dashboard', status: 'Complete' },
      { index: '03', title: 'Chat Application', status: 'Complete' },
      { index: '04', title: 'Game Prototype', status: 'In Progress' },
    ],
  },
  {
    id: 'iv',
    badge: 'IV',
    title: 'EXPERIENCE',
    subtitle: 'Internships / Roles',
    rank: 2,
    rows: [
      { index: '01', title: 'Frontend Intern', status: 'Complete' },
      { index: '02', title: 'Freelance Developer', status: 'Active' },
      { index: '03', title: 'Open Source Contributor', status: 'Active' },
      { index: '04', title: 'Teaching Assistant', status: 'Pending' },
    ],
  },
];
