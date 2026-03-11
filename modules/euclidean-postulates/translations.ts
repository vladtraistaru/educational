import type { Language } from '@/lib/language';

export interface PostulateText {
  title: string;
  description: string;
  hint: string;
}

export interface EuclideanTranslations {
  ruleOf: string;
  previous: string;
  next: string;
  postulates: PostulateText[];
  allMatch: string;
  scatter: string;
  compare: string;
  clear: string;
  clickAndDrag: string;
  dragHandles: string;
  lineKeepsGoing: string;
  sameGap: string;
  extend: string;
  neverTouch: string;
}

const translations: Record<Language, EuclideanTranslations> = {
  en: {
    ruleOf: 'Rule {n} of {total}',
    previous: 'Previous',
    next: 'Next',
    postulates: [
      {
        title: 'Connect Any Two Dots',
        description: 'You can always draw a straight line between any two dots.',
        hint: 'Tap one dot, then tap another!',
      },
      {
        title: 'Lines Go On Forever',
        description: 'A line can always be made longer \u2014 it never has to stop!',
        hint: 'Drag the handles to stretch the line.',
      },
      {
        title: 'Perfect Circles',
        description: 'Pick any dot and any size \u2014 you can always draw a perfect circle.',
        hint: 'Click and drag to draw a circle.',
      },
      {
        title: 'Right Angles Are Always Equal',
        description: 'Every L-shaped corner is exactly the same size \u2014 always 90\u00B0.',
        hint: 'Press Compare to see them overlap!',
      },
      {
        title: 'Parallel Lines Never Meet',
        description: 'Some lines run side by side and never cross, no matter how far they go.',
        hint: 'Press Extend to see them grow!',
      },
    ],
    allMatch: 'They all match perfectly!',
    scatter: 'Scatter',
    compare: 'Compare!',
    clear: 'Clear',
    clickAndDrag: 'Click and drag to draw a circle',
    dragHandles: 'Drag the handles to extend the line',
    lineKeepsGoing: 'The line keeps going!',
    sameGap: 'Same gap everywhere',
    extend: 'Extend!',
    neverTouch: 'They never touch!',
  },
  fr: {
    ruleOf: 'Règle {n} sur {total}',
    previous: 'Précédent',
    next: 'Suivant',
    postulates: [
      {
        title: 'Relier deux points',
        description: 'On peut toujours tracer une ligne droite entre deux points.',
        hint: 'Touche un point, puis un autre !',
      },
      {
        title: 'Les lignes n\u2019ont pas de fin',
        description: 'Une ligne peut toujours être prolongée \u2014 elle ne s\u2019arrête jamais !',
        hint: 'Glisse les poignées pour étirer la ligne.',
      },
      {
        title: 'Cercles parfaits',
        description: 'Choisis un point et une taille \u2014 tu peux toujours tracer un cercle parfait.',
        hint: 'Clique et glisse pour dessiner un cercle.',
      },
      {
        title: 'Les angles droits sont toujours égaux',
        description: 'Chaque coin en L a exactement la même taille \u2014 toujours 90\u00B0.',
        hint: 'Appuie sur Comparer pour les superposer !',
      },
      {
        title: 'Les lignes parallèles ne se rencontrent jamais',
        description: 'Certaines lignes vont côte à côte et ne se croisent jamais, même très loin.',
        hint: 'Appuie sur Prolonger pour les voir grandir !',
      },
    ],
    allMatch: 'Ils correspondent tous parfaitement !',
    scatter: 'Éparpiller',
    compare: 'Comparer !',
    clear: 'Effacer',
    clickAndDrag: 'Clique et glisse pour dessiner un cercle',
    dragHandles: 'Glisse les poignées pour prolonger la ligne',
    lineKeepsGoing: 'La ligne continue !',
    sameGap: 'Même écart partout',
    extend: 'Prolonger !',
    neverTouch: 'Elles ne se touchent jamais !',
  },
};

export default translations;
