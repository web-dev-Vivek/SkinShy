/**
 * Dynamic Onboarding Instructions
 * Provides detailed, actionable instructions for each onboarding question
 * These help users understand how to determine their skin type/condition
 */

export const ONBOARDING_INSTRUCTIONS = {
  skinType: {
    title: '🔍 Identify Your Skin Type',
    steps: [
      {
        number: 1,
        instruction: 'Cleanse your face thoroughly with a gentle cleanser and pat dry.'
      },
      {
        number: 2,
        instruction: 'Wait 30 minutes without applying any products. Let your skin return to its natural state.'
      },
      {
        number: 3,
        instruction: 'Now observe each skin type indicator below to find your match.'
      }
    ],
    indicators: {
      oily: {
        emoji: '💧',
        description: 'Visible shine and oiliness across most of your face. Your skin may feel slick to touch. Pores appear larger and visible.',
        test: 'If you notice oil throughout your T-zone, cheeks, and forehead by hour 2, you likely have oily skin.'
      },
      dry: {
        emoji: '🏜️',
        description: 'Feels tight, especially after cleansing. May have flaky patches or feel rough. Minimal shine across your face.',
        test: 'If you feel tightness and see no shine after 30 minutes, you likely have dry skin.'
      },
      combination: {
        emoji: '⚖️',
        description: 'Oily in the T-zone (forehead, nose, chin) but normal or dry on the cheeks. Most common skin type.',
        test: 'If T-zone feels oily but cheeks feel normal or slightly dry, you have combination skin.'
      },
      normal: {
        emoji: '✨',
        description: 'Balanced throughout your face. No excessive shine or tightness. Smooth texture with small pores.',
        test: 'If your skin feels comfortable without oily or dry patches, you have normal skin.'
      },
      sensitive: {
        emoji: '❤️‍🩹',
        description: 'Prone to redness, irritation, or burning sensations. Reacts quickly to products or environmental changes. May be itchy.',
        test: 'If you frequently experience redness, burning, or reactions to products, you have sensitive skin.'
      }
    }
  },

  highSensitivity: {
    title: '🎯 Assess Skin Sensitivity',
    steps: [
      {
        number: 1,
        instruction: 'Think about your skin\'s typical reactions over the past 3-6 months.'
      },
      {
        number: 2,
        instruction: 'Note if you experience any of these common sensitivity signs:'
      },
      {
        number: 3,
        instruction: 'Mark "Yes" if you have high sensitivity, even if occasional.'
      }
    ],
    signs: [
      '🔴 Redness or visible flushing after applying products',
      '🔥 Burning or stinging sensations',
      '🤔 Itching or persistent discomfort',
      '🌡️ Reactions to fragrance, alcohol, or certain ingredients',
      '😣 Swelling or puffiness around sensitive areas',
      '📌 Eczema, rosacea, or dermatitis history'
    ],
    note: 'High sensitivity doesn\'t mean you can\'t use skincare. It just means we\'ll recommend gentler, hypoallergenic options for you.'
  },

  knownAllergies: {
    title: '⚗️ Identify Ingredient Allergies',
    steps: [
      {
        number: 1,
        instruction: 'Review products you\'ve used that caused reactions on your skin.'
      },
      {
        number: 2,
        instruction: 'Check the ingredient list on those products to identify common culprits.'
      },
      {
        number: 3,
        instruction: 'Select any ingredients below that you\'ve reacted to in the past.'
      }
    ],
    ingredientGuide: {
      fragrances: {
        description: 'Natural or synthetic scents added to products. Can cause redness, itching, or burning.',
        commonProducts: 'Perfumed lotions, scented serums, fragrant creams'
      },
      essential_oils: {
        description: 'Concentrated plant extracts. Often irritating even at small concentrations.',
        commonProducts: 'Aromatherapy serums, essential oil blends'
      },
      alcohol: {
        description: 'Drying alcohols like ethanol or SD alcohol. Can cause irritation and tightness.',
        commonProducts: 'Toners, astringents, alcohol-based serums'
      },
      sulfates: {
        description: 'Harsh cleansing agents that strip natural oils. Common in foaming cleansers.',
        commonProducts: 'Foaming cleansers, harsh soaps'
      },
      parabens: {
        description: 'Preservatives that can trigger allergic reactions in sensitive individuals.',
        commonProducts: 'Most conventional moisturizers, foundations'
      },
      silicones: {
        description: 'Silky-feeling ingredients that can clog pores and trap bacteria.',
        commonProducts: 'Primers, serums, silky lotions'
      },
      mineral_oil: {
        description: 'Occlusive ingredient derived from petroleum. Can feel heavy and pore-clogging.',
        commonProducts: 'Heavy moisturizers, body oils'
      },
      lanolin: {
        description: 'Sheep wool derivative. Can cause reactions in those with wool allergies.',
        commonProducts: 'Rich creams, lip balms'
      }
    },
    note: 'When in doubt, skip it. There are plenty of great alternatives for any allergenic ingredient.'
  },

  productChangeRate: {
    title: '🔄 Understand Your Product Rotation',
    steps: [
      {
        number: 1,
        instruction: 'Think about your skincare habits over the past year.'
      },
      {
        number: 2,
        instruction: 'Estimate how often you completely switch to new products or brands.'
      },
      {
        number: 3,
        instruction: 'Select the option that best matches your habit.'
      }
    ],
    habits: {
      rarely: {
        emoji: '🌱',
        description: 'You stick with the same products for 6+ months before changing.',
        impact: 'Your skin has time to fully adapt. Good for building skin barrier strength.',
        recommendation: 'You can handle trying new or active ingredients'
      },
      occasionally: {
        emoji: '🔄',
        description: 'You try new products every 2-6 months or when current ones run out.',
        impact: 'Your skin adjusts well to gradual changes. Medium adaptation period.',
        recommendation: 'Introduce new ingredients slowly, one at a time'
      },
      frequently: {
        emoji: '⚡',
        description: 'You try new products every few weeks or monthly.',
        impact: 'Your skin may not fully adjust, leading to sensitivity or irritation.',
        recommendation: 'We\'ll focus on gentle, well-tolerated products for stability'
      },
      very_frequently: {
        emoji: '🎪',
        description: 'You change products weekly or constantly experiment.',
        impact: 'Your skin barrier may be compromised. Frequent changes = more irritation.',
        recommendation: 'We\'ll recommend a stable routine to help strengthen your skin'
      }
    },
    tip: 'The "slow and steady" approach typically leads to better long-term skin health!'
  }
};

export const getInstructionForQuestion = (questionId) => {
  return ONBOARDING_INSTRUCTIONS[questionId] || null;
};
