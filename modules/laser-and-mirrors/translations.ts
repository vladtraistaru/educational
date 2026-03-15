import type { Language } from '@/lib/language-config';

export interface OpticsTranslations {
  title: string;
  description: string;
  shine: string;
  turnOff: string;
  addMirror: string;
}

const translations: Record<Language, OpticsTranslations> = {
  en: {
    title: 'Laser and Mirrors',
    description: 'An introduction to light, reflection and refraction',
    shine: 'Shine',
    turnOff: 'Turn off',
    addMirror: 'Add mirror',
  },
  fr: {
    title: 'Laser et Miroirs',
    description: 'Une introduction à la lumière, la réflexion et la réfraction',
    shine: 'Allumer',
    turnOff: 'Éteindre',
    addMirror: 'Ajouter un miroir',
  },
};

export default translations;
