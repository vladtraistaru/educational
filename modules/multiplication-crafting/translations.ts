import type { Language } from '@/lib/language-config';
import type { RecipeId } from './recipes';

type Five = [string, string, string, string, string];
type Four = [string, string, string, string];

export interface RecipeText {
  name: string;
  /** Clue shown on the menu while the recipe is still a mystery. */
  hint: string;
  /** One multiplication discovery per stage reached (row 1, row 2, row 3, crafted). */
  facts: Four;
}

export interface CraftingTranslations {
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
  recipeWas: string;
  discoveries: string;
  noDiscoveries: string;
  playAgain: string;
  pts: string;
}

const translations: Record<Language, CraftingTranslations> = {
  en: {
    title: 'Multiplication Crafting',
    description:
      'Discover mystery Minecraft-style recipes! Answer multiplication facts from 1 to 12 to fill the crafting table row by row and find out what you are making — with a new multiplication secret at every step.',
    chooseRecipe: 'Pick a mystery recipe',
    chooseRecipeHint: 'Nobody knows what it makes. Answer right to fill the table and find out!',
    mysteryRecipe: 'Mystery recipe',
    recipes: {
      cake: {
        name: 'Cake',
        hint: 'Something sweet…',
        facts: [
          'Three milk buckets go on top. Baking 4 cakes takes 4 × 3 = 12 milk buckets!',
          'Two sugar and one egg in the middle. For 5 cakes you need 5 × 2 = 10 sugar.',
          'Three wheat along the bottom. The table is 3 rows × 3 columns = 9 slots, and every slot is used!',
          'A cake! It has 7 slices, so 3 cakes are 3 × 7 = 21 slices. Minecraft even has an achievement for baking one, called “The Lie”.',
        ],
      },
      tnt: {
        name: 'TNT',
        hint: 'Something explosive…',
        facts: [
          'Gunpowder, sand, gunpowder — the pattern alternates. One TNT needs 5 gunpowder, so 3 TNT need 3 × 5 = 15!',
          'Sand fills the gaps: 4 sand per TNT. For 6 TNT that is 6 × 4 = 24 sand.',
          'A checkerboard! 5 + 4 = 9 slots, or 3 rows × 3 columns.',
          'TNT! Each one uses 9 items, so 8 TNT need 8 × 9 = 72 items — more than one stack of 64. Red sand works too!',
        ],
      },
      beacon: {
        name: 'Beacon',
        hint: 'Something that shines to the sky…',
        facts: [
          'Glass across the top. A beacon needs 5 glass, so 2 beacons need 2 × 5 = 10 glass.',
          'A nether star sits in the middle — it only drops from the Wither boss! A beacon stands on a pyramid whose first layer is 3 × 3 = 9 blocks.',
          'Obsidian along the bottom. Bigger pyramids add layers of 5 × 5 = 25, then 7 × 7 = 49, then 9 × 9 = 81 blocks.',
          'A beacon! A full 4-layer pyramid needs 9 + 25 + 49 + 81 = 164 blocks, and its light shoots up to the sky.',
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
    recipeWas: 'The mystery recipe was',
    discoveries: 'Your discoveries',
    noDiscoveries: 'Nothing discovered yet — try again!',
    playAgain: 'Play Again',
    pts: 'pts',
  },
  fr: {
    title: 'Multiplication Artisanale',
    description:
      'Découvre des recettes mystères dans le style de Minecraft ! Réponds à des multiplications de 1 à 12 pour remplir la table de fabrication rangée par rangée et deviner ce que tu fabriques — avec un nouveau secret de multiplication à chaque étape.',
    chooseRecipe: 'Choisis une recette mystère',
    chooseRecipeHint:
      'Personne ne sait ce qu’elle fabrique. Réponds juste pour remplir la table et le découvrir !',
    mysteryRecipe: 'Recette mystère',
    recipes: {
      cake: {
        name: 'Gâteau',
        hint: 'Quelque chose de sucré…',
        facts: [
          'Trois seaux de lait en haut. Pour cuire 4 gâteaux, il faut 4 × 3 = 12 seaux de lait !',
          'Deux sucres et un œuf au milieu. Pour 5 gâteaux, il faut 5 × 2 = 10 sucres.',
          'Trois blés en bas. La table fait 3 rangées × 3 colonnes = 9 cases, et toutes sont utilisées !',
          'Un gâteau ! Il a 7 parts, donc 3 gâteaux font 3 × 7 = 21 parts. Minecraft a même un succès pour en cuire un : « Le Mensonge ».',
        ],
      },
      tnt: {
        name: 'TNT',
        hint: 'Quelque chose d’explosif…',
        facts: [
          'Poudre à canon, sable, poudre à canon — le motif alterne. Une TNT demande 5 poudres, donc 3 TNT en demandent 3 × 5 = 15 !',
          'Le sable remplit les trous : 4 sables par TNT. Pour 6 TNT, cela fait 6 × 4 = 24 sables.',
          'Un damier ! 5 + 4 = 9 cases, ou 3 rangées × 3 colonnes.',
          'De la TNT ! Chacune utilise 9 objets, donc 8 TNT en demandent 8 × 9 = 72 — plus qu’une pile de 64. Le sable rouge marche aussi !',
        ],
      },
      beacon: {
        name: 'Balise',
        hint: 'Quelque chose qui brille jusqu’au ciel…',
        facts: [
          'Du verre en haut. Une balise demande 5 verres, donc 2 balises en demandent 2 × 5 = 10.',
          'Une étoile du Nether trône au milieu — elle ne tombe que du Wither ! Une balise se pose sur une pyramide dont la première couche fait 3 × 3 = 9 blocs.',
          'De l’obsidienne en bas. Les pyramides plus grandes ajoutent des couches de 5 × 5 = 25, puis 7 × 7 = 49, puis 9 × 9 = 81 blocs.',
          'Une balise ! Une pyramide complète de 4 couches demande 9 + 25 + 49 + 81 = 164 blocs, et sa lumière monte jusqu’au ciel.',
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
    recipeWas: 'La recette mystère était',
    discoveries: 'Tes découvertes',
    noDiscoveries: 'Rien découvert pour l’instant — réessaie !',
    playAgain: 'Rejouer',
    pts: 'pts',
  },
};

export default translations;
