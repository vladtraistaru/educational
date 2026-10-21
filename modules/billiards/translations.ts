import type { Language } from '@/lib/language-config';
import type { Surface } from './physics';

export type NoteKey = 'nice' | 'miss' | 'scratch' | 'bomb' | 'outOfShots';

export interface LevelText {
  title: string;
  idea: string;
}

export interface BilliardsTranslations {
  title: string;
  description: string;
  bigIdea: string;
  bigIdeaDetail: string;
  howTo: string;
  missions: string;
  freePlay: string;
  menu: string;
  level: string;
  of: string;
  goalOne: string;
  goalMany: string;
  avoidBomb: string;
  shotsLeft: string;
  physicsIdea: string;
  notes: Record<NoteKey, string>;
  solved: string;
  restart: string;
  tryAgain: string;
  next: string;
  finish: string;
  results: string;
  starsEarned: string;
  levelsSolved: string;
  playAgain: string;
  surface: string;
  surfaces: Record<Surface, string>;
  guide: string;
  newRack: string;
  shots: string;
  sunk: string;
  tableLabel: string;
  levels: Record<string, LevelText>;
}

const translations: Record<Language, BilliardsTranslations> = {
  en: {
    title: 'Billiards',
    description:
      'Play pool and discover the physics of collisions: bounce off cushions, pass on momentum, and see what happens when heavy and light balls crash',
    bigIdea: 'Bounce, bump, roll!',
    bigIdeaDetail:
      'Every ball keeps rolling straight until something stops it. Learn the rules of bounces and crashes, and use them to sink every ball.',
    howTo:
      'Press on the table and pull away from the white ball, like a slingshot. The further you pull, the harder the shot. Let go to shoot!',
    missions: 'Missions',
    freePlay: 'Free play',
    menu: 'Menu',
    level: 'Mission',
    of: 'of',
    goalOne: 'Sink the ball.',
    goalMany: 'Sink {n} balls.',
    avoidBomb: 'Don’t sink the bomb!',
    shotsLeft: 'Shots left',
    physicsIdea: 'Physics idea',
    notes: {
      nice: 'Nice shot!',
      miss: 'Missed — look at the trails and try another angle.',
      scratch: 'Oops, the white ball fell in! It goes back to its spot.',
      bomb: 'Boom! You sank the bomb.',
      outOfShots: 'Out of shots.',
    },
    solved: 'Mission complete!',
    restart: 'Restart',
    tryAgain: 'Try again',
    next: 'Next mission',
    finish: 'See results',
    results: 'All missions done!',
    starsEarned: 'Stars',
    levelsSolved: 'Missions solved',
    playAgain: 'Play again',
    surface: 'Table',
    surfaces: { felt: 'Felt', ice: 'Ice', sand: 'Sand' },
    guide: 'Guide line',
    newRack: 'New rack',
    shots: 'Shots',
    sunk: 'Sunk',
    tableLabel: 'Pool table',
    levels: {
      straight: {
        title: 'Straight in',
        idea: 'A rolling ball goes in a straight line until something stops it. Hit the ball right in the middle and it goes straight ahead.',
      },
      stop: {
        title: 'Stop shot',
        idea: 'When a ball hits an equal ball head-on, it stops dead and the other ball takes all its speed. That push is called momentum: it is passed on, like in a Newton’s cradle.',
      },
      bank: {
        title: 'Bank shot',
        idea: 'The post blocks the way, so bounce off a cushion. The angle out equals the angle in, just like light on a mirror.',
      },
      cut: {
        title: 'Right angle',
        idea: 'Hit the ball on its side. After a glancing hit, two equal balls always fly apart at a right angle (90°). Watch the two arrows!',
      },
      heavy: {
        title: 'Steel ball',
        idea: 'This ball is three times heavier. It moves slowly when hit, and the white ball bounces back. You need a harder shot!',
      },
      light: {
        title: 'Feather ball',
        idea: 'This ball is very light. It shoots off faster than the white ball arrived, and the white ball keeps rolling forward. Careful it doesn’t follow!',
      },
      double: {
        title: 'Two in a row',
        idea: 'Plan two shots. After the first, think about where the white ball will stop, so the next shot is easy.',
      },
      posts: {
        title: 'Pinball',
        idea: 'Posts bounce balls too, and the bounce depends on where the ball hits the round post. Use the guide to plan the path.',
      },
      bomb: {
        title: 'Bomb squad',
        idea: 'The bomb guards the corner. Pick a different pocket and watch where your other balls will roll after the hit.',
      },
      break: {
        title: 'The break',
        idea: 'A hard hit on the front ball spreads the energy through the whole pack. Balls fly off in every direction!',
      },
    },
  },
  fr: {
    title: 'Billard',
    description:
      'Joue au billard et découvre la physique des chocs : rebondis sur les bandes, transmets l’élan, et vois ce qui se passe quand des boules lourdes et légères se percutent',
    bigIdea: 'Rebondis, cogne, roule !',
    bigIdeaDetail:
      'Une boule roule tout droit jusqu’à ce que quelque chose l’arrête. Apprends les règles des rebonds et des chocs, et utilise-les pour rentrer toutes les boules.',
    howTo:
      'Appuie sur la table et tire en t’éloignant de la boule blanche, comme un lance-pierre. Plus tu tires loin, plus le coup est fort. Lâche pour tirer !',
    missions: 'Missions',
    freePlay: 'Jeu libre',
    menu: 'Menu',
    level: 'Mission',
    of: 'sur',
    goalOne: 'Rentre la boule.',
    goalMany: 'Rentre {n} boules.',
    avoidBomb: 'Ne rentre pas la bombe !',
    shotsLeft: 'Coups restants',
    physicsIdea: 'L’idée physique',
    notes: {
      nice: 'Joli coup !',
      miss: 'Raté — regarde les traces et essaie un autre angle.',
      scratch: 'Oups, la boule blanche est tombée ! Elle revient à sa place.',
      bomb: 'Boum ! Tu as rentré la bombe.',
      outOfShots: 'Plus de coups.',
    },
    solved: 'Mission réussie !',
    restart: 'Recommencer',
    tryAgain: 'Réessayer',
    next: 'Mission suivante',
    finish: 'Voir les résultats',
    results: 'Toutes les missions sont finies !',
    starsEarned: 'Étoiles',
    levelsSolved: 'Missions réussies',
    playAgain: 'Rejouer',
    surface: 'Table',
    surfaces: { felt: 'Tapis', ice: 'Glace', sand: 'Sable' },
    guide: 'Ligne de visée',
    newRack: 'Nouveau triangle',
    shots: 'Coups',
    sunk: 'Rentrées',
    tableLabel: 'Table de billard',
    levels: {
      straight: {
        title: 'Tout droit',
        idea: 'Une boule qui roule va tout droit jusqu’à ce que quelque chose l’arrête. Tape la boule bien au milieu et elle part droit devant.',
      },
      stop: {
        title: 'Coup arrêté',
        idea: 'Quand une boule en frappe une autre pareille de plein fouet, elle s’arrête net et l’autre prend toute sa vitesse. Cet élan s’appelle la quantité de mouvement : il se transmet, comme dans un pendule de Newton.',
      },
      bank: {
        title: 'Coup de bande',
        idea: 'Le poteau bloque le chemin : rebondis sur une bande. L’angle de sortie est égal à l’angle d’entrée, comme la lumière sur un miroir.',
      },
      cut: {
        title: 'Angle droit',
        idea: 'Touche la boule sur le côté. Après un choc de biais, deux boules pareilles partent toujours à angle droit (90°). Regarde les deux flèches !',
      },
      heavy: {
        title: 'Boule d’acier',
        idea: 'Cette boule est trois fois plus lourde. Elle bouge lentement quand on la frappe, et la boule blanche rebondit en arrière. Il faut tirer plus fort !',
      },
      light: {
        title: 'Boule plume',
        idea: 'Cette boule est très légère. Elle part plus vite que la boule blanche n’est arrivée, et la blanche continue d’avancer. Attention qu’elle ne la suive pas !',
      },
      double: {
        title: 'Deux d’affilée',
        idea: 'Prévois deux coups. Après le premier, pense à l’endroit où la boule blanche s’arrêtera, pour que le coup suivant soit facile.',
      },
      posts: {
        title: 'Flipper',
        idea: 'Les poteaux font aussi rebondir les boules, et le rebond dépend de l’endroit où la boule touche le poteau rond. Utilise la ligne de visée pour prévoir le trajet.',
      },
      bomb: {
        title: 'Démineur',
        idea: 'La bombe garde le coin. Choisis une autre poche et regarde où tes autres boules vont rouler après le choc.',
      },
      break: {
        title: 'La casse',
        idea: 'Un coup fort sur la première boule répand l’énergie dans tout le paquet. Les boules partent dans tous les sens !',
      },
    },
  },
};

export default translations;
