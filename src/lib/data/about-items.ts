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
    label: 'ABOUT ME',
    role: { text: 'LEADER', color: '#e8c100' },
    character: char1,
    revealContent: {
      upper: ['name moneybagg', 'age:23'],
      lower: 'major: computer science',
    },
    portrait: mainm,
  },
  {
    id: 'fun-fact',
    label: 'FUN FACT ABOUT ME',
    role: { text: 'PARTY', color: '#4a8fff' },
    character: char2,
    revealContent: {
      upper: [
        'Cleopatra lived closer to the Moon landing than to the building of the pyramids.',
        'Vikings kept cats on ships for pest control (and vibes).',
        'In medieval Europe, animals could be put on trial for crimes',
      ],
      lower: 'abbove is some history fun fact',
    },
    portrait: mainm2,
  },
  {
    id: 'wired-fact',
    label: 'WIRED FACT ABOUT ME',
    role: { text: 'PARTY', color: '#4a8fff' },
    character: char3,
    revealContent: {
      upper: [
        'Oxford University founding is older than the Aztec Empire.',
        'The shortest war in history lasted 38–45 minutes (Britain vs Zanzibar).',
        'Humans have been writing for ~5,000 years',
      ],
      lower: 'yes it\'s a place holder',
    },
    portrait: mainf,
  },
];
