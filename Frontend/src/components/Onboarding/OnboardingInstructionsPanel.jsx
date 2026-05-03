import React from 'react';
import { getInstructionForQuestion } from '../../data/onboardingInstructions';

export default function OnboardingInstructionsPanel({ questionId, isMobileModal = false }) {
  const instruction = getInstructionForQuestion(questionId);

  if (!instruction) {
    return null;
  }

  const renderSkinTypeIndicators = () => {
    if (!instruction.indicators) return null;

    return (
      <div className="mt-6 space-y-3">
        <p className={`text-xs font-lato font-semibold uppercase tracking-wide ${isMobileModal ? 'text-gray-600' : 'text-gray-300'}`}>
          Look for these signs:
        </p>
        {Object.entries(instruction.indicators).map(([skinType, info]) => (
          <div key={skinType} className={`${bgColorClass} border ${borderColorClass} rounded-lg p-3 text-left`}>
            <p className={`text-xs font-lato capitalize font-semibold mb-1 ${isMobileModal ? 'text-custom-charcoal' : 'text-gray-200'}`}>{skinType}</p>
            <p className={`text-xs font-lato leading-relaxed mb-2 ${isMobileModal ? 'text-gray-700' : 'text-gray-300'}`}>
              {info.description}
            </p>
            <p className={`text-xs font-lato italic ${isMobileModal ? 'text-gray-600' : 'text-gray-400'}`}>
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
        <p className={`text-xs font-lato font-semibold uppercase tracking-wide mb-3 ${isMobileModal ? 'text-gray-600' : 'text-gray-300'}`}>
          Common sensitivity signs:
        </p>
        {instruction.signs.map((sign, idx) => (
          <div key={idx} className={`flex items-start gap-2 text-xs font-lato ${isMobileModal ? 'text-custom-charcoal' : 'text-gray-200'}`}>
            <span className={`mt-1 ${isMobileModal ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
            <span>{sign}</span>
          </div>
        ))}
        {instruction.note && (
          <div className={`mt-4 pt-3 ${isMobileModal ? 'border-gray-300' : 'border-white/10'} border-t`}>
            <p className={`text-xs font-lato italic ${isMobileModal ? 'text-gray-600' : 'text-gray-300'}`}>
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
      <div className={`mt-6 space-y-2 ${isMobileModal ? 'max-h-96' : 'max-h-80'} overflow-y-auto ${isMobileModal ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : 'scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5'}`}>
        {Object.entries(instruction.ingredientGuide).map(([ingredient, info]) => (
          <div key={ingredient} className={`${bgColorClass} border ${borderColorClass} rounded p-2.5 text-left`}>
            <p className={`text-xs font-lato font-semibold capitalize mb-1 ${isMobileModal ? 'text-custom-charcoal' : 'text-gray-200'}`}>
              {ingredient.replace('_', ' ')}
            </p>
            <p className={`text-xs font-lato leading-tight mb-1 ${isMobileModal ? 'text-gray-700' : 'text-gray-300'}`}>
              {info.description}
            </p>
            <p className={`text-xs font-lato text-left ${isMobileModal ? 'text-gray-600' : 'text-gray-400'}`}>
              Found in: {info.commonProducts}
            </p>
          </div>
        ))}
        {instruction.note && (
          <div className={`mt-3 pt-3 ${isMobileModal ? 'border-gray-300' : 'border-white/10'} border-t`}>
            <p className={`text-xs font-lato italic ${isMobileModal ? 'text-gray-600' : 'text-gray-300'}`}>
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
        <p className={`text-xs font-lato font-semibold uppercase tracking-wide mb-3 ${isMobileModal ? 'text-gray-600' : 'text-gray-300'}`}>
          Find your habit:
        </p>
        {Object.entries(instruction.habits).map(([habit, info]) => (
          <div key={habit} className={`${bgColorClass} border ${borderColorClass} rounded-lg p-3 text-left`}>
            <p className={`text-xs font-lato font-semibold capitalize mb-1 ${isMobileModal ? 'text-custom-charcoal' : 'text-gray-200'}`}>
              {habit.replace('_', ' ')}
            </p>
            <p className={`text-xs font-lato leading-relaxed mb-1.5 ${isMobileModal ? 'text-gray-700' : 'text-gray-300'}`}>
              {info.description}
            </p>
            <div className={`${isMobileModal ? 'bg-gray-200' : 'bg-white/5'} rounded p-1.5 space-y-1`}>
              <p className={`text-xs font-lato ${isMobileModal ? 'text-gray-700' : 'text-gray-300'}`}>
                <span className={`font-semibold ${isMobileModal ? 'text-custom-charcoal' : 'text-gray-200'}`}>Impact:</span> {info.impact}
              </p>
              <p className={`text-xs font-lato ${isMobileModal ? 'text-gray-700' : 'text-gray-300'}`}>
                <span className={`font-semibold ${isMobileModal ? 'text-custom-charcoal' : 'text-gray-200'}`}>Recommendation:</span> {info.recommendation}
              </p>
            </div>
          </div>
        ))}
        {instruction.tip && (
          <div className={`mt-3 pt-3 ${isMobileModal ? 'border-gray-300' : 'border-white/10'} border-t`}>
            <p className={`text-xs font-lato italic ${isMobileModal ? 'text-gray-600' : 'text-gray-300'}`}>
              {instruction.tip}
            </p>
          </div>
        )}
      </div>
    );
  };

  const textColorClass = isMobileModal ? 'text-custom-charcoal' : 'text-white';
  const titleColorClass = isMobileModal ? 'text-custom-charcoal' : 'text-white';
  const subtitleColorClass = isMobileModal ? 'text-gray-600' : 'text-gray-300';
  const descriptionColorClass = isMobileModal ? 'text-gray-700' : 'text-gray-300';
  const bgColorClass = isMobileModal ? 'bg-gray-100' : 'bg-white/5';
  const borderColorClass = isMobileModal ? 'border-gray-300' : 'border-white/10';

  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className={`text-sm sm:text-base font-playfair font-bold ${titleColorClass} flex items-center gap-2`}>
        {instruction.title}
      </h3>

      {/* Steps */}
      {instruction.steps && instruction.steps.length > 0 && (
        <div className="space-y-2">
          {instruction.steps.map((step) => (
            <div key={step.number} className="flex gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full ${isMobileModal ? 'bg-custom-charcoal/10' : 'bg-white/20'} flex items-center justify-center`}>
                <span className={`text-xs font-bold ${isMobileModal ? 'text-custom-charcoal' : 'text-white'}`}>{step.number}</span>
              </div>
              <p className={`text-xs sm:text-sm font-lato ${isMobileModal ? 'text-custom-charcoal' : 'text-gray-200'} pt-0.5 leading-relaxed`}>
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
