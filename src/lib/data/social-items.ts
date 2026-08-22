import char1 from '$assets/images/char1.webp';
import char2 from '$assets/images/char2.webp';
import char3 from '$assets/images/char3.webp';

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
  href: string;
  icon: string;
  character: string;
  role: { text: string; color: string };
  stats: SocialStat[];
  infoBars: SocialInfoBar[];
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    handle: '@lucas-boeck',
    href: 'https://www.linkedin.com/in/lucas-boeck/',
    icon: '💼',
    character: char1,
    role: { text: 'LÍDER', color: '#e8c100' },
    stats: [
      { tag: 'CON', value: '500+', color: '#0a66c2' },
    ],
    infoBars: [
      { link: 'linkedin.com/in/lucas-boeck', count: '-', isNew: false },
    ],
  },
  {
    id: 'email',
    label: 'EMAIL',
    handle: 'boecklucas23@gmail.com',
    href: 'mailto:boecklucas23@gmail.com',
    icon: '📧',
    character: char2,
    role: { text: 'EQUIPE', color: '#4a8fff' },
    stats: [
      { tag: 'TIP', value: 'Gmail', color: '#ea4335' },
    ],
    infoBars: [
      { link: 'boecklucas23@gmail.com', count: '-', isNew: false },
    ],
  },
  {
    id: 'discord',
    label: 'DISCORD',
    handle: 'boeck_lucas',
    href: 'clipboard:boeck_lucas',
    icon: '🎮',
    character: char3,
    role: { text: 'EQUIPE', color: '#4a8fff' },
    stats: [
      { tag: 'USER', value: 'boeck_lucas', color: '#5865f2' },
    ],
    infoBars: [
      { link: 'discord: boeck_lucas', count: '-', isNew: false },
    ],
  },
];
