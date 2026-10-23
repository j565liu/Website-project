export type FaqItem = {
  question: string;
  answer: string[];
};

// Answers are plain paragraphs. The FAQ page links "privacy policy" and the contact email itself.
export const faq: FaqItem[] = [
  {
    question: "What is Ready to Mingle?",
    answer: [
      "A series of private, invitation-only gatherings in Toronto. We host a small number of evenings each season: suppers, tastings, private viewings and late evenings, each in a setting chosen for that night.",
    ],
  },
  {
    question: "Who is it for?",
    answer: [
      "Toronto professionals who would rather spend an evening in good conversation than in a crowded room. Our guests come from many fields; what they share is curiosity and generosity with their time.",
    ],
  },
  {
    question: "How do I get an invitation?",
    answer: [
      "Invitations are shared personally. If someone has passed this site on to you, they can give you the invitation code.",
    ],
  },
  {
    question: "How do I register?",
    answer: [
      "Enter your invitation code, then complete the short form with your preferred name and your email. We will email you a link to confirm your address. Once you press the confirm button on that page, you are registered.",
      "You only need to enter the code once on each device; it is remembered for 30 days.",
    ],
  },
  {
    question: "I haven't received the confirmation email.",
    answer: [
      "It usually arrives within a few minutes. Please check your spam or promotions folder. Confirmation links expire after 48 hours; if yours has expired, simply register again with the same email and we will send a fresh one.",
    ],
  },
  {
    question: "Is there a clubhouse or permanent venue?",
    answer: [
      "No. There is no fixed address: each gathering is held somewhere different, chosen for that particular evening, from a chef's counter to a gallery after hours.",
    ],
  },
  {
    question: "Why don't you publish event locations?",
    answer: [
      "Keeping locations private keeps each evening relaxed and the company genuine. The location is shared with registered guests only, a few days before.",
    ],
  },
  {
    question: "Are all gatherings in Toronto?",
    answer: [
      "Yes. They move around the city, from Yorkville and King West to the Distillery District and beyond. All times on this site are Toronto time.",
    ],
  },
  {
    question: "Will you email me about upcoming gatherings?",
    answer: [
      "Only if you tick \"Email me about upcoming gatherings\" when you register. Those emails are occasional, and every one includes a link to unsubscribe. Otherwise we only send the emails needed to confirm your registration.",
    ],
  },
  {
    question: "How is my information used?",
    answer: [
      "Only to organise our gatherings: to confirm your email, to know who our guests are, to reach you by phone about a gathering you're attending if you gave us your number and, if you asked, to tell you about upcoming gatherings. We never sell or share it for marketing. The privacy policy explains what we collect and why.",
    ],
  },
  {
    question: "How do I update or remove my information?",
    answer: [
      "Use the \"Manage my registration\" link in the email we sent when you registered. It lets you stop emails about gatherings or delete your details at any time.",
      "To change your name or phone number, delete your registration and register again.",
    ],
  },
];
