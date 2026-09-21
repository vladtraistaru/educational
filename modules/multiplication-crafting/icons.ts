export type IconId =
  | 'glass'
  | 'obsidian'
  | 'netherStar'
  | 'milk'
  | 'sugar'
  | 'egg'
  | 'wheat'
  | 'gunpowder'
  | 'sand'
  | 'cake'
  | 'tnt'
  | 'beacon';

export interface PixelArt {
  /** One colour per letter; letters missing from the palette are transparent. */
  palette: Record<string, string>;
  /** 8 rows of 8 characters. */
  rows: string[];
}

/** Original 8x8 pixel art drawn for this project — no game textures are used. */
export const ICONS: Record<IconId, PixelArt> = {
  glass: {
    palette: { b: '#8ecae6', c: '#d7f0f7', w: '#ffffff' },
    rows: [
      'bbbbbbbb',
      'bwwccccb',
      'bwcccccb',
      'bcccccwb',
      'bccccwwb',
      'bcccccwb',
      'bccccccb',
      'bbbbbbbb',
    ],
  },
  obsidian: {
    palette: { d: '#1a1030', p: '#2e1f52', v: '#7a4fc4' },
    rows: [
      'dddddddd',
      'dpppdppd',
      'dpvpdpdd',
      'dppppppd',
      'ddpdpvpd',
      'dpppdppd',
      'dpvpppdd',
      'dddddddd',
    ],
  },
  netherStar: {
    palette: { w: '#ffffff', y: '#ffe066' },
    rows: [
      '...ww...',
      '...ww...',
      '..wyyw..',
      'wwyyyyww',
      '.wyyyyw.',
      '..wyyw..',
      '.ww..ww.',
      '.w....w.',
    ],
  },
  milk: {
    palette: { g: '#9aa0a6', h: '#c9ced3', m: '#ffffff' },
    rows: [
      '.gggggg.',
      'gmmmmmmg',
      '.gmmmmg.',
      '.ghhhhg.',
      '.ghhhhg.',
      '.ghhhhg.',
      '..gggg..',
      '........',
    ],
  },
  sugar: {
    palette: { w: '#ffffff', s: '#dfe6ee', k: '#c3ccd8' },
    rows: [
      '........',
      '...ww...',
      '..wwww..',
      '.wwwwsw.',
      '.wswwww.',
      'wwwwwwsw',
      'wswwkwww',
      'kkkkkkkk',
    ],
  },
  egg: {
    palette: { e: '#f1e3c8', b: '#d9c39a', s: '#fffaf0' },
    rows: [
      '...ee...',
      '..eeee..',
      '.eseeee.',
      '.eseeee.',
      '.eeeeeb.',
      '.eeeeeb.',
      '..ebbb..',
      '...bb...',
    ],
  },
  wheat: {
    palette: { y: '#e9b949', o: '#c98f1e', g: '#5b8c3a' },
    rows: [
      '...y..y.',
      '..yoy.yo',
      '..yy.yy.',
      '.yoyyoy.',
      '..yyoyy.',
      '...gg...',
      '...gg.g.',
      '..g.g.g.',
    ],
  },
  gunpowder: {
    palette: { a: '#6b6f76', d: '#3a3d42', l: '#9ea3ab' },
    rows: [
      '........',
      '...aa...',
      '..aalaa.',
      '.aaadaaa',
      '.alaaaal',
      'aaadaala',
      'aadaaaaa',
      'dddddddd',
    ],
  },
  sand: {
    palette: { s: '#e6d59a', t: '#d2bf80', l: '#f3e8b8' },
    rows: [
      'sstsslss',
      'tssslsts',
      'sslsstss',
      'stsssssl',
      'sssltsst',
      'lsstssts',
      'ssstslss',
      'tsslsstt',
    ],
  },
  cake: {
    palette: { w: '#fff8f0', r: '#e03a3a', c: '#c9853f', b: '#8b5a2b' },
    rows: [
      '...rr...',
      '...rr...',
      'wwwwwwww',
      'wwwwwwww',
      'rrrrrrrr',
      'cccccccc',
      'cbcbcbcb',
      'bbbbbbbb',
    ],
  },
  tnt: {
    palette: { r: '#d63a2f', d: '#a12a22', w: '#f4efe6', k: '#222222' },
    rows: [
      'rdrrrrdr',
      'rrrrrrrr',
      'wwwwwwww',
      'wkkwkkwk',
      'wwwwwwww',
      'rrrrrrrr',
      'rdrrrrdr',
      'rrrrrrrr',
    ],
  },
  beacon: {
    palette: {
      g: '#7fd6e6',
      w: '#eafcff',
      b: '#5be7ff',
      s: '#ffffff',
      o: '#1a1030',
      p: '#3a2860',
    },
    rows: [
      'gggggggg',
      'gwwwwwwg',
      'gwwbbwwg',
      'gwbsbbwg',
      'gwwbbwwg',
      'gwwwwwwg',
      'oopoopoo',
      'oooooooo',
    ],
  },
};
