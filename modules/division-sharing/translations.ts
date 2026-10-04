import type { Language } from '@/lib/language-config';
import type { RecipeId } from './recipes';

type Five = [string, string, string, string, string];
type Four = [string, string, string, string];

export interface RecipeText {
  name: string;
  /** Clue shown on the menu while the recipe is still a mystery. */
  hint: string;
  /** One division discovery per stage reached (row 1, row 2, row 3, crafted). */
  facts: Four;
}

export interface DivisionTranslations {
  title: string;
  description: string;
  chooseRecipe: string;
  chooseRecipeHint: string;
  mysteryRecipe: string;
  recipes: Record<RecipeId, RecipeText>;
  stageNames: Five;
  score: string;
  lives: string;
  streak: string;
  correct: string;
  wrong: string;
  discovered: string;
  crafted: string;
  maxStage: string;
  growthHint: string;
  gameOver: string;
  finalScore: string;
  totalCorrect: string;
  bestStreak: string;
  discoveries: string;
  noDiscoveries: string;
  playAgain: string;
  pts: string;
  yourAnswer: string;
  check: string;
}

const translations: Record<Language, DivisionTranslations> = {
  en: {
    title: 'Division Crafting',
    description:
      'Discover mystery Minecraft-style recipes! Answer division facts to fill the crafting table row by row and find out what you are making — with a new division secret at every step.',
    chooseRecipe: 'Pick a mystery recipe',
    chooseRecipeHint: 'Nobody knows what it makes. Answer right to fill the table and find out!',
    mysteryRecipe: 'Mystery recipe',
    recipes: {
      chest: {
        name: 'Chest',
        hint: 'Somewhere to keep your loot…',
        facts: [
          'Three planks across the top. One log gives 4 planks, so 12 planks ÷ 4 = 3 logs.',
          'A plank on each side and an empty hole in the middle! A chest needs 8 planks, and 8 ÷ 4 = 2 logs.',
          'Three planks along the bottom. With 24 planks you can build 24 ÷ 8 = 3 chests.',
          'A chest! It has 27 slots in rows of 9: 27 ÷ 9 = 3 rows. Put two side by side for 54 slots: 54 ÷ 9 = 6 rows.',
        ],
      },
      ironBlock: {
        name: 'Block of Iron',
        hint: 'Something heavy and shiny…',
        facts: [
          'Three iron ingots on top. One ingot is made of 9 nuggets, so 27 nuggets ÷ 9 = 3 ingots.',
          'Three more ingots. One piece of coal smelts 8 ores in a furnace, so 24 ores ÷ 8 = 3 coal.',
          'The table is full: 9 ingots make one block. 45 ingots ÷ 9 = 5 blocks of iron.',
          'A block of iron! An iron golem is built from 4 of them, so 12 blocks ÷ 4 = 3 golems.',
        ],
      },
      bookshelf: {
        name: 'Bookshelf',
        hint: 'Something for a magic table…',
        facts: [
          'Three planks on top. A bookshelf uses 6 planks, so 24 planks ÷ 6 = 4 bookshelves.',
          'Three books in the middle. Each book needs 3 paper, so 12 paper ÷ 3 = 4 books.',
          'Three planks at the bottom. A log gives 4 planks, so 12 planks ÷ 4 = 3 logs.',
          'A bookshelf! An enchanting table reaches full power with 15 of them. Each needs 3 books, so 45 books ÷ 3 = 15 bookshelves.',
        ],
      },
    },
    stageNames: ['Empty table', 'Top row placed', 'Middle row placed', 'Table full!', 'Crafted!'],
    score: 'Score',
    lives: 'Lives',
    streak: 'Streak',
    correct: 'Correct!',
    wrong: 'Oops, not quite!',
    discovered: 'DISCOVERY!',
    crafted: 'CRAFTED!',
    maxStage: 'Recipe complete!',
    growthHint: '{n} more to discover!',
    gameOver: 'Game Over',
    finalScore: 'Final Score',
    totalCorrect: 'Correct Answers',
    bestStreak: 'Best Streak',
    discoveries: 'Your discoveries',
    noDiscoveries: 'Nothing discovered yet — try again!',
    playAgain: 'Play Again',
    pts: 'pts',
    yourAnswer: 'Your answer',
    check: 'Check',
  },
  fr: {
    title: 'Division Artisanale',
    description:
      'Découvre des recettes mystères dans le style de Minecraft ! Réponds à des divisions pour remplir la table de fabrication rangée par rangée et deviner ce que tu fabriques — avec un nouveau secret de division à chaque étape.',
    chooseRecipe: 'Choisis une recette mystère',
    chooseRecipeHint:
      'Personne ne sait ce qu’elle fabrique. Réponds juste pour remplir la table et le découvrir !',
    mysteryRecipe: 'Recette mystère',
    recipes: {
      chest: {
        name: 'Coffre',
        hint: 'Un endroit pour ranger ton butin…',
        facts: [
          'Trois planches en haut. Une bûche donne 4 planches, donc 12 planches ÷ 4 = 3 bûches.',
          'Une planche de chaque côté et un trou vide au milieu ! Un coffre demande 8 planches, et 8 ÷ 4 = 2 bûches.',
          'Trois planches en bas. Avec 24 planches, tu peux fabriquer 24 ÷ 8 = 3 coffres.',
          'Un coffre ! Il a 27 cases en rangées de 9 : 27 ÷ 9 = 3 rangées. Deux côte à côte font 54 cases : 54 ÷ 9 = 6 rangées.',
        ],
      },
      ironBlock: {
        name: 'Bloc de fer',
        hint: 'Quelque chose de lourd et brillant…',
        facts: [
          'Trois lingots de fer en haut. Un lingot est fait de 9 pépites, donc 27 pépites ÷ 9 = 3 lingots.',
          'Encore trois lingots. Un charbon cuit 8 minerais dans un four, donc 24 minerais ÷ 8 = 3 charbons.',
          'La table est pleine : 9 lingots font un bloc. 45 lingots ÷ 9 = 5 blocs de fer.',
          'Un bloc de fer ! Un golem de fer se construit avec 4 blocs, donc 12 blocs ÷ 4 = 3 golems.',
        ],
      },
      bookshelf: {
        name: 'Bibliothèque',
        hint: 'Quelque chose pour une table magique…',
        facts: [
          'Trois planches en haut. Une bibliothèque utilise 6 planches, donc 24 planches ÷ 6 = 4 bibliothèques.',
          'Trois livres au milieu. Chaque livre demande 3 papiers, donc 12 papiers ÷ 3 = 4 livres.',
          'Trois planches en bas. Une bûche donne 4 planches, donc 12 planches ÷ 4 = 3 bûches.',
          'Une bibliothèque ! Une table d’enchantement atteint sa pleine puissance avec 15 bibliothèques. Chacune demande 3 livres, donc 45 livres ÷ 3 = 15.',
        ],
      },
    },
    stageNames: [
      'Table vide',
      'Première rangée',
      'Deuxième rangée',
      'Table pleine !',
      'Fabriqué !',
    ],
    score: 'Score',
    lives: 'Vies',
    streak: 'Série',
    correct: 'Correct !',
    wrong: 'Oups, pas tout à fait !',
    discovered: 'DÉCOUVERTE !',
    crafted: 'FABRIQUÉ !',
    maxStage: 'Recette terminée !',
    growthHint: 'Encore {n} pour découvrir !',
    gameOver: 'Partie Terminée',
    finalScore: 'Score Final',
    totalCorrect: 'Bonnes réponses',
    bestStreak: 'Meilleure série',
    discoveries: 'Tes découvertes',
    noDiscoveries: 'Rien découvert pour l’instant — réessaie !',
    playAgain: 'Rejouer',
    pts: 'pts',
    yourAnswer: 'Ta réponse',
    check: 'Valider',
  },
};

export default translations;
