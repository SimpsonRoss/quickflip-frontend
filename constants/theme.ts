export const Colors = {
  // Brand Colors
  primary: '#3864bb',
  primaryLight: '#4a7bc8',
  primaryDark: '#2651a3',
  
  // Semantic Colors
  success: '#34C759',
  successLight: '#52d76e',
  error: '#FF3B30',
  errorLight: '#ff5449',
  warning: '#FF9500',
  warningLight: '#ffab33',
  
  // UI Colors
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F9F9F9',
  
  // Text Colors
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textInverse: '#FFFFFF',
  
  // Border & Divider Colors
  border: 'rgba(0, 0, 0, 0.05)',
  borderLight: 'rgba(0, 0, 0, 0.02)',
  divider: '#E5E5EA',
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  
  // Status-specific brand colors
  purchased: {
    main: '#3864bb',
    background: 'rgba(56, 100, 187, 0.1)',
  },
  sold: {
    main: '#34C759',
    background: 'rgba(52, 199, 89, 0.1)',
  },
  scanned: {
    main: '#FF9500',
    background: 'rgba(255, 149, 0, 0.1)',
  },
  
  // Confidence levels
  confidence: {
    high: '#34C759',
    medium: '#FF9500',
    low: '#8E8E93',
  },
} as const;

export const Typography = {
  // Headers
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 30,
    color: Colors.textPrimary,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
    color: Colors.textPrimary,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  bodySemiBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  
  // Small text
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  captionSemiBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  
  // Small elements
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: Colors.textInverse,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
    color: Colors.textInverse,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 50,
} as const;

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const Layout = {
  screenPadding: Spacing.base,
  cardPadding: Spacing.lg,
  headerHeight: 120,
  tabBarHeight: 83,
} as const;

// Utility functions
export const createButtonStyle = (
  variant: 'primary' | 'secondary' | 'danger' = 'primary',
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  const baseStyle = {
    borderRadius: BorderRadius.sm,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    ...Shadows.small,
  };

  const sizeStyles = {
    small: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      minHeight: 32,
      gap: Spacing.xs,
    },
    medium: {
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      minHeight: 40,
      gap: Spacing.sm,
    },
    large: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      minHeight: 48,
      gap: Spacing.sm,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: Colors.primary,
    },
    secondary: {
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    danger: {
      backgroundColor: Colors.error,
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

export const createBadgeStyle = (variant: 'primary' | 'success' | 'warning' | 'neutral' = 'primary') => {
  const baseStyle = {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const variantStyles = {
    primary: {
      backgroundColor: Colors.primary,
    },
    success: {
      backgroundColor: Colors.success,
    },
    warning: {
      backgroundColor: Colors.warning,
    },
    neutral: {
      backgroundColor: Colors.textSecondary,
    },
  };

  return {
    ...baseStyle,
    ...variantStyles[variant],
  };
};