export const Colors = {
  // Primary Colors
  primary: "#3864bb",
  primaryDark: "#2B4D99",
  accent: "#45c2c6",
  
  // Status Colors
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  
  // Neutral Colors
  background: "#F2F2F7",
  surface: "#FFFFFF",
  surfaceSecondary: "#F9F9F9",
  
  // Text Colors
  text: "#1C1C1E",
  textSecondary: "#8E8E93",
  textTertiary: "#C7C7CC",
  
  // Border Colors
  border: "#E5E5EA",
  borderLight: "rgba(0, 0, 0, 0.05)",
  
  // Overlay Colors
  overlay: "rgba(0, 0, 0, 0.7)",
  overlayLight: "rgba(0, 0, 0, 0.3)",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 50,
};

export const Typography = {
  // Headers
  heroTitle: {
    fontSize: 36,
    fontWeight: "700" as const,
    lineHeight: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 26,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 24,
  },
  bodySemibold: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  
  // Small text
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  captionSemibold: {
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 20,
  },
  
  // Tiny text
  footnote: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  footnoteMedium: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
  },
  footnoteSemibold: {
    fontSize: 12,
    fontWeight: "600" as const,
    lineHeight: 16,
  },
};

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Layout = {
  headerHeight: 120,
  tabBarHeight: 80,
  itemCardImageHeight: 220,
  buttonHeight: 48,
  inputHeight: 44,
};