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
        'Desenvolvedor Full Stack na Alterdata Software, em Petrópolis - RJ',
        'Trabalho de ponta a ponta: backend em C# / .NET, front-end e banco de dados',
        'Meu foco é backend: regras de negócio, APIs e modelagem de dados',
      ],
      lower: 'backend first',
    },
    portrait: mainm,
  },
  {
    id: 'accessibility',
    label: 'ACESSIBILIDADE',
    role: { text: 'EQUIPE', color: '#4a8fff' },
    character: char2,
    revealContent: {
      upper: [
        'Sou daltônico, então acessibilidade pra mim é requisito, não detalhe',
        'Nunca deixo só a cor passar informação: contraste, texto e ícone juntos',
        'É o tema do Soliton, meu projeto de acessibilidade em desenvolvimento',
      ],
      lower: 'acessível por padrão',
    },
    portrait: mainm2,
  },
  {
    id: 'performance',
    label: 'PERFORMANCE',
    role: { text: 'EQUIPE', color: '#4a8fff' },
    character: char3,
    revealContent: {
      upper: [
        'Pra mim, lentidão é bug',
        'Neste site: vídeos de fundo com menos de 1 MB, fontes locais e áudio sob demanda',
        'No trabalho, tempo de resposta e consulta ao banco entram na definição de pronto',
      ],
      lower: 'rápido por padrão',
    },
    portrait: mainf,
  },
];
