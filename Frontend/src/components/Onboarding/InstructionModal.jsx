import React from 'react';
import OnboardingInstructionsPanel from './OnboardingInstructionsPanel';

export default function InstructionModal({ isOpen, onClose, questionId }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:w-96 max-h-[80vh] sm:max-h-96 overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-playfair font-bold text-custom-charcoal">
              Step Instructions
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 sm:p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="text-custom-charcoal">
              <OnboardingInstructionsPanel questionId={questionId} isMobileModal={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
