// ============================================================
// PROFILE
// ============================================================

export interface Profile {
  name: string;
  siteTitle: string; // shown in the title bar and browser tab

  role: string;
  location: string;
  tagline: string;

  bio: string; // multi-paragraph; split on "\n\n" when rendering
  skills: string[];
  currentFocus: string[];
  funFacts: string[];

  avatarUrl: string | null; // filename in /public, no leading slash, e.g. "avatar.jpg"
  resumeUrl: string | null; // filename in /public, no leading slash, e.g. "resume.pdf"

  github: string;
  linkedin: string;
  email: string;
}

export const profile: Profile = {
  name: "Guilherme [Morais]",
  siteTitle: "guilherme-morais.dev",

  role: "Computer Engineering Student @ IST Lisbon",
  location: "Lisbon, Portugal",
  tagline: "I turn ambitious ideas into working systems.",

  bio: `I'm Guilherme, a 19-year-old Computer Engineering student at Instituto Superior Técnico (IST) with a deep passion for games, programming, and turning creative ideas into working systems. I'm constantly sketching new concepts and projects — many still taking shape on paper, waiting for the right moment to be built.

My toolbox spans Python, C, C++, Rust, TypeScript, Prolog, and Assembly — and I'm always adding new languages to it.`,

  skills: [
    "Python",
    "C",
    "C++",
    "Rust",
    "TypeScript",
    "Prolog",
    "Assembly",
  ],

  currentFocus: [
    "Developing a personal, Python-based productivity system built around custom terminal commands — the long-term goal is evolving it into a self-built AI assistant for organization and automation.",

    "Studying Computer Engineering at Instituto Superior Técnico.",

    "Open to collaborating on ambitious projects with real impact.",

    "Always up for a conversation about technology, ideas, or long-term goals.",
  ],

  funFacts: [
    "I don't drink coffee at all.",

    "I love picking up new hobbies and skills just to see where they lead.",

    "When I commit to something, I stay focused until it's finished.",
  ],

  avatarUrl: "avatar.jpg",
  resumeUrl: "resume.pdf",

  github: "GuilhermeM0r4is",
  linkedin: "https://www.linkedin.com/in/guilherme-morais-6a5898418/",
  email: "guimmorais4@gmail.com",
};


// ============================================================
// EXPERIENCE TAB — professional summary (LinkedIn "About")
// ============================================================

export const aboutSummary = `I'm a focused, adaptable student at Instituto Superior Técnico with a strong interest in multimedia design, digital communication, and creative media. As Multimedia Designer at SINFO, I produce visual content, posters, social media assets, and digital campaigns — working closely with the Marketing team and beyond.

Before that, I spent two years and five months volunteering with Omnis Factum, contributing to immigrant integration and human rights initiatives — from public presentations to meetings with professionals and government representatives. The experience sharpened my communication, teamwork, public speaking, and problem-solving skills.

I'm committed to continuous self-learning — building both creative and technical skills and seeking out challenging opportunities. I also hold a Cambridge C1 Advanced English certificate, scoring 193.`;


// ============================================================
// WORK EXPERIENCE
// ============================================================

export interface WorkEntry {
  role: string;
  org: string;
  meta: string;
  bullets: string[];
}

export const workExperience: WorkEntry[] = [
  {
    role: "Multimedia Designer",
    org: "SINFO · Full-time",
    meta: "Sep 2026 – Present · Lisbon, Portugal · Hybrid",

    bullets: [
      "Design and produce visual content for announcements, events, campaigns, and digital communication.",

      "Create posters and promotional materials tailored to different audiences and platforms.",

      "Partner with the Marketing team to develop engaging social media content and creative campaigns.",

      "Contribute to SINFO's visual identity through digital media, graphic design, and multimedia assets.",

      "Help strengthen the event's brand presence online while keeping style and messaging consistent.",

      "Work within a creative, student-led technology organization connecting students, professionals, and industry leaders through talks, workshops, and networking.",
    ],
  },
];


// ============================================================
// EDUCATION
// ============================================================

export interface EducationEntry {
  school: string;
  degree: string;
  period: string;
  description: string;
}

export const education: EducationEntry[] = [
  {
    school: "Instituto Superior Técnico",
    degree: "Bachelor's Degree, Computer Engineering",
    period: "Sep 2025 – Jul 2028",

    description: `Activities & societies: SINFO, a student-led nonprofit technology event connecting students, professionals, and industry leaders through talks, workshops, networking, and career opportunities; and the University Mentorship Program, pairing students with experienced peers for academic, personal, and career guidance. A focused, hardworking student committed to continuous self-learning and building strong technical and creative skills.`,
  },
];


// ============================================================
// CERTIFICATIONS
// ============================================================

export interface CertificationEntry {
  name: string;
  issuer: string;
}

export const certifications: CertificationEntry[] = [
  {
    name: "Cambridge C1 Advanced (CAE) — Score 193",
    issuer: "Cambridge English",
  },
];


// ============================================================
// VOLUNTEERING
// ============================================================

export interface VolunteeringEntry {
  role: string;
  org: string;
  period: string;
  category: string;
  bullets: string[];
}

export const volunteering: VolunteeringEntry[] = [
  {
    role: "Student Volunteer",
    org: "Omnis Factum Associação",
    period: "Feb 2023 – Jun 2025 · 2 yrs 5 mos",
    category: "Social Services",

    bullets: [
      "Took part in a Portuguese NGO focused on immigrant integration, reconciliation, and the promotion of migrants' rights.",

      "Contributed to initiatives on social inclusion, equality, and community development.",

      "Took part in meetings with professionals and government ministers, sharing perspectives and proposing solutions for positive change.",

      "Delivered presentations introducing the organization's work and values to the high school community.",

      "Represented Omnis Factum at events, supporting outreach activities and public discussions.",

      "Developed communication, teamwork, public speaking, and civic engagement skills over two years and five months.",
    ],
  },
];


// ============================================================
// PROJECTS — fallback list, used only if the live GitHub
// fetch (by profile.github) fails
// ============================================================

export interface ProjectEntry {
  name: string;
  description: string;
  url: string;
  stars?: number;
  language?: string | null;
  fork?: boolean;
}

export const fallbackProjects: ProjectEntry[] = [
  {
    name: "project-one",
    description: "Add a real project or let the GitHub fetch take over.",
    url: "#",
  },
];
