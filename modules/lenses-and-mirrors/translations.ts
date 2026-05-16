import type { Language } from '@/lib/language-config';

export interface LensesTranslations {
  title: string;
  description: string;
  addElement: string;
  convergingLens: string;
  divergingLens: string;
  concaveMirror: string;
  convexMirror: string;
  rayCount: string;
  focalLength: string;
  remove: string;
}

const translations: Record<Language, LensesTranslations> = {
  en: {
    title: 'Lenses and Curved Mirrors',
    description:
      'See how converging and diverging lenses and curved mirrors focus parallel rays of light',
    addElement: 'Add element',
    convergingLens: 'Converging lens',
    divergingLens: 'Diverging lens',
    concaveMirror: 'Concave mirror',
    convexMirror: 'Convex mirror',
    rayCount: 'Rays',
    focalLength: 'Focal',
    remove: 'Remove',
  },
  fr: {
    title: 'Lentilles et Miroirs Courbes',
    description:
      'Découvre comment les lentilles convergentes, divergentes et les miroirs courbes focalisent les rayons parallèles de lumière',
    addElement: 'Ajouter un élément',
    convergingLens: 'Lentille convergente',
    divergingLens: 'Lentille divergente',
    concaveMirror: 'Miroir concave',
    convexMirror: 'Miroir convexe',
    rayCount: 'Rayons',
    focalLength: 'Focale',
    remove: 'Supprimer',
  },
};

export default translations;
