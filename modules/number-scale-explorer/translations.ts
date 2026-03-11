import type { Language } from '@/lib/language';

const translations: Record<Language, Record<string, string>> = {
  en: {
    scale: 'Scale:',
    addMarker: 'Add Marker',
    remove: 'Remove',
    reset: 'Reset',
    segments: 'Segments',
    part: 'Part',
  },
  fr: {
    scale: 'Échelle :',
    addMarker: 'Ajouter',
    remove: 'Retirer',
    reset: 'Réinitialiser',
    segments: 'Segments',
    part: 'Partie',
  },
};

export default translations;
