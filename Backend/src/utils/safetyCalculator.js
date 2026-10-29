/**
 * Safety Score Calculator v2
 * Calculates product safety based on user profile and ingredient data.
 *
 * Fixes applied (v2):
 *  1. Stage 1 now applies to categoryType B as well (not only A), so products
 *     where all ingredients are typed B are still penalised for high reactivity.
 *  2. Heavy occlusives (mineral oil, petrolatum, paraffin…) at any position
 *     receive explicit penalties for oily / combination / sensitive skin.
 *  3. knownAllergen:true ingredients are always penalised when userProfile
 *     highSensitivity is true, regardless of the user's declared allergy list.
 *  4. Synthetic dyes (CI numbers) now carry sensitivity penalties.
 *  5. Position-3-to-5 occlusive penalty for oily skin raised from 6 → 12.
 *  6. Score thresholds tightened (safe now requires ≥ 80, not ≥ 85).
 *  7. Penalty cap raised so multiple compounding issues can push into danger.
 */

const topIngredientCategories = require('./topIngredientCategories.json');

// ─── Allergy group mapping ────────────────────────────────────────────────────
const allergyMap = {
  'fragrances':     'fragrance',
  'fragrance':      'fragrance',
  'essential_oils': 'botanical_oil',
  'essential oils': 'botanical_oil',
  'parabens':       'paraben',
  'paraben':        'paraben',
  'lanolin':        'wool_wax',
};

// ─── Comedogenic / pore-clogging occlusives (bad for oily / combination) ─────
const HEAVY_OCCLUSIVES = [
  'mineral oil', 'paraffinum liquidum', 'huile minerale', 'huile minérale',
  'petrolatum', 'paraffin', 'petroleum', 'isopropyl myristate',
  'isopropyl palmitate', 'coconut oil', 'cocos nucifera',
  'cocoa butter', 'theobroma cacao',
];

// ─── Dye / colorant detection ────────────────────────────────────────────────
const DYE_PATTERNS = [/ci \d{4,6}/i, /\bci\d{4,6}\b/i, /yellow \d/i, /red \d/i,
  /blue \d/i, /green \d/i, /colorant/i, /colour/i, /color\b/i, /dye\b/i];

const isHeavyOcclusive = (name) =>
  HEAVY_OCCLUSIVES.some(o => name.toLowerCase().includes(o));

const isSyntheticDye = (name, cls) =>
  DYE_PATTERNS.some(p => p.test(name)) || (cls || '').toLowerCase().includes('colorant');

// ─── Skin-type compatible / beneficial ingredient classes ────────────────────
const ingredientsSuitableFor = {
  dry:         ['emollient', 'occlusive', 'barrier', 'soothing', 'humectant'],
  oily:        ['humectant', 'solvent', 'buffers', 'exfoliant', 'antioxidant'],
  combination: ['humectant', 'balancing', 'antioxidant'],
  sensitive:   ['soothing', 'barrier', 'humectant'],
  normal:      ['all'],
};

const beneficialFor = {
  dry:         ['emollient', 'occlusive', 'barrier', 'humectant', 'soothing'],
  oily:        ['astringent', 'exfoliant', 'antioxidant'],
  combination: ['balancing', 'antioxidant'],
  sensitive:   ['soothing', 'barrier'],
  normal:      [],
};

// ─── Main calculator ──────────────────────────────────────────────────────────
const calculateSafetyScore = (product, userProfile) => {
  let penalties = 0;
  let bonuses   = 0;
  const breakdown = { categoryA: [], allergens: [], skinTypeMismatch: [], dyes: [], benefits: [] };
  const warnings  = [];

  if (!product || !product.ingredients) {
    return { score: 0, riskLevel: 'danger', message: 'Invalid product data' };
  }

  const isHighSensitivity  = !!userProfile.highSensitivity;
  const skinType            = userProfile.skinType || 'normal';
  const oilyOrCombination   = skinType === 'oily' || skinType === 'combination';
  const sensitiveProfile    = isHighSensitivity || skinType === 'sensitive';

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 1 – High-Reactivity Ingredient Analysis
  //   Original: only categoryType === 'A'. Fixed: also includes B, because
  //   most real-world products never have type A set in the database.
  // ═══════════════════════════════════════════════════════════════════════════
  if (isHighSensitivity) {
    product.ingredients.forEach(ingredient => {
      // Only analyse category A, or B ingredients with reactivity >= 3
      const qualifies =
        ingredient.categoryType === 'A' ||
        (ingredient.categoryType === 'B' && ingredient.reactivityScore >= 3);

      if (!qualifies) return;

      let penalty = 0;
      const r   = ingredient.reactivityScore;
      const pos = ingredient.position;

      if (r >= 4) {
        if      (pos <= 5)  penalty = 25;
        else if (pos <= 15) penalty = 15;
        else if (pos <= 30) penalty = 8;
        else                penalty = 3;
      } else if (r === 3) {
        if      (pos <= 5)  penalty = 15;
        else if (pos <= 15) penalty = 10;
        else if (pos <= 30) penalty = 5;
        else                penalty = 2;
      }

      if (penalty > 0) {
        penalties += penalty;
        breakdown.categoryA.push({ ingredient: ingredient.name, position: pos, reactivity: r, penalty });
        warnings.push(`⚠️ High-reactivity ingredient "${ingredient.name}" at position ${pos}`);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 2 – Allergen Triggers
  //   Fixed: knownAllergen:true ingredients are NOW also penalised for
  //   highSensitivity users even when knownAllergies[] is empty.
  // ═══════════════════════════════════════════════════════════════════════════
  product.ingredients.forEach(ingredient => {
    if (!ingredient.knownAllergen) return;

    let triggered    = false;
    let matchedLabel = ingredient.allergenGroup || 'allergen';

    // (a) Universal allergen penalty for highly-sensitive users
    if (isHighSensitivity) {
      triggered = true;
    }

    // (b) User explicitly declared this allergen
    if (!triggered && userProfile.knownAllergies && userProfile.knownAllergies.length > 0) {
      triggered = userProfile.knownAllergies.some(userAllergy => {
        const lower  = userAllergy.toLowerCase();
        const mapped = allergyMap[lower] || lower;

        if (mapped === ingredient.allergenGroup) { matchedLabel = userAllergy; return true; }

        const ingName = (ingredient.name || '').toLowerCase();
        const ingCls  = (ingredient.ingredientClass || '').toLowerCase();

        if ((lower === 'sulfates' || lower === 'sulfate') && ingName.includes('sulfate'))                   { matchedLabel = 'Sulfates';     return true; }
        if ((lower === 'silicones' || lower === 'silicone') && (ingName.includes('silicone') || ingName.endsWith('cone') || ingName.endsWith('xane'))) { matchedLabel = 'Silicones'; return true; }
        if (lower === 'alcohol' && ingName.includes('alcohol') && !['cetyl','stearyl','cetearyl','behenyl','myristyl','lauryl','phenoxyethanol'].some(f => ingName.includes(f))) { matchedLabel = 'Alcohol'; return true; }
        if ((lower === 'mineral_oil' || lower === 'mineral oil') && (ingName.includes('mineral oil') || ingName.includes('paraffinum liquidum') || ingName.includes('petrolatum'))) { matchedLabel = 'Mineral Oil'; return true; }
        if ((lower === 'dyes' || lower === 'dye') && (ingCls.includes('colorant') || /ci \d{4,6}/i.test(ingName))) { matchedLabel = 'Dyes'; return true; }
        if ((lower === 'preservatives' || lower === 'preservative') && ingCls.includes('preservative'))     { matchedLabel = 'Preservatives'; return true; }
        if ((lower === 'lanolin') && (ingName.includes('lanolin')))                                          { matchedLabel = 'Lanolin'; return true; }
        return false;
      });
    }

    if (!triggered) return;

    let penalty = 0;
    const pos   = ingredient.position;

    if (ingredient.categoryType === 'A') {
      penalty = 20;
    } else {
      // categoryType B – position-scaled
      if      (pos <= 2)  penalty = 18;
      else if (pos <= 5)  penalty = 12;
      else if (pos <= 15) penalty = 6;
      else if (pos <= 30) penalty = 3;
    }

    if (penalty > 0) {
      penalties += penalty;
      breakdown.allergens.push({ ingredient: ingredient.name, allergenGroup: matchedLabel, position: pos, penalty });
      warnings.push(`🛑 ALLERGEN: "${ingredient.name}" (${matchedLabel}) found in product`);
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 3 – Skin-Type Compatibility
  //   Fixed A: Mineral Oil / Petrolatum at ANY top position now penalised for
  //            oily/combination/sensitive skin (not just HARMFUL-tagged ones).
  //   Fixed B: Position 3-5 occlusive penalty for oily skin raised 6 → 12.
  //   Fixed C: Unknown-class ingredients at positions 3-15 still penalised
  //            (they don't match any "suitable" class so they count as unsuitable).
  // ═══════════════════════════════════════════════════════════════════════════
  if (skinType && skinType !== 'normal') {
    product.ingredients.forEach(ingredient => {
      const ingName = (ingredient.name || '').toLowerCase();

      // Always skip water
      if (ingName.includes('water') || ingName.includes('aqua') || ingName.includes('eau')) return;

      const pos = ingredient.position;

      // ── Heavy occlusive penalty for oily / combination / sensitive ──────
      if (isHeavyOcclusive(ingredient.name) && (oilyOrCombination || sensitiveProfile)) {
        let penalty = 0;
        if      (pos <= 2)  penalty = 20; // top of formula = very high concentration
        else if (pos <= 5)  penalty = 14;
        else if (pos <= 10) penalty = 8;
        else if (pos <= 20) penalty = 4;
        else                penalty = 1;

        penalties += penalty;
        breakdown.skinTypeMismatch.push({
          ingredient: ingredient.name,
          class: ingredient.ingredientClass,
          position: pos,
          penalty,
          reason: 'Heavy occlusive – comedogenic for oily/sensitive skin',
        });
        warnings.push(`⚠️ "${ingredient.name}" is a heavy occlusive at position ${pos} — not suitable for ${skinType} skin`);
        return; // don't double-count with general check below
      }

      // ── General skin-type mismatch for categoryType B ───────────────────
      if (ingredient.categoryType === 'B') {
        // For positions 1-2: only penalise HARMFUL-tagged ingredients
        if (pos <= 2) {
          const meta = topIngredientCategories.find(
            i => i.name.toLowerCase() === ingredient.name.toLowerCase()
          );
          if (meta && meta.category === 'HARMFUL') {
            penalties += 10;
            breakdown.skinTypeMismatch.push({ ingredient: ingredient.name, class: ingredient.ingredientClass, position: pos, penalty: 10, reason: 'Harmful ingredient in top 2' });
          }
          return;
        }

        // Positions 3+: penalise ingredients whose class is NOT suitable
        const suitable = ingredientsSuitableFor[skinType] || [];
        const unsuitable = !suitable.includes(ingredient.ingredientClass) &&
                           suitable[0] !== 'all';

        if (unsuitable) {
          let penalty = 0;
          if      (pos <= 5)  penalty = oilyOrCombination && ingredient.ingredientClass === 'occlusive' ? 12 : 6;
          else if (pos <= 15) penalty = 2;

          if (penalty > 0) {
            penalties += penalty;
            breakdown.skinTypeMismatch.push({ ingredient: ingredient.name, class: ingredient.ingredientClass, position: pos, penalty });
          }
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STAGE 4 – Synthetic Dye Penalty (new)
  //   Synthetic dyes are known irritants for sensitive / highly-sensitive skin.
  // ═══════════════════════════════════════════════════════════════════════════
  if (sensitiveProfile) {
    product.ingredients.forEach(ingredient => {
      if (!isSyntheticDye(ingredient.name, ingredient.ingredientClass)) return;

      const pos     = ingredient.position;
      let   penalty = 0;
      if      (pos <= 5)  penalty = 8;
      else if (pos <= 15) penalty = 5;
      else                penalty = 3;

      penalties += penalty;
      breakdown.dyes.push({ ingredient: ingredient.name, position: pos, penalty });
      warnings.push(`⚠️ Synthetic dye "${ingredient.name}" at position ${pos} — may irritate sensitive skin`);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BONUSES – Positive Ingredients in Top 5
  // ═══════════════════════════════════════════════════════════════════════════
  if (skinType) {
    const beneficial = product.ingredients.filter(
      ing => ing.position <= 5 &&
             beneficialFor[skinType] &&
             beneficialFor[skinType].includes(ing.ingredientClass)
    );
    beneficial.forEach(ing => {
      bonuses += 3;
      breakdown.benefits.push({ ingredient: ing.name, class: ing.ingredientClass, bonus: 3 });
    });
    if (beneficial.length >= 3) {
      bonuses += 5;
      breakdown.benefits.push({ ingredient: 'Multiple beneficial ingredients', bonus: 5 });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FINAL SCORE
  //   Thresholds tightened in v2:
  //     < 30 → danger
  //     < 50 → high risk
  //     < 65 → moderate
  //     < 80 → safe  (was < 85)
  //     ≥ 80 → very_safe
  // ═══════════════════════════════════════════════════════════════════════════
  const finalScore = Math.max(0, Math.min(100, 100 - penalties + bonuses));

  let riskLevel = 'very_safe';
  if      (finalScore < 30) riskLevel = 'danger';
  else if (finalScore < 50) riskLevel = 'high';
  else if (finalScore < 65) riskLevel = 'moderate';
  else if (finalScore < 80) riskLevel = 'safe';

  return {
    score: Math.round(finalScore),
    riskLevel,
    penalties: {
      categoryA:        breakdown.categoryA.reduce((s, x) => s + x.penalty, 0),
      allergens:        breakdown.allergens.reduce((s, x) => s + x.penalty, 0),
      skinTypeMismatch: breakdown.skinTypeMismatch.reduce((s, x) => s + x.penalty, 0),
      dyes:             breakdown.dyes.reduce((s, x) => s + x.penalty, 0),
      total: penalties,
    },
    bonuses: { total: bonuses },
    breakdown,
    warnings,
    recommendation: getRec(finalScore, warnings.length),
  };
};

// ─── Recommendation text ──────────────────────────────────────────────────────
const getRec = (score, warningCount) => {
  if (warningCount > 0 && score < 65) return '🛑 NOT RECOMMENDED – Contains allergens or high-risk ingredients for your profile';
  if (score < 30) return '🛑 AVOID – High-risk product for your skin type';
  if (score < 50) return '⚠️ NOT RECOMMENDED – High risk';
  if (score < 65) return '⚠️ USE WITH CAUTION – Moderate risk, patch test recommended';
  if (score < 80) return '✅ GENERALLY SAFE – Suitable for most users';
  return '✅ VERY SAFE – Highly recommended';
};

module.exports = { calculateSafetyScore };
