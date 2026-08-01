import { FeedLanguage } from "./data";


export type ReactionKey = "betam" | "awo" | "respect" | "funny" | "interesting" | "disagree";
export type PostKind = "text" | "photo" | "voice" | "poll" | "event" | "anonymous";

export type SocialComment = {
  id: string;
  author: string;
  initials: string;
  text: string;
  time: string;
  likes: number;
  parentId?: string;
};

export type SocialPost = {
  id: string;
  author: string;
  handle: string;
  initials: string;
  accent: number;
  verified?: boolean;
  business?: boolean;
  anonymous?: boolean;
  city: string;
  language: Exclude<FeedLanguage, "all">;
  languageLabel: string;
  time: string;
  circleId?: string;
  circleName?: string;
  kind: PostKind;
  content: string;
  translation?: string;
  mediaLabel?: string;
  voiceDuration?: string;
  poll?: {
    question: string;
    options: { id: string; label: string; votes: number }[];
    votedId?: string;
  };
  event?: {
    date: string;
    location: string;
    seats: number;
  };
  reactions: Record<ReactionKey, number>;
  myReaction?: ReactionKey;
  comments: SocialComment[];
  saved?: boolean;
};

export type Circle = {
  id: string;
  name: string;
  localName: string;
  description: string;
  category: "City" | "Career" | "Culture" | "Campus" | "Sport" | "Business" | "Diaspora";
  language: string;
  members: number;
  online: number;
  initials: string;
  accent: number;
  official: boolean;
  trending: string;
  nextEvent: string;
  moderators: { name: string; initials: string }[];
  rules: string[];
};

export const reactionMeta: Record<ReactionKey, { label: string; symbol: string }> = {
  betam: { label: "Betam", symbol: "🔥" },
  awo: { label: "Awo", symbol: "✓" },
  respect: { label: "Respect", symbol: "✦" },
  funny: { label: "Funny", symbol: "😄" },
  interesting: { label: "Interesting", symbol: "◉" },
  disagree: { label: "Disagree", symbol: "↯" },
};

export const initialCircles: Circle[] = [
  {
    id: "tech-builders",
    name: "Ethiopian Tech Builders",
    localName: "የኢትዮጵያ ቴክ ገንቢዎች",
    description: "Founders, developers and designers building Ethiopia's digital future.",
    category: "Career",
    language: "Amharic · English",
    members: 28400,
    online: 1200,
    initials: "ET",
    accent: 4,
    official: true,
    trending: "Can Ethiopian startups become regional products?",
    nextEvent: "Addis Product Night · Friday",
    moderators: [{ name: "Dawit", initials: "DA" }, { name: "Hana", initials: "HA" }],
    rules: ["Share useful work, not spam", "Critique ideas respectfully", "No misleading investment claims"],
  },
  {
    id: "addis-weekend",
    name: "Addis Weekend",
    localName: "የአዲስ ሳምንት መጨረሻ",
    description: "Events, food, art, music and safe places to explore around Addis Ababa.",
    category: "City",
    language: "Amharic · English",
    members: 46300,
    online: 3100,
    initials: "AW",
    accent: 0,
    official: true,
    trending: "Best calm places for a Saturday afternoon",
    nextEvent: "Creative Market · Meskel Square",
    moderators: [{ name: "Selam", initials: "SE" }, { name: "Liya", initials: "LI" }],
    rules: ["Post verified event details", "Respect venue policies", "No unsafe meetups"],
  },
  {
    id: "oromia-creators",
    name: "Oromia Creators",
    localName: "Uumtoota Oromiyaa",
    description: "Afaan Oromo creators, storytellers, filmmakers and digital entrepreneurs.",
    category: "Culture",
    language: "Afaan Oromo",
    members: 21900,
    online: 890,
    initials: "OC",
    accent: 2,
    official: true,
    trending: "Aadaa keenya karaa dijitaalaan akkamitti guddisna?",
    nextEvent: "Creator audio room · Sunday",
    moderators: [{ name: "Nardos", initials: "NA" }, { name: "Robel", initials: "RO" }],
    rules: ["Give credit to original creators", "Use respectful language", "Protect cultural context"],
  },
  {
    id: "campus-ethiopia",
    name: "Campus Ethiopia",
    localName: "የኢትዮጵያ ካምፓስ",
    description: "Students sharing opportunities, campus stories, study support and new ideas.",
    category: "Campus",
    language: "All languages",
    members: 61200,
    online: 4700,
    initials: "CE",
    accent: 3,
    official: true,
    trending: "Internships students can apply for this month",
    nextEvent: "Graduate Q&A · Wednesday",
    moderators: [{ name: "Mikiyas", initials: "MI" }, { name: "Ruth", initials: "RU" }],
    rules: ["No exam leaks", "Verify scholarship links", "Protect student privacy"],
  },
  {
    id: "football-ethiopia",
    name: "Ethiopian Football Community",
    localName: "የኢትዮጵያ እግር ኳስ ማህበረሰብ",
    description: "National team, local clubs, match analysis and supporter culture.",
    category: "Sport",
    language: "Amharic · Afaan Oromo · English",
    members: 88400,
    online: 9200,
    initials: "EF",
    accent: 1,
    official: true,
    trending: "Which local player deserves a national team call-up?",
    nextEvent: "Live match room · Saturday",
    moderators: [{ name: "Yonas", initials: "YO" }, { name: "Elias", initials: "EL" }],
    rules: ["Debate teams, never attack people", "No illegal streams", "Label unconfirmed transfer news"],
  },
  {
    id: "small-business",
    name: "Ethiopian Small Business",
    localName: "የኢትዮጵያ አነስተኛ ንግድ",
    description: "Practical support for shop owners, freelancers, merchants and growing companies.",
    category: "Business",
    language: "Amharic · English",
    members: 35700,
    online: 1800,
    initials: "SB",
    accent: 5,
    official: true,
    trending: "How do you keep customers without discounting everything?",
    nextEvent: "Business clinic · Monday",
    moderators: [{ name: "Betelhem", initials: "BE" }, { name: "Amanuel", initials: "AM" }],
    rules: ["No get-rich-quick schemes", "Disclose promotions", "Use clear prices and terms"],
  },
  {
    id: "diaspora-connections",
    name: "Ethiopian Diaspora Connections",
    localName: "የዲያስፖራ ግንኙነት",
    description: "A bridge for Ethiopians abroad and at home to exchange opportunities and perspective.",
    category: "Diaspora",
    language: "All languages",
    members: 19600,
    online: 740,
    initials: "DC",
    accent: 4,
    official: false,
    trending: "What makes returning home easier?",
    nextEvent: "Diaspora founder room · Next week",
    moderators: [{ name: "Samuel", initials: "SA" }, { name: "Meaza", initials: "ME" }],
    rules: ["No visa-service scams", "Avoid stereotyping", "Share sources for legal claims"],
  },
  {
    id: "fashion-music",
    name: "Habesha Fashion & Music",
    localName: "ሀበሻ ፋሽን እና ሙዚቃ",
    description: "New sounds, traditional influence, independent fashion and emerging creators.",
    category: "Culture",
    language: "Amharic · Tigrinya · English",
    members: 33400,
    online: 1600,
    initials: "HM",
    accent: 0,
    official: false,
    trending: "Which traditional detail deserves a modern comeback?",
    nextEvent: "New music listening room · Thursday",
    moderators: [{ name: "Liya", initials: "LI" }, { name: "Nardos", initials: "NA" }],
    rules: ["Credit artists and photographers", "No leaked releases", "Constructive feedback only"],
  },
];

export const emptyReactions = (): Record<ReactionKey, number> => ({ betam: 0, awo: 0, respect: 0, funny: 0, interesting: 0, disagree: 0 });

export const initialSocialPosts: SocialPost[] = [
  {
    id: "post-selam-food",
    author: "Selam",
    handle: "@selamplates",
    initials: "SE",
    accent: 0,
    verified: true,
    city: "Addis Ababa",
    language: "am",
    languageLabel: "Amharic",
    time: "12 min",
    circleId: "addis-weekend",
    circleName: "Addis Weekend",
    kind: "photo",
    content: "ዛሬ በአዲስ አበባ ትንሽ የቤተሰብ ሬስቶራንት አገኘሁ። ምግቡ ጣፋጭ ነው፣ አገልግሎቱም በጣም ሞቅ ያለ ነው። ትንሽ ንግዶችን እንደግፍ።",
    translation: "I found a small family restaurant in Addis today. The food is excellent and the welcome is warm. Let us support small businesses.",
    mediaLabel: "A warm table of Ethiopian dishes",
    reactions: { betam: 142, awo: 37, respect: 81, funny: 3, interesting: 19, disagree: 1 },
    comments: [
      { id: "c-s1", author: "Mikiyas", initials: "MI", text: "Drop the location please. This looks excellent.", time: "8m", likes: 12 },
      { id: "c-s2", author: "Selam", initials: "SE", text: "Near Shola. I added the location to the Circle event map.", time: "5m", likes: 7, parentId: "c-s1" },
    ],
  },
  {
    id: "post-dawit-tech",
    author: "Dawit",
    handle: "@dawitbuilds",
    initials: "DA",
    accent: 5,
    verified: true,
    city: "Addis Ababa",
    language: "en",
    languageLabel: "English",
    time: "28 min",
    circleId: "tech-builders",
    circleName: "Ethiopian Tech Builders",
    kind: "text",
    content: "Ethiopian products do not need to imitate Silicon Valley to feel world-class. Local payment habits, multilingual UX and low-bandwidth resilience can become our competitive advantage—not compromises.",
    reactions: { betam: 208, awo: 74, respect: 156, funny: 4, interesting: 98, disagree: 11 },
    comments: [
      { id: "c-d1", author: "Hana", initials: "HA", text: "Exactly. Local constraints can produce better design decisions.", time: "18m", likes: 34 },
    ],
  },
  {
    id: "post-nardos-voice",
    author: "Nardos",
    handle: "@nardoscreates",
    initials: "NA",
    accent: 2,
    verified: true,
    city: "Adama",
    language: "om",
    languageLabel: "Afaan Oromo",
    time: "41 min",
    circleId: "oromia-creators",
    circleName: "Oromia Creators",
    kind: "voice",
    content: "Uumamni keenya afaan keenya keessatti waan guddaa qaba. Sagalee, seenaa fi aadaa keenya karaa dijitaalaa akka jiraatu gochuun hojii keenya.",
    translation: "Our creativity carries something powerful in our language. It is our work to keep our voice, stories and culture alive digitally.",
    voiceDuration: "1:18",
    reactions: { betam: 96, awo: 51, respect: 133, funny: 1, interesting: 48, disagree: 2 },
    comments: [],
  },
  {
    id: "post-campus-poll",
    author: "Campus Ethiopia",
    handle: "@campusethiopia",
    initials: "CE",
    accent: 3,
    verified: true,
    business: true,
    city: "National",
    language: "en",
    languageLabel: "English",
    time: "1 hr",
    circleId: "campus-ethiopia",
    circleName: "Campus Ethiopia",
    kind: "poll",
    content: "Students: what would make the biggest difference before graduation?",
    poll: {
      question: "Choose one priority",
      options: [
        { id: "internship", label: "More paid internships", votes: 2310 },
        { id: "portfolio", label: "Portfolio mentorship", votes: 1180 },
        { id: "career", label: "Career guidance", votes: 1640 },
        { id: "startup", label: "Startup support", votes: 930 },
      ],
    },
    reactions: { betam: 33, awo: 94, respect: 78, funny: 2, interesting: 121, disagree: 7 },
    comments: [],
  },
  {
    id: "post-business-event",
    author: "Betelhem",
    handle: "@betelhemfounder",
    initials: "BE",
    accent: 2,
    verified: true,
    business: true,
    city: "Addis Ababa",
    language: "am",
    languageLabel: "Amharic",
    time: "2 hr",
    circleId: "small-business",
    circleName: "Ethiopian Small Business",
    kind: "event",
    content: "አነስተኛ ንግድ ባለቤቶች የዋጋ አወጣጥ፣ የደንበኛ እምነት እና ዲጂታል መዝገብ አያያዝ ላይ ነፃ ውይይት እናዘጋጃለን።",
    translation: "We are hosting a free discussion for small-business owners about pricing, customer trust and digital record keeping.",
    event: { date: "Monday · 5:30 PM", location: "Bole, Addis Ababa", seats: 42 },
    reactions: { betam: 75, awo: 44, respect: 118, funny: 0, interesting: 63, disagree: 1 },
    comments: [],
  },
  {
    id: "post-anonymous",
    author: "Anonymous member",
    handle: "Campus Ethiopia",
    initials: "?",
    accent: 4,
    anonymous: true,
    city: "Jimma",
    language: "ti",
    languageLabel: "Tigrinya",
    time: "3 hr",
    circleId: "campus-ethiopia",
    circleName: "Campus Ethiopia",
    kind: "anonymous",
    content: "ኣብ ዩኒቨርሲቲ ኣብ መወዳእታ ዓመት እየ። ስራሕ ንምርካብ እንታይ ዓይነት ፖርትፎሊዮ ከዳሉ ይግባእ?",
    translation: "I am in my final university year. What kind of portfolio should I prepare to improve my chances of finding work?",
    reactions: { betam: 10, awo: 28, respect: 49, funny: 0, interesting: 71, disagree: 0 },
    comments: [
      { id: "c-a1", author: "Hana", initials: "HA", text: "Show three strong projects and explain your decisions, not only the final screenshots.", time: "2h", likes: 28 },
    ],
  },
];

export const languageOptions: { id: FeedLanguage; label: string; native: string }[] = [
  { id: "all", label: "All", native: "All" },
  { id: "am", label: "Amharic", native: "አማርኛ" },
  { id: "om", label: "Afaan Oromo", native: "Afaan Oromo" },
  { id: "ti", label: "Tigrinya", native: "ትግርኛ" },
  { id: "en", label: "English", native: "English" },
];

export function compact(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
