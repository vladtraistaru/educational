import type { Language } from '@/lib/language';

export interface NumberScaleTranslations {
  title: string;
  description: string;
  scale: string;
  addMarker: string;
  remove: string;
  reset: string;
  segments: string;
  part: string;
}

const translations: Record<Language, NumberScaleTranslations> = {
  en: {
    title: 'Number Scale Explorer',
    description: 'Drag markers on a number line to explore how numbers split into parts',
    scale: 'Scale:',
    addMarker: 'Add Marker',
    remove: 'Remove',
    reset: 'Reset',
    segments: 'Segments',
    part: 'Part',
  },
  fr: {
    title: 'Explorateur de Graduations',
    description: 'Glisse des repères sur une ligne pour découvrir comment les nombres se décomposent',
    scale: 'Échelle :',
    addMarker: 'Ajouter',
    remove: 'Retirer',
    reset: 'Réinitialiser',
    segments: 'Segments',
    part: 'Partie',
  },
};

export default translations;
