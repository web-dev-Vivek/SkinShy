import React from 'react';
import { getInstructionForQuestion } from '../../data/onboardingInstructions';

export default function OnboardingInstructionsPanel({ questionId }) {
  const instruction = getInstructionForQuestion(questionId);

  if (!instruction) {
    return null;
  }

  const renderSkinTypeIndicators = () => {
    if (!instruction.indicators) return null;

    return (
      <div className="mt-6 space-y-3">
        <p className="text-xs font-lato text-gray-300 font-semibold uppercase tracking-wide">
          Look for these signs:
        </p>
        {Object.entries(instruction.indicators).map(([skinType, info]) => (
          <div key={skinType} className="bg-white/5 border border-white/10 rounded-lg p-3 text-left">
            <p className="text-xs font-lato text-gray-200 capitalize font-semibold mb-1">{skinType}</p>
            <p className="text-xs font-lato text-gray-300 leading-relaxed mb-2">
              {info.description}
            </p>
            <p className="text-xs font-lato text-gray-400 italic">
              {info.test}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderSensitivitySigns = () => {
    if (!instruction.signs) return null;

    return (
      <div className="mt-6 space-y-2">
        <p className="text-xs font-lato text-gray-300 font-semibold uppercase tracking-wide mb-3">
          Common sensitivity signs:
        </p>
        {instruction.signs.map((sign, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs font-lato text-gray-200">
            <span className="text-gray-400 mt-1">-</span>
            <span>{sign}</span>
          </div>
        ))}
        {instruction.note && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs font-lato text-gray-300 italic">
              {instruction.note}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderAllergiesGuide = () => {
    if (!instruction.ingredientGuide) return null;

    return (
      <div className="mt-6 space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5">
        {Object.entries(instruction.ingredientGuide).map(([ingredient, info]) => (
          <div key={ingredient} className="bg-white/5 border border-white/10 rounded p-2.5 text-left">
            <p className="text-xs font-lato text-gray-200 font-semibold capitalize mb-1">
              {ingredient.replace('_', ' ')}
            </p>
            <p className="text-xs font-lato text-gray-300 leading-tight mb-1">
              {info.description}
            </p>
            <p className="text-xs font-lato text-gray-400 text-left">
              Found in: {info.commonProducts}
            </p>
          </div>
        ))}
        {instruction.note && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs font-lato text-gray-300 italic">
              {instruction.note}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderProductHabits = () => {
    if (!instruction.habits) return null;

    return (
      <div className="mt-6 space-y-2">
        <p className="text-xs font-lato text-gray-300 font-semibold uppercase tracking-wide mb-3">
          Find your habit:
        </p>
        {Object.entries(instruction.habits).map(([habit, info]) => (
          <div key={habit} className="bg-white/5 border border-white/10 rounded-lg p-3 text-left">
            <p className="text-xs font-lato text-gray-200 font-semibold capitalize mb-1">
              {habit.replace('_', ' ')}
            </p>
            <p className="text-xs font-lato text-gray-300 leading-relaxed mb-1.5">
              {info.description}
            </p>
            <div className="bg-white/5 rounded p-1.5 space-y-1">
              <p className="text-xs font-lato text-gray-300">
                <span className="font-semibold text-gray-200">Impact:</span> {info.impact}
              </p>
              <p className="text-xs font-lato text-gray-300">
                <span className="font-semibold text-gray-200">Recommendation:</span> {info.recommendation}
              </p>
            </div>
          </div>
        ))}
        {instruction.tip && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs font-lato text-gray-300 italic">
              {instruction.tip}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="text-sm font-playfair font-bold text-white flex items-center gap-2">
        {instruction.title}
      </h3>

      {/* Steps */}
      {instruction.steps && instruction.steps.length > 0 && (
        <div className="space-y-2">
          {instruction.steps.map((step) => (
            <div key={step.number} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{step.number}</span>
              </div>
              <p className="text-xs font-lato text-gray-200 pt-0.5 leading-relaxed">
                {step.instruction}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Content Based on Question Type */}
      {questionId === 'skinType' && renderSkinTypeIndicators()}
      {questionId === 'highSensitivity' && renderSensitivitySigns()}
      {questionId === 'knownAllergies' && renderAllergiesGuide()}
      {questionId === 'productChangeRate' && renderProductHabits()}
    </div>
  );
}
