// All the words on the site live here, so you can edit them without touching components.

// TODO: replace with your real email, it is what the "Copy email" button copies.
export const EMAIL = "your.email@example.com";

// TODO: add your profile URLs. Entries with an empty href are hidden.
export const SOCIALS: { label: string; href: string }[] = [
  { label: "GitHub", href: "" },
  { label: "LinkedIn", href: "" },
];

export type ProjectId = "subtrack" | "buyit" | "xavirgin" | "avengers";

export interface Project {
  id: ProjectId;
  name: string;
  kind: "app" | "terminal";
  status: string;
  blurb: string;
  tags: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "subtrack",
    name: "SubTrack",
    kind: "app",
    status: "Flutter app",
    blurb:
      "A subscription tracker that keeps billing cycles, monthly spending and renewals in one place, with spending analytics and a calendar view.",
    tags: ["Flutter", "GetX", "Hive", "Firebase Notifications"],
  },
  {
    id: "buyit",
    name: "Should I Buy It?",
    kind: "app",
    status: "In progress",
    blurb:
      "An AI-assisted purchase decision app. Answer a few questions about the product, your finances and your motivation, and get a BUY, WAIT or DON'T BUY verdict.",
    tags: ["Flutter", "Supabase", "Edge Functions", "AI"],
  },
  {
    id: "xavirgin",
    name: "XAVIRGIN",
    kind: "app",
    status: "Internship",
    blurb:
      "Flutter internship on a large-scale NGO app: Clean Architecture, RESTful API integration and payment gateway implementations.",
    tags: ["Flutter", "Clean Architecture", "REST APIs", "Payments"],
  },
  {
    id: "avengers",
    name: "Avengers Terminal Database",
    kind: "terminal",
    status: "C++",
    blurb:
      "A cross-platform C++ terminal database with battle simulators, tournament brackets, JSON data loading, clearance levels and mission deployment modes.",
    tags: ["C++", "nlohmann/json", "CLI"],
  },
];

export const ABOUT = {
  paragraphs: [
    "I'm Haseeb, a Flutter developer and Computer Science student at the University of Central Punjab in Lahore. I like building apps that feel solid on both Android and iPhone from a single codebase.",
    "I care about structure as much as screens: Clean Architecture, predictable state management, and APIs and payment flows that behave when real money and real users are involved.",
    "Outside my own projects, I'm a Teaching Assistant for Programming Fundamentals in C++ at UCP.",
  ],
  facts: [
    { label: "Focus", value: "Flutter and mobile app development" },
    { label: "Education", value: "BS Computer Science, UCP Lahore (expected July 2027)" },
    { label: "Experience", value: "Flutter intern at XAVIRGIN" },
    { label: "Teaching", value: "TA, Programming Fundamentals in C++" },
  ],
};
