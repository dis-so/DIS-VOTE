
import { Candidate } from './types';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: 'Eleanor Vance',
    votes: 452,
    image: 'https://picsum.photos/seed/eleanor/300/300',
    bio: 'Pioneering sustainable urban architecture with a focus on neon-integrated green spaces.'
  },
  {
    id: 'c2',
    name: 'Kaelen Thorne',
    votes: 389,
    image: 'https://picsum.photos/seed/kaelen/300/300',
    bio: 'Championing digital sovereignty and decentralized governance for the next generation.'
  },
  {
    id: 'c3',
    name: 'Sari Nakamoto',
    votes: 412,
    image: 'https://picsum.photos/seed/sari/300/300',
    bio: 'Bridging the gap between traditional industry and high-speed quantum logistics.'
  }
];

export const THEME_COLORS = {
  cyan: '#00f2ff',
  magenta: '#ff00e5',
  navy: '#0f172a'
};
