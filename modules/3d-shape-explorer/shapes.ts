export interface Shape3D {
  id: string;
  name: string;
  flatFaces: number;
  curvedSurfaces: number;
  edges: number;
  vertices: number;
  color: string;
  example: string;
}

export const shapes: Shape3D[] = [
  {
    id: 'cube',
    name: 'Cube',
    flatFaces: 6,
    curvedSurfaces: 0,
    edges: 12,
    vertices: 8,
    color: '#74b9ff',
    example: 'A dice is a cube!',
  },
  {
    id: 'cuboid',
    name: 'Cuboid',
    flatFaces: 6,
    curvedSurfaces: 0,
    edges: 12,
    vertices: 8,
    color: '#a29bfe',
    example: 'A cereal box is a cuboid!',
  },
  {
    id: 'sphere',
    name: 'Sphere',
    flatFaces: 0,
    curvedSurfaces: 1,
    edges: 0,
    vertices: 0,
    color: '#fd79a8',
    example: 'A football is a sphere!',
  },
  {
    id: 'cylinder',
    name: 'Cylinder',
    flatFaces: 2,
    curvedSurfaces: 1,
    edges: 2,
    vertices: 0,
    color: '#00cec9',
    example: 'A tin can is a cylinder!',
  },
  {
    id: 'cone',
    name: 'Cone',
    flatFaces: 1,
    curvedSurfaces: 1,
    edges: 1,
    vertices: 1,
    color: '#ffeaa7',
    example: 'A party hat is a cone!',
  },
  {
    id: 'triangular-prism',
    name: 'Triangular Prism',
    flatFaces: 5,
    curvedSurfaces: 0,
    edges: 9,
    vertices: 6,
    color: '#55efc4',
    example: 'A tent can be a triangular prism!',
  },
  {
    id: 'square-pyramid',
    name: 'Square Pyramid',
    flatFaces: 5,
    curvedSurfaces: 0,
    edges: 8,
    vertices: 5,
    color: '#fab1a0',
    example: 'The Egyptian pyramids are square pyramids!',
  },
];
