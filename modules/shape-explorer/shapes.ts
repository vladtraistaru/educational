export interface Shape {
  id: string;
  name: string;
  sides: number;
  corners: number;
  regular: boolean;
  color: string;
  vertices: [number, number][];
  realWorldExample: string;
  realWorldEmoji: string;
  funFact: string;
}

export const shapes: Shape[] = [
  {
    id: 'circle',
    name: 'Circle',
    sides: 0,
    corners: 0,
    regular: true,
    color: '#FF6B6B',
    vertices: [],
    realWorldExample: 'Clock',
    realWorldEmoji: '\u{1F550}',
    funFact:
      'A wheel is a circle \u2014 it rolls because every point on the edge is the same distance from the centre!',
  },
  {
    id: 'oval',
    name: 'Oval',
    sides: 0,
    corners: 0,
    regular: false,
    color: '#FF9FF3',
    vertices: [],
    realWorldExample: 'Egg',
    realWorldEmoji: '\u{1F95A}',
    funFact: 'An egg is shaped like an oval. Ovals are like stretched circles!',
  },
  {
    id: 'triangle',
    name: 'Triangle',
    sides: 3,
    corners: 3,
    regular: true,
    color: '#FECA57',
    vertices: [
      [100, 15],
      [173.6, 142.5],
      [26.4, 142.5],
    ],
    realWorldExample: 'Slice of pizza',
    realWorldEmoji: '\u{1F355}',
    funFact:
      'Triangles are super strong! Builders use triangle shapes to hold up bridges and roofs.',
  },
  {
    id: 'square',
    name: 'Square',
    sides: 4,
    corners: 4,
    regular: true,
    color: '#54A0FF',
    vertices: [
      [30, 30],
      [170, 30],
      [170, 170],
      [30, 170],
    ],
    realWorldExample: 'Chessboard tile',
    realWorldEmoji: '\u265F\uFE0F',
    funFact:
      'A square is a special rectangle where all four sides are exactly the same length!',
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    sides: 4,
    corners: 4,
    regular: false,
    color: '#5F27CD',
    vertices: [
      [20, 45],
      [180, 45],
      [180, 155],
      [20, 155],
    ],
    realWorldExample: 'Door',
    realWorldEmoji: '\u{1F6AA}',
    funFact: 'Most books, doors, and phone screens are rectangle-shaped!',
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    sides: 5,
    corners: 5,
    regular: true,
    color: '#00D2D3',
    vertices: [
      [100, 18],
      [178, 74.7],
      [148.2, 166.3],
      [51.8, 166.3],
      [22, 74.7],
    ],
    realWorldExample: 'Pentagon building',
    realWorldEmoji: '\u{1F3DB}\uFE0F',
    funFact:
      'The Pentagon building in America got its name because it has exactly 5 sides!',
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    sides: 6,
    corners: 6,
    regular: true,
    color: '#FF9F43',
    vertices: [
      [100, 18],
      [171, 59],
      [171, 141],
      [100, 182],
      [29, 141],
      [29, 59],
    ],
    realWorldExample: 'Honeycomb',
    realWorldEmoji: '\u{1F36F}',
    funFact:
      'Bees are great builders \u2014 they make their honeycombs with hexagons because they fit together perfectly!',
  },
  {
    id: 'octagon',
    name: 'Octagon',
    sides: 8,
    corners: 8,
    regular: true,
    color: '#10AC84',
    vertices: [
      [100, 18],
      [158, 42],
      [182, 100],
      [158, 158],
      [100, 182],
      [42, 158],
      [18, 100],
      [42, 42],
    ],
    realWorldExample: 'Stop sign',
    realWorldEmoji: '\u{1F6D1}',
    funFact:
      'Stop signs all over the world are octagons \u2014 8 sides make them easy to spot from any direction!',
  },
];
