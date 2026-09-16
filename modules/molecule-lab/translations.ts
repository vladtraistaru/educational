import type { Language } from '@/lib/language-config';
import type { ElementSymbol } from '@/lib/science/chemistry';

export interface MoleculeLabTranslations {
  title: string;
  description: string;
  tabLab: string;
  tabMissions: string;
  elements: Record<ElementSymbol, string>;
  shelf: string;
  handsTip: string;
  bowl: string;
  bowlEmpty: string;
  bowlFull: string;
  removeHint: string;
  combine: string;
  clear: string;
  newDiscovery: string;
  whereInNature: string;
  funFact: string;
  almost: string;
  tryAdding: string;
  tryRemoving: string;
  noMatch: string;
  labBook: string;
  discovered: string;
  atomsNeeded: string;
  close: string;
  mission: string;
  of: string;
  whoAmI: string;
  missionDone: string;
  otherMolecule: string;
  otherMoleculeEnd: string;
  notYet: string;
  next: string;
  skip: string;
  finish: string;
  results: string;
  solvedSummary: string;
  playAgain: string;
}

const translations: Record<Language, MoleculeLabTranslations> = {
  en: {
    title: 'Molecule Lab',
    description:
      'Combine simple atoms like hydrogen, oxygen and sodium to build real molecules — water, salt, ozone, baking soda — and discover where you meet each one in nature',
    tabLab: '🧪 Free lab',
    tabMissions: '🗺️ Nature missions',
    elements: {
      H: 'Hydrogen', C: 'Carbon', N: 'Nitrogen', O: 'Oxygen',
      Na: 'Sodium', Cl: 'Chlorine', S: 'Sulfur',
    },
    shelf: 'Tap an atom to put it in the bowl',
    handsTip: 'Tip: the little dots are hands. Molecules are happy when every hand holds another hand!',
    bowl: 'Mixing bowl',
    bowlEmpty: 'Your bowl is empty. Add some atoms!',
    bowlFull: 'The bowl is full!',
    removeHint: 'Tap an atom in the bowl to take it out.',
    combine: 'Combine!',
    clear: 'Clear',
    newDiscovery: 'New discovery!',
    whereInNature: 'Where you find it',
    funFact: 'Fun fact',
    almost: 'So close!',
    tryAdding: 'Try adding',
    tryRemoving: 'Try taking out',
    noMatch: 'These atoms don’t make a molecule from our lab book. Try another mix!',
    labBook: 'Lab book',
    discovered: 'discovered',
    atomsNeeded: 'atoms',
    close: 'Close',
    mission: 'Mission',
    of: 'of',
    whoAmI: 'Who am I? Build me!',
    missionDone: 'Mission complete!',
    otherMolecule: 'You made',
    otherMoleculeEnd: '— not the one we’re looking for, but it goes in your lab book!',
    notYet: 'Not quite.',
    next: 'Next mission',
    skip: 'Skip',
    finish: 'See results',
    results: 'Missions finished!',
    solvedSummary: 'You solved {solved} of {total} missions.',
    playAgain: 'Play again',
  },
  fr: {
    title: 'Labo des molécules',
    description:
      'Assemble des atomes simples comme l’hydrogène, l’oxygène et le sodium pour construire de vraies molécules — eau, sel, ozone, bicarbonate — et découvre où on les trouve dans la nature',
    tabLab: '🧪 Labo libre',
    tabMissions: '🗺️ Missions nature',
    elements: {
      H: 'Hydrogène', C: 'Carbone', N: 'Azote', O: 'Oxygène',
      Na: 'Sodium', Cl: 'Chlore', S: 'Soufre',
    },
    shelf: 'Touche un atome pour le mettre dans le bol',
    handsTip: 'Astuce : les petits points sont des mains. Les molécules sont contentes quand chaque main tient une autre main !',
    bowl: 'Bol à mélange',
    bowlEmpty: 'Ton bol est vide. Ajoute des atomes !',
    bowlFull: 'Le bol est plein !',
    removeHint: 'Touche un atome du bol pour le retirer.',
    combine: 'Assembler !',
    clear: 'Vider',
    newDiscovery: 'Nouvelle découverte !',
    whereInNature: 'Où la trouver',
    funFact: 'Le savais-tu ?',
    almost: 'Presque !',
    tryAdding: 'Essaie d’ajouter',
    tryRemoving: 'Essaie de retirer',
    noMatch: 'Ces atomes ne forment pas une molécule de notre carnet. Essaie un autre mélange !',
    labBook: 'Carnet du labo',
    discovered: 'découvertes',
    atomsNeeded: 'atomes',
    close: 'Fermer',
    mission: 'Mission',
    of: 'sur',
    whoAmI: 'Qui suis-je ? Construis-moi !',
    missionDone: 'Mission réussie !',
    otherMolecule: 'Tu as fabriqué',
    otherMoleculeEnd: '— ce n’est pas celle qu’on cherche, mais elle va dans ton carnet !',
    notYet: 'Pas tout à fait.',
    next: 'Mission suivante',
    skip: 'Passer',
    finish: 'Voir les résultats',
    results: 'Missions terminées !',
    solvedSummary: 'Tu as réussi {solved} missions sur {total}.',
    playAgain: 'Rejouer',
  },
};

export default translations;
