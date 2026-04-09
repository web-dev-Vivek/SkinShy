/**
 * Safety Score Calculator
 * Calculates product safety based on user profile and ingredient data
 */

const calculateSafetyScore = (product, userProfile) => {
  let penalties = 0;
  let bonuses = 0;
  const breakdown = {
    categoryA: [],
    allergens: [],
    skinTypeMismatch: [],
    benefits: []
  };
  const warnings = [];

  if (!product || !product.ingredients) {
    return {
      score: 0,
      riskLevel: 'danger',
      message: 'Invalid product data'
    };
  }

  // Define skin type compatible ingredients
  const ingredientsSuitableFor = {
    'dry': ['emollient', 'occlusive', 'barrier', 'soothing', 'humectant'],
    'oily': ['humectant', 'solvent', 'buffers', 'exfoliant', 'antioxidant'],
    'combination': ['humectant', 'balancing', 'antioxidant'],
    'sensitive': ['soothing', 'barrier', 'humectant'],
    'normal': ['all']
  };

  const beneficialFor = {
    'dry': ['emollient', 'occlusive', 'barrier', 'humectant', 'soothing'],
    'oily': ['astringent', 'exfoliant', 'antioxidant'],
    'combination': ['balancing', 'antioxidant'],
    'sensitive': ['soothing', 'barrier'],
    'normal': []
  };

  // STAGE 1: Category A Analysis (if user has high sensitivity)
  if (userProfile.highSensitivity) {
    product.ingredients.forEach(ingredient => {
      if (ingredient.categoryType === 'A') {
        let penalty = 0;
        if (ingredient.reactivityScore >= 4) {
          penalty = 25;
        } else if (ingredient.reactivityScore === 3) {
          penalty = 15;
        }
        
        if (penalty > 0) {
          penalties += penalty;
          breakdown.categoryA.push({
            ingredient: ingredient.name,
            reactivity: ingredient.reactivityScore,
            penalty
          });
          warnings.push(`⚠️ Highly reactive ingredient "${ingredient.name}" detected`);
        }
      }
    });
  }

  // STAGE 2: Allergen Triggers
  product.ingredients.forEach(ingredient => {
    if (ingredient.knownAllergen && userProfile.knownAllergies) {
      if (userProfile.knownAllergies.includes(ingredient.allergenGroup)) {
        let penalty = 0;

        if (ingredient.categoryType === 'A') {
          penalty = 20;
        } else if (ingredient.categoryType === 'B') {
          if (ingredient.position <= 2) {
            penalty = 15;
          } else if (ingredient.position <= 5) {
            penalty = 8;
          } else if (ingredient.position <= 15) {
            penalty = 3;
          } else if (ingredient.position <= 30) {
            penalty = 1;
          }
        }

        if (penalty > 0) {
          penalties += penalty;
          breakdown.allergens.push({
            ingredient: ingredient.name,
            allergenGroup: ingredient.allergenGroup,
            position: ingredient.position,
            penalty
          });
          warnings.push(`🛑 ALLERGEN: "${ingredient.name}" (${ingredient.allergenGroup}) found in product`);
        }
      }
    }
  });

  // STAGE 3: Skin Type Compatibility
  if (userProfile.skinType && userProfile.skinType !== 'normal') {
    product.ingredients.forEach(ingredient => {
      if (ingredient.categoryType === 'B') {
        const unsuitable = !ingredientsSuitableFor[userProfile.skinType].includes(ingredient.ingredientClass) &&
                          ingredientsSuitableFor[userProfile.skinType][0] !== 'all';

        if (unsuitable) {
          let penalty = 0;
          if (ingredient.position <= 2) {
            penalty = 12;
          } else if (ingredient.position <= 5) {
            penalty = 6;
          } else if (ingredient.position <= 15) {
            penalty = 2;
          }

          if (penalty > 0) {
            penalties += penalty;
            breakdown.skinTypeMismatch.push({
              ingredient: ingredient.name,
              class: ingredient.ingredientClass,
              position: ingredient.position,
              penalty
            });
          }
        }
      }
    });
  }

  // BONUSES: Positive Ingredients
  if (userProfile.skinType) {
    const beneficialIngredients = product.ingredients.filter(ing =>
      ing.position <= 5 &&
      beneficialFor[userProfile.skinType] &&
      beneficialFor[userProfile.skinType].includes(ing.ingredientClass)
    );

    beneficialIngredients.forEach(ing => {
      bonuses += 3;
      breakdown.benefits.push({
        ingredient: ing.name,
        class: ing.ingredientClass,
        bonus: 3
      });
    });

    if (beneficialIngredients.length >= 3) {
      bonuses += 5;
      breakdown.benefits.push({
        ingredient: 'Multiple beneficial ingredients',
        bonus: 5
      });
    }
  }

  // FINAL SCORE CALCULATION
  let finalScore = Math.max(0, Math.min(100, 100 - penalties + bonuses));

  // Determine risk level
  let riskLevel = 'very_safe';
  if (finalScore < 30) riskLevel = 'danger';
  else if (finalScore < 50) riskLevel = 'high';
  else if (finalScore < 70) riskLevel = 'moderate';
  else if (finalScore < 85) riskLevel = 'safe';

  return {
    score: Math.round(finalScore),
    riskLevel,
    penalties: {
      categoryA: breakdown.categoryA.reduce((sum, item) => sum + item.penalty, 0),
      allergens: breakdown.allergens.reduce((sum, item) => sum + item.penalty, 0),
      skinTypeMismatch: breakdown.skinTypeMismatch.reduce((sum, item) => sum + item.penalty, 0),
      total: penalties
    },
    bonuses: {
      total: bonuses
    },
    breakdown,
    warnings,
    recommendation: getRec(finalScore, warnings.length)
  };
};

const getRec = (score, warningCount) => {
  if (warningCount > 0 && score < 60) {
    return '🛑 NOT RECOMMENDED - Contains allergens or high-risk ingredients';
  }
  if (score < 30) return '🛑 AVOID - High risk product';
  if (score < 50) return '⚠️ NOT RECOMMENDED - High risk';
  if (score < 70) return '⚠️ USE WITH CAUTION - Moderate risk, test patch recommended';
  if (score < 85) return '✅ GENERALLY SAFE - Suitable for most users';
  return '✅ VERY SAFE - Highly recommended';
};

module.exports = { calculateSafetyScore };
