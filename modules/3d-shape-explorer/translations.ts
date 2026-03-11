import type { Language } from '@/lib/language';

interface Shape3DText {
  name: string;
  example: string;
}

export interface Shape3DTranslations {
  faces: string;
  edges: string;
  vertices: string;
  flat: string;
  curved: string;
  shapes: Record<string, Shape3DText>;
}

const translations: Record<Language, Shape3DTranslations> = {
  en: {
    faces: 'Faces',
    edges: 'Edges',
    vertices: 'Vertices',
    flat: 'flat',
    curved: 'curved',
    shapes: {
      cube: { name: 'Cube', example: 'A dice is a cube!' },
      cuboid: { name: 'Cuboid', example: 'A cereal box is a cuboid!' },
      sphere: { name: 'Sphere', example: 'A football is a sphere!' },
      cylinder: { name: 'Cylinder', example: 'A tin can is a cylinder!' },
      cone: { name: 'Cone', example: 'A party hat is a cone!' },
      'triangular-prism': { name: 'Triangular Prism', example: 'A tent can be a triangular prism!' },
      'square-pyramid': { name: 'Square Pyramid', example: 'The Egyptian pyramids are square pyramids!' },
    },
  },
  fr: {
    faces: 'Faces',
    edges: 'Arêtes',
    vertices: 'Sommets',
    flat: 'plates',
    curved: 'courbée',
    shapes: {
      cube: { name: 'Cube', example: 'Un dé est un cube !' },
      cuboid: { name: 'Pavé droit', example: 'Une boîte de céréales est un pavé droit !' },
      sphere: { name: 'Sphère', example: 'Un ballon de foot est une sphère !' },
      cylinder: { name: 'Cylindre', example: 'Une boîte de conserve est un cylindre !' },
      cone: { name: 'Cône', example: 'Un chapeau de fête est un cône !' },
      'triangular-prism': { name: 'Prisme triangulaire', example: 'Une tente peut être un prisme triangulaire !' },
      'square-pyramid': { name: 'Pyramide à base carrée', example: 'Les pyramides d\u2019Égypte sont des pyramides à base carrée !' },
    },
  },
};

export default translations;
