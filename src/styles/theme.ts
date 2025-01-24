export const theme = {
  colors: {
    primary: {
      main: '#1e40af', // Navy blue
      light: '#3b82f6',
      dark: '#1e3a8a',
    },
    accent: {
      orange: '#f97316',
      maroon: '#be123c',
      green: '#15803d',
    },
    neutral: {
      white: '#ffffff',
      background: '#f8fafc',
      lightGray: '#f1f5f9',
      beige: '#fef3c7',
    }
  }
} as const;

export type Theme = typeof theme;