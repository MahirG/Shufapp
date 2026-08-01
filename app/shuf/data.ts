import { Activity, CircleUserRound, Clock3, Compass, Flame, Gamepad2, Heart, Home, Laugh, MessageCircleHeart, MessageSquare, MoonStar, PartyPopper, ShieldCheck, Sparkles, Star, Swords, Target, Trophy, Users, WandSparkles } from "lucide-react";

export type View = "home" | "circles" | "play" | "discover" | "chat" | "activity" | "profile";
export type Game = "balloon" | "blind" | "panel" | null;
export type Flag = "green" | "red" | "wild";
export type ModalName = "notifications" | "settings" | "about" | "achievements" | "new-chat" | "search" | null;
export type ThemeMode = "system" | "dark" | "light";
export type FeedLanguage = "all" | "am" | "om" | "ti" | "en";
export type ShufSettings = {
  theme: ThemeMode;
  sound: boolean;
  motion: boolean;
  messagePreview: boolean;
  lowData: boolean;
  language: FeedLanguage;
};

export type Suitor = {
  name: string;
  age: number;
  job: string;
  trait: string;
  bio: string;
  flag: Flag;
  interests: string[];
  initials: string;
};

export type ChatMessage = {
  id: string;
  sender: "me" | "them" | "system";
  text: string;
  time: string;
  status?: "sent" | "read";
  reaction?: string;
  attachment?: string;
};

export type Conversation = {
  id: string;
  name: string;
  initials: string;
  accent: number;
  role: string;
  preview: string;
  time: string;
  online: boolean;
  unread: number;
  pinned: boolean;
  muted: boolean;
  messages: ChatMessage[];
};

export type NotificationItem = {
  id: string;
  title: string;
  text: string;
  time: string;
  read: boolean;
  icon: "match" | "message" | "trophy" | "community";
};

export const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "circles", label: "Circles", icon: Users },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "play", label: "Shuf Games", icon: Gamepad2 },
  { id: "chat", label: "Messages", icon: MessageSquare },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "profile", label: "Profile", icon: CircleUserRound },
];

export const bottomNavItems = navItems.filter((item) => ["home", "circles", "chat", "profile"].includes(item.id));

export const suitors: Suitor[] = [
  { name: "Nardos", age: 26, job: "Creative strategist", trait: "Sings karaoke every Friday. No exceptions.", bio: "Creative by day, karaoke legend by night. She says yes to spontaneous road trips and remembers every tiny detail.", flag: "green", interests: ["Music", "Road trips", "Design"], initials: "NA" },
  { name: "Samuel", age: 29, job: "Architect", trait: "Still has his ex's cat saved as ‘Home.’", bio: "Thoughtful and quietly funny, with a complicated cat-custody story the panel absolutely wants explained.", flag: "red", interests: ["Architecture", "Cats", "Coffee"], initials: "SA" },
  { name: "Betelhem", age: 27, job: "Founder", trait: "Plans every date two weeks in advance.", bio: "Reliable, ambitious and always early. She is building a local wellness brand and loves an intentional plan.", flag: "green", interests: ["Wellness", "Business", "Books"], initials: "BE" },
  { name: "Yonas", age: 31, job: "Civil engineer", trait: "Double-texts after exactly ninety seconds.", bio: "Warm, direct and a little intense about response times. He can design a bridge but cannot tolerate a read receipt.", flag: "red", interests: ["Football", "Travel", "Tech"], initials: "YO" },
  { name: "Selam", age: 25, job: "Food creator", trait: "Once drove three hours for one specific plate of injera.", bio: "A loyal foodie with a camera roll full of hidden restaurants. She will plan the entire evening and the backup plan.", flag: "green", interests: ["Food", "Culture", "Photography"], initials: "SE" },
  { name: "Dawit", age: 30, job: "Product manager", trait: "Brings up his ex in the first ten minutes.", bio: "Funny, ambitious and self-aware enough to admit he is still learning how to leave the past in the past.", flag: "red", interests: ["Startups", "Cinema", "Running"], initials: "DA" },
  { name: "Ruth", age: 28, job: "Lawyer", trait: "Has a five-year plan and a backup five-year plan.", bio: "Grounded, decisive and calm under pressure. She values a partner who can keep up without turning life into a race.", flag: "wild", interests: ["Policy", "Pilates", "Travel"], initials: "RU" },
  { name: "Amanuel", age: 32, job: "Film editor", trait: "Considers ‘maybe’ a complete answer.", bio: "Laid-back to a fault. The panel cannot decide whether it is emotional intelligence or elite-level avoidance.", flag: "wild", interests: ["Film", "Jazz", "Cooking"], initials: "AM" },
  { name: "Hana", age: 26, job: "UX designer", trait: "Plans every date around a rooftop sunset.", bio: "A hopeful romantic who remembers your coffee order forever and has a playlist for every possible mood.", flag: "green", interests: ["Design", "Music", "Sunsets"], initials: "HA" },
  { name: "Mikiyas", age: 29, job: "Consultant", trait: "Answers ‘what are you looking for?’ with a shrug.", bio: "Effortlessly charming in the room and suspiciously vague about almost everything outside it.", flag: "red", interests: ["Fitness", "Travel", "Finance"], initials: "MI" },
  { name: "Liya", age: 27, job: "Photographer", trait: "Has a group chat dedicated to vetting her dates.", bio: "Loyal to her people and slow to trust. Her friends say the committee is strict because the prize is worth it.", flag: "wild", interests: ["Photography", "Art", "Hiking"], initials: "LI" },
  { name: "Elias", age: 33, job: "Doctor", trait: "Shows up fifteen minutes early to everything.", bio: "Reliable, composed and a little rigid. The panel calls him the safe pick—and means it as a compliment.", flag: "wild", interests: ["Medicine", "Chess", "Running"], initials: "EL" },
];

export const blindQuestions = [
  { question: "Your perfect Friday night?", eyebrow: "Set the energy", options: [{ label: "Dinner and a long conversation", icon: MessageCircleHeart }, { label: "A lively night out with friends", icon: PartyPopper }, { label: "A quiet movie and great food", icon: MoonStar }, { label: "No plan—let the night decide", icon: WandSparkles }] },
  { question: "What matters most at first?", eyebrow: "Choose your signal", options: [{ label: "Emotional maturity", icon: ShieldCheck }, { label: "Ambition and direction", icon: Target }, { label: "Humor and easy chemistry", icon: Laugh }, { label: "Shared values", icon: Heart }] },
  { question: "Pick your dealbreaker", eyebrow: "Draw a boundary", options: [{ label: "Poor communication", icon: MessageCircleHeart }, { label: "No personal ambition", icon: Trophy }, { label: "Always running late", icon: Clock3 }, { label: "Jealous or controlling", icon: Swords }] },
  { question: "Your ideal first date?", eyebrow: "Make it real", options: [{ label: "Coffee and a long walk", icon: Compass }, { label: "A polished dinner", icon: Star }, { label: "Games and playful competition", icon: Gamepad2 }, { label: "A new place neither knows", icon: Sparkles }] },
];

export const stories = [
  { name: "Betty", role: "Third date", initials: "BT", story: "He planned a city-wide scavenger hunt that ended at his favorite restaurant. It was thoughtful, but I was exhausted before we even ordered.", stat: "63% of viewers called it romantic" },
  { name: "Robel", role: "First date", initials: "RO", story: "She arrived forty minutes late without an explanation, then opened a calculator to split every item on the bill down to the cent.", stat: "71% of viewers voted harsh" },
  { name: "Fasika", role: "Second date", initials: "FA", story: "He brought his mother’s homemade dabo as a gift and spent the whole evening asking thoughtful questions without checking his phone once.", stat: "86% of viewers loved it" },
  { name: "Nathan", role: "First date", initials: "NT", story: "She stayed on the phone with her sister for most of the date, then put me on speaker so the sister could ‘vet’ me in real time.", stat: "92% of viewers said run" },
  { name: "Meaza", role: "Blind date", initials: "ME", story: "He admitted five minutes in that he only came because his friends dared him. Then he stayed for three hours and asked for another date.", stat: "The audience was perfectly split" },
];

export const initialActivity = [
  { id: "a1", icon: Trophy, title: "New panel rank", text: "You reached Sharp Observer", time: "12 min", tone: "gold", read: false, target: "profile" as View },
  { id: "a2", icon: Heart, title: "Compatibility saved", text: "Your 91% match with Hana", time: "2 hr", tone: "pink", read: false, target: "chat" as View },
  { id: "a3", icon: Flame, title: "Circle invitation", text: "Ethiopian Tech Builders invited you to a room", time: "Yesterday", tone: "orange", read: false, target: "circles" as View },
  { id: "a4", icon: Users, title: "Community result", text: "8,412 people joined the same discussion", time: "Yesterday", tone: "violet", read: true, target: "home" as View },
];

export const initialNotifications: NotificationItem[] = [
  { id: "n1", title: "Hana replied", text: "That rooftop idea actually sounds perfect.", time: "2m", read: false, icon: "message" },
  { id: "n2", title: "Oromia Creators is live", text: "A multilingual creator audio room just started.", time: "18m", read: false, icon: "community" },
  { id: "n3", title: "New match signal", text: "Your latest Blind Match reached 91% compatibility.", time: "1h", read: false, icon: "match" },
  { id: "n4", title: "Community pulse", text: "Your verdict is now in the top 18% most discussed.", time: "1d", read: true, icon: "community" },
];

export const initialConversations: Conversation[] = [
  { id: "hana", name: "Hana", initials: "HA", accent: 4, role: "UX designer · 91% match", preview: "That rooftop idea actually sounds perfect.", time: "2m", online: true, unread: 2, pinned: true, muted: false, messages: [{ id: "h1", sender: "system", text: "You matched through Blind Match · 91% compatibility", time: "Today" }, { id: "h2", sender: "them", text: "Okay, the no-photo matching idea was surprisingly accurate 😄", time: "5:41 PM" }, { id: "h3", sender: "me", text: "Right? Your rooftop sunset answer gave it away.", time: "5:43 PM", status: "read" }, { id: "h4", sender: "them", text: "That rooftop idea actually sounds perfect.", time: "5:46 PM", reaction: "✨" }] },
  { id: "nardos", name: "Nardos", initials: "NA", accent: 0, role: "Creative strategist", preview: "Karaoke is only embarrassing if you hesitate.", time: "18m", online: true, unread: 0, pinned: false, muted: false, messages: [{ id: "na1", sender: "them", text: "Karaoke is only embarrassing if you hesitate.", time: "5:20 PM" }, { id: "na2", sender: "me", text: "That sounds suspiciously like a challenge.", time: "5:22 PM", status: "read" }] },
  { id: "community", name: "Shuf Aftershow", initials: "SH", accent: 5, role: "Community room · 4.8K members", preview: "Tonight’s question: romantic or controlling?", time: "1h", online: true, unread: 5, pinned: true, muted: false, messages: [{ id: "c1", sender: "system", text: "Welcome to the Shuf Aftershow room", time: "Today" }, { id: "c2", sender: "them", text: "Tonight’s question: romantic or controlling? Planning every detail of a first date.", time: "4:52 PM" }, { id: "c3", sender: "me", text: "Romantic if there is room to change the plan.", time: "4:57 PM", status: "read", reaction: "❤️" }] },
  { id: "betelhem", name: "Betelhem", initials: "BE", accent: 2, role: "Founder", preview: "Two weeks is not overplanning. It is respect.", time: "Tue", online: false, unread: 0, pinned: false, muted: true, messages: [{ id: "b1", sender: "them", text: "Two weeks is not overplanning. It is respect.", time: "Tuesday" }, { id: "b2", sender: "me", text: "The panel may need a full presentation on this.", time: "Tuesday", status: "read" }] },
];

export const modeCards = [
  { id: "balloon" as const, label: "Elimination game", title: "Pop the Balloon", copy: "Six personalities. Five decisions. One unexpected match.", icon: PartyPopper, meta: "3 min", players: "12.8K playing", className: "mode-pink" },
  { id: "blind" as const, label: "Compatibility", title: "Blind Match", copy: "No photos. No names. Four questions and a match built on the vibe.", icon: MessageCircleHeart, meta: "2 min", players: "8.4K playing", className: "mode-violet" },
  { id: "panel" as const, label: "Audience verdict", title: "The Panel", copy: "Read the story. Make the call. See whether the audience agrees.", icon: Swords, meta: "4 min", players: "21.6K playing", className: "mode-blue" },
];

export const autoReplies = ["That is a genuinely good answer. Tell me more.", "Okay, I did not expect that 😄", "We might actually agree on this one.", "That sounds like a story for the Aftershow.", "I like the way you think. What happens next?"];
