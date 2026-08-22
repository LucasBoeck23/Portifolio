import icon1 from '$assets/images/icon1.png';
import icon2 from '$assets/images/icon2.png';
import icon3 from '$assets/images/icon3.png';
import char1 from '$assets/images/char1.png';
import char2 from '$assets/images/char2.png';
import char3 from '$assets/images/char3.png';

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
  barIcon: string;
  character: string;
  role: { text: string; color: string };
  stats: SocialStat[];
  infoBars: SocialInfoBar[];
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'twitch',
    label: 'TWITCH',
    handle: '@yourname',
    href: 'https://twitch.tv/yourname',
    icon: '🎮',
    barIcon: '$assets/images/icon1.png',
    character: '$assets/images/char1.png',
    role: { text: 'LEADER', color: '#e8c100' },
    stats: [
      { tag: 'FOL', value: '1.2K', color: '#9147ff' },
      { tag: 'VWR', value: '042', color: '#bf94ff' },
    ],
    infoBars: [
      { link: 'twitch.tv/videos/2041837265', count: '56', isNew: true },
    ],
  },
  {
    id: 'instagram',
    label: 'INSTAGRAM',
    handle: '@yourhandle',
    href: 'https://instagram.com/yourhandle',
    icon: '📷',
    barIcon: '$assets/images/icon2.png',
    character: '$assets/images/char2.png',
    role: { text: 'PARTY', color: '#4a8fff' },
    stats: [
      { tag: 'FOL', value: '3.4K', color: '#e1306c' },
      { tag: 'PST', value: '128', color: '#f77737' },
    ],
    infoBars: [
      { link: 'instagram.com/p/C4xQmRrNk2a', count: '3.4M', isNew: false },
      { link: 'instagram.com/p/C3wLpBsOj7f', count: '2.5M', isNew: true },
      { link: 'instagram.com/reel/C2vKoArMi6e', count: '676K', isNew: true },
      { link: 'instagram.com/p/C1uJnZqLh5d', count: '412K', isNew: false },
      { link: 'instagram.com/reel/C0tImYpKg4c', count: '198K', isNew: false },
    ],
  },
  {
    id: 'tiktok',
    label: 'TIKTOK',
    handle: '@yourhandle',
    href: 'https://tiktok.com/@yourhandle',
    icon: '🎵',
    barIcon: '$assets/images/icon3.png',
    character: '$assets/images/char3.png',
    role: { text: 'PARTY', color: '#4a8fff' },
    stats: [
      { tag: 'FOL', value: '8.9K', color: '#00f2ea' },
      { tag: 'LKS', value: '52K', color: '#ff0050' },
    ],
    infoBars: [
      { link: 'tiktok.com/@yourhandle/video/7318492016374859054', count: '5.1M', isNew: true },
      { link: 'tiktok.com/@yourhandle/video/7305837261940183342', count: '3.7M', isNew: false },
      { link: 'tiktok.com/@yourhandle/video/7291046385720348974', count: '2.2M', isNew: false },
      { link: 'tiktok.com/@yourhandle/video/7278392047163820334', count: '1.4M', isNew: true },
      { link: 'tiktok.com/@yourhandle/video/7264819203847165742', count: '831K', isNew: false },
      { link: 'tiktok.com/@yourhandle/video/7251047382916430126', count: '490K', isNew: true },
      { link: 'tiktok.com/@yourhandle/video/7237294018463851822', count: '217K', isNew: true },
    ],
  },
];
