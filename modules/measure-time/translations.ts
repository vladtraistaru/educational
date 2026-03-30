import type { Language } from '@/lib/language-config';

export interface MeasureTimeTranslations {
  title: string;
  description: string;
  exerciseLabel: string;
  levelLabel: string;
  levels: Record<'60' | '30' | '15' | '5', string>;
  analogToDigital: string;
  digitalToAnalog: string;
  setClock: string;
  duration: string;
  beforeAfter: string;
  nextQuestion: string;
  check: string;
  correct: string;
  wrong: string;
  whichDigital: string;
  whichClock: string;
  setTheClockTo: string;
  durationPrompt: string;
  whichHappensFirst: string;
  pickerHour: string;
  pickerMinute: string;
}

const translations: Record<Language, MeasureTimeTranslations> = {
  en: {
    title: 'Measure Time',
    description:
      'Read analog and digital clocks, set the time, work out how long, and put events in order',
    exerciseLabel: 'Activity',
    levelLabel: 'Step',
    levels: {
      '60': 'Hours only',
      '30': 'Half hours',
      '15': 'Quarter hours',
      '5': 'Five minutes',
    },
    analogToDigital: 'Clock to digital',
    digitalToAnalog: 'Digital to clock',
    setClock: 'Set the clock',
    duration: 'How long?',
    beforeAfter: 'What happens first?',
    nextQuestion: 'Next',
    check: 'Check',
    correct: 'Correct!',
    wrong: 'Not quite — try the next one.',
    whichDigital: 'What time is shown?',
    whichClock: 'Which clock shows this time?',
    setTheClockTo: 'Set the clock to',
    durationPrompt: 'How much time passes?',
    whichHappensFirst: 'Which happens first?',
    pickerHour: 'Hour',
    pickerMinute: 'Minute',
  },
  fr: {
    title: 'Lire l’heure',
    description:
      'Lire l’horloge et le digital, régler l’heure, calculer une durée et ordonner des moments',
    exerciseLabel: 'Activité',
    levelLabel: 'Précision',
    levels: {
      '60': 'Heures entières',
      '30': 'Demi-heures',
      '15': 'Quarts d’heure',
      '5': 'Cinq minutes',
    },
    analogToDigital: 'Horloge → digital',
    digitalToAnalog: 'Digital → horloge',
    setClock: 'Régler l’horloge',
    duration: 'Combien de temps ?',
    beforeAfter: 'Qu’est-ce qui est avant ?',
    nextQuestion: 'Suivant',
    check: 'Vérifier',
    correct: 'Bravo !',
    wrong: 'Pas tout à fait — essaie la suivante.',
    whichDigital: 'Quelle heure est-il ?',
    whichClock: 'Quelle horloge montre cette heure ?',
    setTheClockTo: 'Règle l’horloge sur',
    durationPrompt: 'Combien de temps s’écoule ?',
    whichHappensFirst: 'Qu’est-ce qui arrive en premier ?',
    pickerHour: 'Heure',
    pickerMinute: 'Minutes',
  },
};

export default translations;
