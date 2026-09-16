import type { Language } from '@/lib/language';

export interface DivisionTranslations {
  title: string;
  description: string;
  modeShare: string;
  modeGroup: string;
  easy: string;
  harder: string;
  sharePrompt: string;
  groupPrompt: string;
  shareHint: string;
  groupHint: string;
  dealOne: string;
  check: string;
  next: string;
  pile: string;
  plate: string;
  bag: string;
  bags: string;
  takeBack: string;
  remainder: string;
  correct: string;
  groupCorrect: string;
  unequal: string;
  giveMore: string;
  moreBag: string;
  streak: string;
}

const translations: Record<Language, DivisionTranslations> = {
  en: {
    title: 'Division Sharing',
    description: 'Share things fairly and make equal groups to discover division',
    modeShare: 'Share fairly',
    modeGroup: 'Make groups',
    easy: 'Easy',
    harder: 'Harder',
    sharePrompt: 'Share {n} {items} fairly between {d} plates.',
    groupPrompt: 'Put {n} {items} into bags of {d}. How many bags?',
    shareHint: 'Tap a plate to give it one. Tap an item on a plate to put it back.',
    groupHint: 'Tap items to fill a bag. Tap a closed bag to open it.',
    dealOne: 'Deal one each',
    check: 'Check',
    next: 'Next',
    pile: 'Pile',
    plate: 'Plate',
    bag: 'Bag',
    bags: 'Bags:',
    takeBack: 'Put back',
    remainder: 'remainder',
    correct: 'Well done — that is fair!',
    groupCorrect: 'Well done — no more bags can be made!',
    unequal: "The plates don't have the same number.",
    giveMore: 'You can still give one more to every plate.',
    moreBag: 'You can still make another bag.',
    streak: 'Correct in a row:',
  },
  fr: {
    title: 'Partage et division',
    description: 'Partage équitablement et fais des groupes égaux pour découvrir la division',
    modeShare: 'Partager',
    modeGroup: 'Faire des groupes',
    easy: 'Facile',
    harder: 'Plus dur',
    sharePrompt: 'Partage {n} {items} équitablement entre {d} assiettes.',
    groupPrompt: 'Mets {n} {items} dans des sachets de {d}. Combien de sachets ?',
    shareHint: 'Touche une assiette pour lui en donner un. Touche un objet sur une assiette pour le remettre.',
    groupHint: 'Touche les objets pour remplir un sachet. Touche un sachet fermé pour l’ouvrir.',
    dealOne: 'Un à chacun',
    check: 'Vérifier',
    next: 'Suivant',
    pile: 'Tas',
    plate: 'Assiette',
    bag: 'Sachet',
    bags: 'Sachets :',
    takeBack: 'Remettre',
    remainder: 'reste',
    correct: 'Bravo, c’est équitable !',
    groupCorrect: 'Bravo, on ne peut plus faire de sachet !',
    unequal: 'Les assiettes n’ont pas le même nombre.',
    giveMore: 'Tu peux encore en donner un de plus à chaque assiette.',
    moreBag: 'Tu peux encore faire un autre sachet.',
    streak: 'Réussites de suite :',
  },
};

export default translations;
