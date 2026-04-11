/**
 * WooNomad Design System — Tailwind Theme Extension
 * 
 * Mevcut shadcn/ui token'larını bozmadan yeni palette ve spacing ekler.
 * tailwind.config.ts'te extend bloğuna merge edilir.
 */

export const woonomadTheme = {
  colors: {
    sand: {
      50:  "#FAF8F5",
      100: "#F0EDE7",
      200: "#DDD9D0",
      300: "#C5BFB4",
      400: "#A19A8E",
      500: "#7A766C",
      600: "#5E5A52",
      700: "#474440",
      800: "#302E2B",
      900: "#1F1D19",
      950: "#0F0E0D",
    },
    ocean: {
      50:  "#EBF4FB",
      100: "#C4DEF4",
      200: "#9AC5EC",
      300: "#6BA9E2",
      400: "#4590D5",
      500: "#2E78B7",
      600: "#245F92",
      700: "#1B476E",
      800: "#12304B",
      900: "#0A1B2D",
    },
    coral: {
      50:  "#FBF0ED",
      100: "#F5D4C9",
      200: "#EEB3A1",
      300: "#E48D73",
      400: "#D86B4E",
      500: "#C24D2C",
      600: "#9A3D23",
      700: "#732D1A",
      800: "#4D1E11",
      900: "#280F09",
    },
    forest: {
      50:  "#EDF7F2",
      100: "#CEEADB",
      200: "#A5D9BD",
      300: "#74C49A",
      400: "#4AAE7B",
      500: "#2D8A5A",
      600: "#236E48",
      700: "#1A5236",
      800: "#113724",
      900: "#081D13",
    },
    amber: {
      50:  "#FDF6E6",
      100: "#FAE9BF",
      200: "#F5D88F",
      300: "#EFC45A",
      400: "#EAB040",
      500: "#C99A2E",
    },
  },

  fontFamily: {
    display: ['"Fraunces"', "Georgia", "serif"],
    body: ['"Figtree"', "system-ui", "sans-serif"],
    mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
  },

  fontSize: {
    "2xs": ["0.625rem", { lineHeight: "1" }],
  },

  spacing: {
    "section-y": "6rem",
    "section-y-sm": "4rem",
    "content-gap": "2rem",
    "card-padding": "1.5rem",
    "card-gap": "1.5rem",
    "inline-gap": "0.75rem",
    "stack-gap": "1rem",
    "page-gutter": "1.5rem",
    "page-gutter-lg": "2rem",
  },

  keyframes: {
    "wn-fade-up": {
      "0%": { opacity: "0", transform: "translateY(1.5rem)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
  },

  animation: {
    "wn-fade-up": "wn-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
  },
};
