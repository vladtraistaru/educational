import type { Language } from '@/lib/language';

const translations: Record<Language, { title: string; description: string }> = {
  en: {
    title: 'Simple Circuits',
    description: 'Build simple electrical circuits and see what makes a bulb light up',
  },
  fr: {
    title: 'Circuits simples',
    description: 'Construis des circuits électriques simples et découvre ce qui fait briller une ampoule',
  },
};

export default translations;
