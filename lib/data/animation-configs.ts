/**
 * Animation Configurations Library
 *
 * Provides 15 reusable animation presets with keyframes, duration, easing, and delay options.
 * Used throughout the SSM/PSI platform for consistent, smooth UI animations.
 */

export type AnimationEasing =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier(0.4, 0, 0.2, 1)' // Custom smooth
  | 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'; // Back ease

export interface AnimationConfig {
  name: string;
  keyframes: string;
  duration: number; // milliseconds
  easing: AnimationEasing;
  delay?: number; // milliseconds
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Keyframe definitions
const KEYFRAMES = {
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,

  fadeOut: `
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,

  slideUp: `
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,

  slideDown: `
    @keyframes slideDown {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,

  slideLeft: `
    @keyframes slideLeft {
      from {
        transform: translateX(20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  slideRight: `
    @keyframes slideRight {
      from {
        transform: translateX(-20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  scaleIn: `
    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,

  scaleOut: `
    @keyframes scaleOut {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(0.9);
        opacity: 0;
      }
    }
  `,

  bounce: `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      25% {
        transform: translateY(-10px);
      }
      50% {
        transform: translateY(0);
      }
      75% {
        transform: translateY(-5px);
      }
    }
  `,

  shake: `
    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translateX(-5px);
      }
      20%, 40%, 60%, 80% {
        transform: translateX(5px);
      }
    }
  `,

  pulse: `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }
  `,

  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,

  flip: `
    @keyframes flip {
      from {
        transform: perspective(400px) rotateY(0);
      }
      to {
        transform: perspective(400px) rotateY(360deg);
      }
    }
  `,

  accordionOpen: `
    @keyframes accordionOpen {
      from {
        height: 0;
        opacity: 0;
      }
      to {
        height: var(--radix-accordion-content-height);
        opacity: 1;
      }
    }
  `,

  accordionClose: `
    @keyframes accordionClose {
      from {
        height: var(--radix-accordion-content-height);
        opacity: 1;
      }
      to {
        height: 0;
        opacity: 0;
      }
    }
  `,
};

// Animation presets
const ANIMATIONS: Record<string, AnimationConfig> = {
  fadeIn: {
    name: 'fadeIn',
    keyframes: KEYFRAMES.fadeIn,
    duration: 300,
    easing: 'ease-in-out',
    fillMode: 'forwards',
  },

  fadeOut: {
    name: 'fadeOut',
    keyframes: KEYFRAMES.fadeOut,
    duration: 300,
    easing: 'ease-in-out',
    fillMode: 'forwards',
  },

  slideUp: {
    name: 'slideUp',
    keyframes: KEYFRAMES.slideUp,
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fillMode: 'forwards',
  },

  slideDown: {
    name: 'slideDown',
    keyframes: KEYFRAMES.slideDown,
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fillMode: 'forwards',
  },

  slideLeft: {
    name: 'slideLeft',
    keyframes: KEYFRAMES.slideLeft,
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fillMode: 'forwards',
  },

  slideRight: {
    name: 'slideRight',
    keyframes: KEYFRAMES.slideRight,
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fillMode: 'forwards',
  },

  scaleIn: {
    name: 'scaleIn',
    keyframes: KEYFRAMES.scaleIn,
    duration: 350,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    fillMode: 'forwards',
  },

  scaleOut: {
    name: 'scaleOut',
    keyframes: KEYFRAMES.scaleOut,
    duration: 350,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    fillMode: 'forwards',
  },

  bounce: {
    name: 'bounce',
    keyframes: KEYFRAMES.bounce,
    duration: 600,
    easing: 'ease-in-out',
    fillMode: 'forwards',
  },

  shake: {
    name: 'shake',
    keyframes: KEYFRAMES.shake,
    duration: 500,
    easing: 'ease-in-out',
    fillMode: 'forwards',
  },

  pulse: {
    name: 'pulse',
    keyframes: KEYFRAMES.pulse,
    duration: 1000,
    easing: 'ease-in-out',
    fillMode: 'forwards',
  },

  spin: {
    name: 'spin',
    keyframes: KEYFRAMES.spin,
    duration: 1000,
    easing: 'linear',
    fillMode: 'forwards',
  },

  flip: {
    name: 'flip',
    keyframes: KEYFRAMES.flip,
    duration: 600,
    easing: 'ease-in-out',
    fillMode: 'forwards',
  },

  accordionOpen: {
    name: 'accordionOpen',
    keyframes: KEYFRAMES.accordionOpen,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fillMode: 'forwards',
  },

  accordionClose: {
    name: 'accordionClose',
    keyframes: KEYFRAMES.accordionClose,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fillMode: 'forwards',
  },
};

/**
 * Get animation configuration by name
 *
 * @param name - Animation preset name
 * @param options - Optional overrides for duration, easing, delay
 * @returns Animation configuration object
 *
 * @example
 * ```ts
 * const fadeInConfig = getAnimation('fadeIn', { duration: 500, delay: 100 });
 * element.style.animation = `${fadeInConfig.name} ${fadeInConfig.duration}ms ${fadeInConfig.easing}`;
 * ```
 */
export function getAnimation(
  name: keyof typeof ANIMATIONS,
  options?: Partial<Pick<AnimationConfig, 'duration' | 'easing' | 'delay' | 'fillMode'>>
): AnimationConfig {
  const baseConfig = ANIMATIONS[name];

  if (!baseConfig) {
    console.warn(`Animation "${name}" not found. Falling back to fadeIn.`);
    return ANIMATIONS.fadeIn;
  }

  return {
    ...baseConfig,
    ...options,
  };
}

/**
 * Generate CSS animation string for inline styles
 *
 * @param name - Animation preset name
 * @param options - Optional overrides
 * @returns CSS animation string
 *
 * @example
 * ```tsx
 * <div style={{ animation: getAnimationCSS('slideUp', { delay: 200 }) }}>
 *   Content
 * </div>
 * ```
 */
export function getAnimationCSS(
  name: keyof typeof ANIMATIONS,
  options?: Partial<Pick<AnimationConfig, 'duration' | 'easing' | 'delay' | 'fillMode'>>
): string {
  const config = getAnimation(name, options);

  const parts = [
    config.name,
    `${config.duration}ms`,
    config.easing,
  ];

  if (config.delay) {
    parts.push(`${config.delay}ms`);
  }

  if (config.fillMode) {
    parts.push(config.fillMode);
  }

  return parts.join(' ');
}

/**
 * Get all keyframes as a single CSS string for injection into global styles
 *
 * @returns All keyframe definitions concatenated
 *
 * @example
 * ```tsx
 * // In globals.css or layout component
 * <style dangerouslySetInnerHTML={{ __html: getAllKeyframes() }} />
 * ```
 */
export function getAllKeyframes(): string {
  return Object.values(KEYFRAMES).join('\n');
}

/**
 * List of all available animation names
 */
export const ANIMATION_NAMES = Object.keys(ANIMATIONS) as Array<keyof typeof ANIMATIONS>;

export default ANIMATIONS;
