
export interface Message {
  id: string;
  text: string;
  language: "en-US" | "ar-SA" | "fr-FR";
}

export const messages: Message[] = [
  // English messages
  {
    id: "en-1",
    text: "I receive money with love and joy, and it flows to me without interruption.",
    language: "en-US"
  },
  {
    id: "en-2",
    text: "Money flows to me in unexpected and easy ways.",
    language: "en-US"
  },
  {
    id: "en-3",
    text: "I am in tune with the vibrations of wealth and financial success.",
    language: "en-US"
  },
  {
    id: "en-4",
    text: "I possess a magnetic energy that attracts money to me wherever I am.",
    language: "en-US"
  },
  {
    id: "en-5",
    text: "The happier I feel, the more money flows into my life.",
    language: "en-US"
  },
  {
    id: "en-6",
    text: "I deserve financial abundance in every area of my life.",
    language: "en-US"
  },
  {
    id: "en-7",
    text: "All the money I need comes to me at the right time.",
    language: "en-US"
  },
  {
    id: "en-8",
    text: "Every day, I grow richer and more prosperous in amazing ways.",
    language: "en-US"
  },
  {
    id: "en-9",
    text: "The universe loves to shower me with abundance and wealth.",
    language: "en-US"
  },
  {
    id: "en-10",
    text: "I am opening the doors of sustenance and financial flow into my life now.",
    language: "en-US"
  },
  
  // Arabic messages
  {
    id: "ar-1",
    text: "أنا مغناطيس قوي للمال، وأستقبله بسهولة وراحة.",
    language: "ar-SA"
  },
  {
    id: "ar-2",
    text: "طاقتي تهتز بتردد الثراء، والمال ينجذب إليَّ الآن.",
    language: "ar-SA"
  },
  {
    id: "ar-3",
    text: "الكون يفيض عليَّ بالفرص المالية الذهبية.",
    language: "ar-SA"
  },
  {
    id: "ar-4",
    text: "كل دينار أنفقه يعود إليَّ أضعافًا مضاعفة.",
    language: "ar-SA"
  },
  {
    id: "ar-5",
    text: "أنا أستحق الثروة، وأنا مستعد لاستقبالها بالكامل.",
    language: "ar-SA"
  },
  {
    id: "ar-6",
    text: "أبواب الرزق تُفتح لي في كل مكان أذهب إليه.",
    language: "ar-SA"
  },
  {
    id: "ar-7",
    text: "المال يتدفق إليَّ من مصادر متجددة ومتنوعة.",
    language: "ar-SA"
  },
  {
    id: "ar-8",
    text: "كل لحظة، أنا أعيش في طاقة الوفرة المطلقة.",
    language: "ar-SA"
  },
  {
    id: "ar-9",
    text: "أنا أسمح للثراء أن يتجلى في حياتي دون جهد.",
    language: "ar-SA"
  },
  {
    id: "ar-10",
    text: "عالمي الداخلي يعكس لي واقعًا ماليًا مزدهرًا.",
    language: "ar-SA"
  },
  
  // French messages
  {
    id: "fr-1",
    text: "Je reçois de l'argent avec amour et joie, et il afflue vers moi sans interruption.",
    language: "fr-FR"
  },
  {
    id: "fr-2",
    text: "L'argent vient à moi de façons inattendues et faciles.",
    language: "fr-FR"
  },
  {
    id: "fr-3",
    text: "Je suis en harmonie avec les vibrations de la richesse et du succès financier.",
    language: "fr-FR"
  },
  {
    id: "fr-4",
    text: "Je possède une énergie magnétique qui attire l'argent vers moi où que je sois.",
    language: "fr-FR"
  },
  {
    id: "fr-5",
    text: "Plus je me sens heureux, plus l'argent afflue dans ma vie.",
    language: "fr-FR"
  },
  {
    id: "fr-6",
    text: "Je mérite l'abondance financière dans tous les domaines de ma vie.",
    language: "fr-FR"
  },
  {
    id: "fr-7",
    text: "Tout l'argent dont j'ai besoin me parvient au bon moment.",
    language: "fr-FR"
  },
  {
    id: "fr-8",
    text: "Chaque jour, je deviens plus riche et plus prospère de façon étonnante.",
    language: "fr-FR"
  },
  {
    id: "fr-9",
    text: "L'univers aime me combler d'abondance et de richesse.",
    language: "fr-FR"
  },
  {
    id: "fr-10",
    text: "J'ouvre maintenant les portes de la subsistance et du flux financier dans ma vie.",
    language: "fr-FR"
  }
];

export function getRandomMessage(language: string): Message {
  const filteredMessages = messages.filter(msg => msg.language === language);
  const randomIndex = Math.floor(Math.random() * filteredMessages.length);
  return filteredMessages[randomIndex];
}
