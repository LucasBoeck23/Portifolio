export interface SocialStat {
  tag: string;
  value: string;
  color: string;
}

export interface SocialInfoBar {
  link: string;
  count: string;
  isNew: boolean;
}

export interface SocialPlatform {
  id: string;
  label: string;
  handle: string;
  /** http(s) abre em nova aba, mailto: abre o cliente de e-mail, clipboard: copia o handle */
  href: string;
  role: { text: string; color: string };
  /** Ação que o clique executa, exibida na barra */
  stats: SocialStat[];
  infoBars: SocialInfoBar[];
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    handle: 'lucas-boeck',
    href: 'https://www.linkedin.com/in/lucas-boeck/',
    role: { text: 'LÍDER', color: '#e8c100' },
    stats: [{ tag: 'ABRIR', value: 'Ver perfil', color: '#0a66c2' }],
    infoBars: [{ link: 'linkedin.com/in/lucas-boeck', count: '-', isNew: false }],
  },
  {
    id: 'email',
    label: 'E-MAIL',
    handle: 'boecklucas23@gmail.com',
    href: 'mailto:boecklucas23@gmail.com',
    role: { text: 'EQUIPE', color: '#4a8fff' },
    stats: [{ tag: 'MAIL', value: 'Enviar', color: '#ea4335' }],
    infoBars: [{ link: 'boecklucas23@gmail.com', count: '-', isNew: false }],
  },
  {
    id: 'github',
    label: 'GITHUB',
    handle: 'LucasBoeck23',
    href: 'https://github.com/LucasBoeck23',
    role: { text: 'EQUIPE', color: '#4a8fff' },
    stats: [{ tag: 'ABRIR', value: 'Ver código', color: '#8b949e' }],
    infoBars: [{ link: 'github.com/LucasBoeck23', count: '-', isNew: false }],
  },
];
