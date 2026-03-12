import type { Language } from '@/lib/language';

export interface PostulateText {
  title: string;
  description: string;
  hint: string;
}

export interface EuclideanTranslations {
  title: string;
  description: string;
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
    title: 'Geometry Rules',
    description: 'Discover the 5 basic rules that all shapes and lines follow',
    ruleOf: 'Rule {n} of {total}',
    previous: 'Previous',
    next: 'Next',
    postulates: [
      {
        title: 'The Straight Line Postulate',
        description: 'A straight line segment can be drawn joining any two points.',
        hint: 'Tap one dot, then tap another!',
      },
      {
        title: 'The Extension Postulate',
        description: 'Any straight line segment can be extended indefinitely in a straight line.',
        hint: 'Drag the handles to stretch the line.',
      },
      {
        title: 'The Circle Postulate',
        description: 'Given any point and any distance, a circle can be drawn with that centre and that radius.',
        hint: 'Click and drag to draw a circle.',
      },
      {
        title: 'The Right Angle Postulate',
        description: 'All right angles are equal to one another \u2014 each measuring exactly 90\u00B0.',
        hint: 'Press Compare to see them overlap!',
      },
      {
        title: 'The Parallel Postulate',
        description: 'Through a point not on a given line, exactly one line can be drawn parallel to it \u2014 and parallel lines never intersect.',
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
    title: 'Règles de Géométrie',
    description: 'Découvre les 5 règles de base que toutes les formes et lignes suivent',
    ruleOf: 'Règle {n} sur {total}',
    previous: 'Précédent',
    next: 'Suivant',
    postulates: [
      {
        title: 'Le postulat de la ligne droite',
        description: 'Un segment de droite peut être tracé entre deux points quelconques.',
        hint: 'Touche un point, puis un autre !',
      },
      {
        title: 'Le postulat de prolongement',
        description: 'Tout segment de droite peut être prolongé indéfiniment en une ligne droite.',
        hint: 'Glisse les poignées pour étirer la ligne.',
      },
      {
        title: 'Le postulat du cercle',
        description: 'Étant donné un point et une distance, on peut tracer un cercle de ce centre et de ce rayon.',
        hint: 'Clique et glisse pour dessiner un cercle.',
      },
      {
        title: 'Le postulat de l\u2019angle droit',
        description: 'Tous les angles droits sont égaux entre eux \u2014 chacun mesurant exactement 90\u00B0.',
        hint: 'Appuie sur Comparer pour les superposer !',
      },
      {
        title: 'Le postulat des parallèles',
        description: 'Par un point extérieur à une droite, on ne peut tracer qu\u2019une seule droite parallèle \u2014 et les droites parallèles ne se coupent jamais.',
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
