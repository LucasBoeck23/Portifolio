import char1 from '$assets/images/char1.webp';
import char2 from '$assets/images/char2.webp';
import char3 from '$assets/images/char3.webp';
import mainm from '$assets/images/mainm.webp';
import mainm2 from '$assets/images/mainm2.webp';
import mainf from '$assets/images/mainf.webp';

export interface AboutItem {
  id: string;
  label: string;
  role: { text: string; color: string };
  character: string;
  revealContent: {
    upper: string[];
    lower: string;
  };
  portrait: string;
}

export const ABOUT_ITEMS: AboutItem[] = [
  {
    id: 'about-me',
    label: 'SOBRE MIM',
    role: { text: 'LÍDER', color: '#e8c100' },
    character: char1,
    revealContent: {
      upper: [
        `Meu nome é Lucas Boeck, tenho ${(() => { const b = new Date(2005, 7, 23); const t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; })()} anos`,
        'Resido na cidade de Petrópolis - RJ',
        'Atuo como desenvolvedor Full Stack na Alterdata Software',
      ],
      lower: 'dev full stack',
    },
    portrait: mainm,
  },
  {
    id: 'fun-fact',
    label: 'FATOS ENGRAÇADOS',
    role: { text: 'EQUIPE', color: '#4a8fff' },
    character: char2,
    revealContent: {
      upper: [
        'Sou daltônico e faço frontend... se as cores tão estranhas, desculpa',
        'Mas por mais que eu goste de front, meu coração é do backend',
        'Irônico né? O cara que não enxerga cor direito faz UI',
      ],
      lower: 'confia no processo',
    },
    portrait: mainm2,
  },
  {
    id: 'curious-fact',
    label: 'FATOS CURIOSOS',
    role: { text: 'EQUIPE', color: '#4a8fff' },
    character: char3,
    revealContent: {
      upper: [
        'Particularmente sou muito chato com performance kkkkk',
        'Não consigo ter paciência quando vejo sites ou sistemas que são lentos ou travam',
        'Acho que você já deve ter percebido pela fluidez deste site',
      ],
      lower: 'obsessão por performance',
    },
    portrait: mainf,
  },
];
