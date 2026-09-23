export type FaqItem = {
  question: string;
  answer: string[];
};

// Answers are plain paragraphs. The FAQ page links "privacy policy" and the contact email itself.
export const faq: FaqItem[] = [
  {
    question: "What is Ready to Mingle?",
    answer: [
      "A private events club in Toronto. We host a small number of gatherings each season: suppers, tastings, private viewings and late evenings, each in a setting chosen with care.",
    ],
  },
  {
    question: "Who is it for?",
    answer: [
      "Toronto professionals who would rather spend an evening in good conversation than in a crowded room. Our guests come from many fields; what they share is curiosity and generosity with their time.",
    ],
  },
  {
    question: "How do I register?",
    answer: [
      "Complete the short registration form with your preferred name, your email and a few details about yourself. We will email you a link to confirm your address. Once you press the confirm button on that page, you are registered.",
    ],
  },
  {
    question: "I haven't received the confirmation email.",
    answer: [
      "It usually arrives within a few minutes. Please check your spam or promotions folder. Confirmation links expire after 48 hours; if yours has expired, simply register again with the same email and we will send a fresh one.",
    ],
  },
  {
    question: "Why don't you publish event locations?",
    answer: [
      "Keeping locations private keeps the rooms relaxed and the company genuine. Locations are shared with registered guests only.",
    ],
  },
  {
    question: "Are all events in Toronto?",
    answer: [
      "Yes. Our gatherings take place across the city, from Yorkville and King West to the Distillery District and beyond. All times on this site are Toronto time.",
    ],
  },
  {
    question: "How is my information used?",
    answer: [
      "Only to run the club: to confirm your email and to know who our guests are. We never sell or share it for marketing. The privacy policy explains what we collect and why.",
    ],
  },
  {
    question: "How do I update or remove my information?",
    answer: [
      "Email us from the address you registered with and we will update or delete your details.",
    ],
  },
];
