export type BadgeCategory =
  | "met_in_person"
  | "real_life_friend"
  | "thanks_for_following"
  | "collaborator"
  | "event_buddy"
  | "custom";

export interface BadgeCategoryConfig {
  id: BadgeCategory;
  label: string;
  labelNL: string;
  emoji: string;
  description: string;
  filterColor: string;
  defaultMessage: string;
}

export const BADGE_CATEGORIES: BadgeCategoryConfig[] = [
  {
    id: "met_in_person",
    label: "We've met in person",
    labelNL: "We hebben elkaar ontmoet",
    emoji: "🤝",
    description: "You met this person IRL",
    filterColor: "#FE005B",
    defaultMessage: "Great meeting you IRL!",
  },
  {
    id: "real_life_friend",
    label: "Real life friend",
    labelNL: "Echte vriend",
    emoji: "💛",
    description: "A friend beyond the blockchain",
    filterColor: "#F59E0B",
    defaultMessage: "You're one of my people.",
  },
  {
    id: "thanks_for_following",
    label: "Thanks for following",
    labelNL: "Bedankt voor het volgen",
    emoji: "✨",
    description: "Appreciate the follow!",
    filterColor: "#8B5CF6",
    defaultMessage: "Thanks for following me!",
  },
  {
    id: "collaborator",
    label: "Collaborator",
    labelNL: "Samenwerker",
    emoji: "⚡",
    description: "We built something together",
    filterColor: "#06B6D4",
    defaultMessage: "Building the future together.",
  },
  {
    id: "event_buddy",
    label: "Event buddy",
    labelNL: "Evenement vriend",
    emoji: "🎪",
    description: "We were at the same event",
    filterColor: "#10B981",
    defaultMessage: "Glad we crossed paths!",
  },
  {
    id: "custom",
    label: "Custom",
    labelNL: "Aangepast",
    emoji: "🎨",
    description: "Your own badge",
    filterColor: "#FE005B",
    defaultMessage: "Special badge for you.",
  },
];