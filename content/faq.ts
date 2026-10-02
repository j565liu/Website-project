export type FaqItem = {
  question: string;
  answer: string[];
};

// Answers are plain paragraphs. The FAQ page links "privacy policy" and the contact email itself.
export const faq: FaqItem[] = [
  {
    question: "What is Ready to Mingle?",
    answer: [
      "An informational site about small, hosted gatherings: suppers, tastings, private viewings and late evenings of music, kept deliberately small. It explains what they involve and why people enjoy them, using Toronto as an example city.",
      "It is not a club and does not run events.",
    ],
  },
  {
    question: "What counts as a small gathering?",
    answer: [
      "There is no strict definition. People usually mean an evening for a group small enough to share one conversation, or a few, built around something worth gathering for: a meal, a tasting, a piece of art, some music.",
    ],
  },
  {
    question: "Who are these gatherings for?",
    answer: [
      "Anyone who would rather spend an evening in good conversation than in a crowded room. Guests often come from many different fields; what they tend to share is curiosity about other people.",
    ],
  },
  {
    question: "How do I find one near me?",
    answer: [
      "Search for terms like supper club, tasting evening, listening session or salon, together with your city. Restaurants that offer chef’s counter seating or private dining sometimes host them too.",
      "[EXAMPLE: add local listings, community groups or hosts that readers in your city could look at.]",
    ],
  },
  {
    question: "What do I need to start my own?",
    answer: [
      "Less than most people expect: a host, a handful of guests, a setting, and something to anchor the evening. The starter guide covers each of these in a little more detail.",
    ],
  },
  {
    question: "Do these gatherings cost money?",
    answer: [
      "It varies. Some hosts cover the costs themselves, some split them evenly among guests, and some gatherings charge per seat. [EXAMPLE: add a typical cost arrangement from a real gathering, if you have one.]",
    ],
  },
  {
    question: "Why do some gatherings keep their location private?",
    answer: [
      "Many hosts share the address only with confirmed guests, especially when the gathering is in someone’s home. It keeps the evening relaxed and the host’s privacy intact.",
    ],
  },
  {
    question: "What is the starter guide?",
    answer: [
      "A short guide to hosting a first small gathering. Enter your preferred name and email, confirm your address through the link we send, and you will receive a link to the guide. Nothing else is sent.",
    ],
  },
  {
    question: "I haven't received the confirmation email.",
    answer: [
      "It usually arrives within a few minutes. Please check your spam or promotions folder. Confirmation links expire after 48 hours; if yours has expired, request the guide again with the same email to receive a fresh one.",
    ],
  },
  {
    question: "How is my information used?",
    answer: [
      "Only to confirm your email and send you the guide link. It is never sold or shared for marketing. The privacy policy explains what is collected and why.",
    ],
  },
  {
    question: "How do I update or remove my information?",
    answer: [
      "Email us from the address you used and we will update or delete your details.",
    ],
  },
];
