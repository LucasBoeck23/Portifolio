export interface MenuItem {
  id: string;
  label: string;
  page: string;
  fontSize: number;
  offsetX: number;
  offsetY: number;
  skewX: number;
  skewY: number;
  external?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'about', label: 'SOBRE MIM', page: '/about', fontSize: 80, offsetX: 0, offsetY: 0, skewX: -6, skewY: 10 },
  { id: 'resume', label: 'CURRÍCULO', page: '/resume', fontSize: 66, offsetX: 20, offsetY: 8, skewX: -11, skewY: -10 },
  { id: 'log', label: 'DIÁRIO DE BORDO', page: '/log', fontSize: 62, offsetX: 12, offsetY: 6, skewX: -4, skewY: -6 },
  { id: 'github', label: 'GITHUB', page: 'https://github.com/LucasBoeck23', fontSize: 68, offsetX: 8, offsetY: 6, skewX: 0, skewY: -4, external: true },
  { id: 'socials', label: 'CONTATO', page: '/socials', fontSize: 74, offsetX: 16, offsetY: 8, skewX: -3, skewY: 5 },
  { id: 'sideproj', label: 'PROJETOS', page: 'https://github.com/LucasBoeck23?tab=repositories', fontSize: 56, offsetX: 10, offsetY: 6, skewX: -4, skewY: 7, external: true },
];
