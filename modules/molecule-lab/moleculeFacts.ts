import type { Language } from '@/lib/language-config';

export interface MoleculeFact {
  name: string;
  riddle: string;
  nature: string;
  fact: string;
}

const moleculeFacts: Record<Language, Record<string, MoleculeFact>> = {
  en: {
    hydrogen: {
      name: 'Hydrogen gas',
      riddle: 'I am the lightest thing there is, and the Sun is made mostly of me.',
      nature: 'The Sun and the stars are made mostly of hydrogen.',
      fact: 'It is the lightest gas in the universe — some rockets use it as fuel!',
    },
    oxygen: {
      name: 'Oxygen',
      riddle: 'Trees and plants make me, and you need me every time you breathe in.',
      nature: 'In the air all around you. Plants and trees make it from sunlight.',
      fact: 'Fire needs oxygen too — that is why a candle goes out under a glass.',
    },
    nitrogen: {
      name: 'Nitrogen',
      riddle: 'I am the gas you meet the most in the air, but you barely notice me.',
      nature: 'Almost 4 out of every 5 bits of air are nitrogen.',
      fact: 'Its two atoms hold on with three hands each — a super strong grip!',
    },
    chlorine: {
      name: 'Chlorine',
      riddle: 'I help keep the water in swimming pools clean.',
      nature: 'Used in tiny amounts to clean swimming pools and tap water.',
      fact: 'On its own it is a greenish gas that is dangerous to breathe — only grown-ups handle it.',
    },
    water: {
      name: 'Water',
      riddle: 'I fall from the clouds and fill the rivers and oceans.',
      nature: 'Rain, rivers, oceans, clouds, ice — and more than half of your body!',
      fact: 'Water is the only everyday thing you can find as ice, liquid and steam.',
    },
    salt: {
      name: 'Salt',
      riddle: 'I make the sea taste salty, and people sprinkle me on their chips.',
      nature: 'Dissolved in the sea. Also dug out of the ground in salt mines.',
      fact: 'Salt grains are tiny cubes — look at them with a magnifying glass!',
    },
    'carbon-dioxide': {
      name: 'Carbon dioxide',
      riddle: 'You breathe me out, plants breathe me in, and I make fizzy drinks bubble.',
      nature: 'In your breath, in the bubbles of fizzy drinks, and in the air plants use.',
      fact: 'Plants take it from the air to grow — trees are partly made of it!',
    },
    ammonia: {
      name: 'Ammonia',
      riddle: 'I make pee smell strong, but farmers use me to help plants grow.',
      nature: 'Made when pee and animal waste break down. Used in plant food.',
      fact: 'Its sharp smell is easy to recognise in stables and some cleaning products.',
    },
    ozone: {
      name: 'Ozone',
      riddle: 'High up in the sky I make a shield against the Sun’s burning rays.',
      nature: 'A layer high in the sky that protects Earth from strong sunlight.',
      fact: 'After a thunderstorm, the air sometimes smells a little of ozone.',
    },
    'hydrochloric-acid': {
      name: 'Hydrochloric acid',
      riddle: 'I live in your tummy and help break down your lunch.',
      nature: 'Inside your stomach, where it helps digest food.',
      fact: 'It is so strong that your stomach has a special coating to protect itself.',
    },
    'carbon-monoxide': {
      name: 'Carbon monoxide',
      riddle: 'I come from smoke when things burn badly. You cannot see or smell me, so homes have alarms for me.',
      nature: 'In smoke from fires and engines when there is not enough air.',
      fact: 'It is invisible and dangerous — that is why homes have CO alarms.',
    },
    'hydrogen-sulfide': {
      name: 'Hydrogen sulfide',
      riddle: 'I smell like rotten eggs and puff out of hot springs.',
      nature: 'Around volcanoes, hot springs — and rotten eggs!',
      fact: 'Your nose can smell even the tiniest bit of it.',
    },
    'sulfur-dioxide': {
      name: 'Sulfur dioxide',
      riddle: 'Volcanoes puff me out, and I smell like a match that was just struck.',
      nature: 'Blown out by volcanoes. Also the smell of a match being lit.',
      fact: 'In tiny amounts it is used to keep dried fruit from going brown.',
    },
    'nitric-oxide': {
      name: 'Nitric oxide',
      riddle: 'A flash of lightning makes me out of the air.',
      nature: 'Made when lightning heats the air during a storm.',
      fact: 'Rain carries it to the ground, where it helps feed plants.',
    },
    'hydrogen-peroxide': {
      name: 'Hydrogen peroxide',
      riddle: 'I bubble on a scraped knee to clean it. I am like water with one extra oxygen.',
      nature: 'In first-aid kits to clean small cuts. Your body makes tiny amounts too.',
      fact: 'The fizz you see on a cut is oxygen escaping.',
    },
    'sodium-hydroxide': {
      name: 'Sodium hydroxide',
      riddle: 'Mixed with oil, I help turn it into soap.',
      nature: 'Used to make soap and to unblock drains.',
      fact: 'It is very strong and can burn skin — only used with gloves by grown-ups.',
    },
    'baking-soda': {
      name: 'Baking soda',
      riddle: 'I make cakes rise, and I fizz up when you pour vinegar on me.',
      nature: 'In the kitchen for baking. Found in nature as a mineral near dry lakes.',
      fact: 'Mix it with vinegar and it makes carbon dioxide bubbles — a fizzy volcano!',
    },
  },
  fr: {
    hydrogen: {
      name: 'Dihydrogène',
      riddle: 'Je suis la chose la plus légère qui existe, et le Soleil est surtout fait de moi.',
      nature: 'Le Soleil et les étoiles sont surtout faits d’hydrogène.',
      fact: 'C’est le gaz le plus léger de l’univers — certaines fusées l’utilisent comme carburant !',
    },
    oxygen: {
      name: 'Dioxygène',
      riddle: 'Les arbres et les plantes me fabriquent, et tu as besoin de moi à chaque inspiration.',
      nature: 'Dans l’air tout autour de toi. Les plantes le fabriquent grâce au soleil.',
      fact: 'Le feu en a besoin aussi — c’est pour ça qu’une bougie s’éteint sous un verre.',
    },
    nitrogen: {
      name: 'Diazote',
      riddle: 'Je suis le gaz le plus présent dans l’air, mais tu ne me remarques pas.',
      nature: 'Presque 4 morceaux d’air sur 5 sont du diazote.',
      fact: 'Ses deux atomes se tiennent avec trois mains chacun — une prise super solide !',
    },
    chlorine: {
      name: 'Dichlore',
      riddle: 'J’aide à garder l’eau des piscines propre.',
      nature: 'Utilisé en toute petite quantité pour nettoyer l’eau des piscines et du robinet.',
      fact: 'Seul, c’est un gaz verdâtre dangereux à respirer — seuls les adultes le manipulent.',
    },
    water: {
      name: 'Eau',
      riddle: 'Je tombe des nuages et je remplis les rivières et les océans.',
      nature: 'La pluie, les rivières, les océans, les nuages, la glace — et plus de la moitié de ton corps !',
      fact: 'L’eau est la seule chose de tous les jours qu’on trouve en glace, en liquide et en vapeur.',
    },
    salt: {
      name: 'Sel',
      riddle: 'Je rends la mer salée, et on me saupoudre sur les frites.',
      nature: 'Dissous dans la mer. On le sort aussi du sol dans les mines de sel.',
      fact: 'Les grains de sel sont de minuscules cubes — regarde-les à la loupe !',
    },
    'carbon-dioxide': {
      name: 'Dioxyde de carbone',
      riddle: 'Tu me rejettes en expirant, les plantes me respirent, et je fais pétiller les boissons.',
      nature: 'Dans ton souffle, dans les bulles des boissons gazeuses et dans l’air que les plantes utilisent.',
      fact: 'Les plantes le prennent dans l’air pour grandir — les arbres en sont en partie faits !',
    },
    ammonia: {
      name: 'Ammoniac',
      riddle: 'Je donne une odeur forte au pipi, mais les agriculteurs m’utilisent pour faire pousser les plantes.',
      nature: 'Se forme quand le pipi et le fumier se décomposent. Utilisé dans l’engrais.',
      fact: 'Son odeur piquante se reconnaît dans les écuries et certains produits ménagers.',
    },
    ozone: {
      name: 'Ozone',
      riddle: 'Tout là-haut dans le ciel, je forme un bouclier contre les rayons brûlants du Soleil.',
      nature: 'Une couche haut dans le ciel qui protège la Terre du soleil trop fort.',
      fact: 'Après un orage, l’air sent parfois un peu l’ozone.',
    },
    'hydrochloric-acid': {
      name: 'Acide chlorhydrique',
      riddle: 'J’habite dans ton ventre et j’aide à digérer ton repas.',
      nature: 'Dans ton estomac, où il aide à digérer la nourriture.',
      fact: 'Il est si fort que ton estomac a une couche spéciale pour se protéger.',
    },
    'carbon-monoxide': {
      name: 'Monoxyde de carbone',
      riddle: 'Je sors de la fumée quand ça brûle mal. On ne peut ni me voir ni me sentir, alors les maisons ont des alarmes.',
      nature: 'Dans la fumée des feux et des moteurs quand il manque d’air.',
      fact: 'Il est invisible et dangereux — c’est pour ça qu’il existe des détecteurs de CO.',
    },
    'hydrogen-sulfide': {
      name: 'Sulfure d’hydrogène',
      riddle: 'Je sens l’œuf pourri et je sors des sources chaudes.',
      nature: 'Autour des volcans, des sources chaudes — et dans les œufs pourris !',
      fact: 'Ton nez peut le sentir même en toute petite quantité.',
    },
    'sulfur-dioxide': {
      name: 'Dioxyde de soufre',
      riddle: 'Les volcans me crachent, et je sens l’allumette qu’on vient de frotter.',
      nature: 'Rejeté par les volcans. C’est aussi l’odeur d’une allumette qu’on allume.',
      fact: 'En toute petite quantité, il empêche les fruits secs de brunir.',
    },
    'nitric-oxide': {
      name: 'Monoxyde d’azote',
      riddle: 'Un éclair me fabrique à partir de l’air.',
      nature: 'Se forme quand la foudre chauffe l’air pendant un orage.',
      fact: 'La pluie l’emmène jusqu’au sol, où il aide à nourrir les plantes.',
    },
    'hydrogen-peroxide': {
      name: 'Eau oxygénée',
      riddle: 'Je mousse sur un genou écorché pour le nettoyer. Je suis comme l’eau avec un oxygène en plus.',
      nature: 'Dans la trousse de secours pour nettoyer les petites plaies. Ton corps en fabrique un tout petit peu.',
      fact: 'La mousse que tu vois sur une plaie, c’est de l’oxygène qui s’échappe.',
    },
    'sodium-hydroxide': {
      name: 'Soude',
      riddle: 'Mélangée à de l’huile, j’aide à la transformer en savon.',
      nature: 'Utilisée pour fabriquer le savon et déboucher les éviers.',
      fact: 'Elle est très forte et peut brûler la peau — seuls les adultes l’utilisent, avec des gants.',
    },
    'baking-soda': {
      name: 'Bicarbonate de soude',
      riddle: 'Je fais gonfler les gâteaux, et je mousse quand on me verse du vinaigre dessus.',
      nature: 'Dans la cuisine pour la pâtisserie. Dans la nature, c’est un minéral près des lacs asséchés.',
      fact: 'Mélangé au vinaigre, il fait des bulles de dioxyde de carbone — un volcan qui mousse !',
    },
  },
};

export default moleculeFacts;
