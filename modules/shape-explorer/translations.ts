import type { Language } from '@/lib/language';

interface ShapeText {
  name: string;
  realWorldExample: string;
  funFact: string;
}

export interface ShapeTranslations {
  side: string;
  sides: string;
  corner: string;
  corners: string;
  yes: string;
  no: string;
  allSidesEqual: string;
  realWorldExample: string;
  funFact: string;
  done: string;
  counting: string;
  countTheSides: string;
  curvedEdgeNote: string;
  shapes: Record<string, ShapeText>;
}

const translations: Record<Language, ShapeTranslations> = {
  en: {
    side: 'Side',
    sides: 'Sides',
    corner: 'Corner',
    corners: 'Corners',
    yes: 'Yes',
    no: 'No',
    allSidesEqual: 'All sides equal?',
    realWorldExample: 'Real-world example',
    funFact: 'Fun fact:',
    done: 'Done!',
    counting: 'Counting...',
    countTheSides: 'Count the sides!',
    curvedEdgeNote: 'This shape has 1 curved edge and 0 straight sides',
    shapes: {
      circle: { name: 'Circle', realWorldExample: 'Clock', funFact: 'A wheel is a circle \u2014 it rolls because every point on the edge is the same distance from the centre!' },
      oval: { name: 'Oval', realWorldExample: 'Egg', funFact: 'An egg is shaped like an oval. Ovals are like stretched circles!' },
      triangle: { name: 'Triangle', realWorldExample: 'Slice of pizza', funFact: 'Triangles are super strong! Builders use triangle shapes to hold up bridges and roofs.' },
      square: { name: 'Square', realWorldExample: 'Chessboard tile', funFact: 'A square is a special rectangle where all four sides are exactly the same length!' },
      rectangle: { name: 'Rectangle', realWorldExample: 'Door', funFact: 'Most books, doors, and phone screens are rectangle-shaped!' },
      pentagon: { name: 'Pentagon', realWorldExample: 'Pentagon building', funFact: 'The Pentagon building in America got its name because it has exactly 5 sides!' },
      hexagon: { name: 'Hexagon', realWorldExample: 'Honeycomb', funFact: 'Bees are great builders \u2014 they make their honeycombs with hexagons because they fit together perfectly!' },
      octagon: { name: 'Octagon', realWorldExample: 'Stop sign', funFact: 'Stop signs all over the world are octagons \u2014 8 sides make them easy to spot from any direction!' },
    },
  },
  fr: {
    side: 'Côté',
    sides: 'Côtés',
    corner: 'Coin',
    corners: 'Coins',
    yes: 'Oui',
    no: 'Non',
    allSidesEqual: 'Tous les côtés égaux ?',
    realWorldExample: 'Exemple concret',
    funFact: 'Le savais-tu ?',
    done: 'Fini !',
    counting: 'Comptage...',
    countTheSides: 'Compte les côtés !',
    curvedEdgeNote: 'Cette forme a 1 bord courbé et 0 côté droit',
    shapes: {
      circle: { name: 'Cercle', realWorldExample: 'Horloge', funFact: 'Une roue est un cercle \u2014 elle roule parce que chaque point du bord est à la même distance du centre !' },
      oval: { name: 'Ovale', realWorldExample: 'Œuf', funFact: 'Un œuf a la forme d\u2019un ovale. Les ovales sont des cercles étirés !' },
      triangle: { name: 'Triangle', realWorldExample: 'Part de pizza', funFact: 'Les triangles sont super solides ! Les constructeurs utilisent des triangles pour soutenir les ponts et les toits.' },
      square: { name: 'Carré', realWorldExample: 'Case d\u2019échiquier', funFact: 'Un carré est un rectangle spécial où les quatre côtés ont exactement la même longueur !' },
      rectangle: { name: 'Rectangle', realWorldExample: 'Porte', funFact: 'La plupart des livres, des portes et des écrans de téléphone sont en forme de rectangle !' },
      pentagon: { name: 'Pentagone', realWorldExample: 'Le Pentagone', funFact: 'Le bâtiment du Pentagone en Amérique tire son nom de ses 5 côtés !' },
      hexagon: { name: 'Hexagone', realWorldExample: 'Nid d\u2019abeille', funFact: 'Les abeilles sont de grandes bâtisseuses \u2014 elles construisent leurs alvéoles en hexagones car ils s\u2019emboîtent parfaitement !' },
      octagon: { name: 'Octogone', realWorldExample: 'Panneau stop', funFact: 'Les panneaux stop du monde entier sont des octogones \u2014 leurs 8 côtés les rendent faciles à repérer !' },
    },
  },
};

export default translations;
