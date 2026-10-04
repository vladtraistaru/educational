export type IconId = 'planks' | 'ironIngot' | 'book' | 'chest' | 'ironBlock' | 'bookshelf';

export interface PixelArt {
  /** One colour per letter; letters missing from the palette are transparent. */
  palette: Record<string, string>;
  /** 8 rows of 8 characters. */
  rows: string[];
}

/** Original 8x8 pixel art drawn for this project — no game textures are used. */
export const ICONS: Record<IconId, PixelArt> = {
  planks: {
    palette: { p: '#b8894f', d: '#7a5530' },
    rows: [
      'pppppppp',
      'pppdpppp',
      'dddddddd',
      'pppppdpp',
      'pppppppp',
      'dddddddd',
      'ppdppppp',
      'pppppppp',
    ],
  },
  ironIngot: {
    palette: { w: '#ffffff', l: '#d8d8d8', g: '#9a9a9a' },
    rows: [
      '........',
      '........',
      '..wwwww.',
      '.wlllllg',
      'wlllllgg',
      'gggggggg',
      '.ggggg..',
      '........',
    ],
  },
  book: {
    palette: { r: '#8b3a2b', y: '#e9b949', w: '#f4efe6' },
    rows: [
      '..rrrrr.',
      '.rrrrrrw',
      '.ryyrrrw',
      '.rrrrrrw',
      '.ryyrrrw',
      '.rrrrrrw',
      '.rrrrrrw',
      '..wwwww.',
    ],
  },
  chest: {
    palette: { d: '#5a3a1a', p: '#b8894f', k: '#3a2510', g: '#c9c9c9' },
    rows: [
      'dddddddd',
      'dppppppd',
      'dppppppd',
      'kkkggkkk',
      'dpppgppd',
      'dppppppd',
      'dppppppd',
      'dddddddd',
    ],
  },
  ironBlock: {
    palette: { w: '#ffffff', l: '#d8d8d8', g: '#9a9a9a' },
    rows: [
      'wwwwwwwg',
      'wllllllg',
      'wlwllllg',
      'wllllllg',
      'wlllllwg',
      'wllllllg',
      'wllllllg',
      'gggggggg',
    ],
  },
  bookshelf: {
    palette: {
      p: '#b8894f',
      d: '#5a3a1a',
      r: '#c0392b',
      b: '#2e6fb5',
      y: '#e9b949',
      g: '#3f8f4a',
    },
    rows: [
      'pppppppp',
      'dddddddd',
      'drbygrbd',
      'drbygrbd',
      'dddddddd',
      'dgrybrgd',
      'dgrybrgd',
      'pppppppp',
    ],
  },
};
