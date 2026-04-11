import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useOnboarding } from '../context/OnboardingContext';
import { completeOnboarding } from '../services/userApi';
import InfoTooltip from '../components/InfoTooltip';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { updateOnboardingData } = useOnboarding();
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    skinType: '',
    highSensitivity: null,
    knownAllergies: [],
    productChangeRate: ''
  });

  const handleCloseOverlay = () => {
    setIsOpen(false);
    navigate('/');
  };

  // Validation function
  const isStepValid = () => {
    switch(step) {
      case 1:
        return formData.skinType !== '';
      case 2:
        return formData.highSensitivity !== null;
      case 3:
        // Allergies are optional
        return true;
      case 4:
        return formData.productChangeRate !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  const saveOnboardingData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[Onboarding] Saving data:', formData);

      const data = await completeOnboarding({
        skinType: formData.skinType,
        highSensitivity: formData.highSensitivity,
        knownAllergies: formData.knownAllergies,
        productChangeRate: formData.productChangeRate
      });

      console.log('[Onboarding] ✓ Data saved successfully');
      updateOnboardingData(formData);
      navigate('/onboarding-complete');
    } catch (err) {
      console.error('[Onboarding] ✗ Error saving data:', err);
      setError(err.error || err.message || 'Failed to save your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const allergyOptions = [
    'fragrance', 'dairy', 'botanical_oil', 'paraben', 'tree_nut',
    'grain', 'peanut', 'bee_product', 'wool_wax', 'oxidizing_agent',
    'sulfur', 'nickel', 'preservative', 'essential_oil', 'salicylates'
  ];

  const skinTypes = ['dry', 'oily', 'combination', 'sensitive', 'normal'];
  const changeRates = [
    { value: 'frequent', label: 'Frequently (1-2 weeks)' },
    { value: 'moderate', label: 'Moderately (1-3 months)' },
    { value: 'rare', label: 'Rarely (>3 months)' }
  ];

  // Help tips for each question
  const helpTips = {
    skinType: [
      'Wash your face with lukewarm water and a gentle cleanser',
      'Pat dry with a clean towel without rubbing',
      'Wait 30 minutes without applying any product',
      'Observe your skin: if it feels tight and looks flaky → Dry',
      'If it appears shiny and feels oily → Oily',
      'If some areas are oily and others dry → Combination',
      'If it reacts quickly to products → Sensitive',
      'If balanced and comfortable → Normal'
    ],
    sensitivity: [
      'Apply a small amount of new product on your inner forearm',
      'Wait 24-48 hours and observe for reactions',
      'Look for redness, itching, burning, or swelling',
      'If no reaction occurs, it\'s likely safe for your face',
      'Consider your history with skincare products',
      'Sensitive skin reacts quickly to harsh ingredients',
      'You can also patch-test behind your ear'
    ],
    allergies: [
      'Review all skincare products you currently use',
      'Note any ingredients that cause redness or irritation',
      'Research common allergens in beauty products',
      'Consider past reactions to cosmetics or fragrances',
      'Check if you have food allergies (related ingredients)',
      'Consult a dermatologist if unsure about specific allergies',
      'Being selective helps us find safe products for you'
    ],
    changeRate: [
      'Think about how often you replace your skincare routine',
      'Frequent: You change products every 1-2 weeks',
      'Moderate: You stick with products for 1-3 months',
      'Rare: You rarely change, keep same routine for 3+ months',
      'Be honest about your actual habit, not desired habit',
      'This helps us recommend products suited to your needs',
      'It also affects which products match your preferences'
    ]
  };

  const handleAllergiesChange = (allergy) => {
    const updated = formData.knownAllergies.includes(allergy)
      ? formData.knownAllergies.filter(a => a !== allergy)
      : [...formData.knownAllergies, allergy];
    setFormData({ ...formData, knownAllergies: updated });
  };

   const handleNext = async () => {
     // Validate current step
     if (!isStepValid()) {
       setError(`Please answer this question to continue${step === 3 ? ' (or skip if no allergies)' : ''}`);
       return;
     }

     setError(null);

     if (step < 5) {
       setStep(step + 1);
     } else {
       // Step 5: Save all data to MongoDB
       await saveOnboardingData();
     }
   };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const progressPercentage = (step / 5) * 100;

   return (
       <div className="min-h-screen bg-custom-white flex items-center justify-center p-4 py-8 relative overflow-hidden">
         {/* Back Button - Top Left Corner */}
         <button
           onClick={() => navigate('/')}
           className="absolute top-6 left-6 z-20 p-2 hover:bg-custom-off-white rounded-lg transition-colors"
           title="Back to home"
         >
           <svg className="w-6 h-6 text-custom-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
           </svg>
         </button>

         {/* Full-screen overlay - click to close */}
         {isOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-0 cursor-pointer"
            onClick={handleCloseOverlay}
          ></div>
        )}

        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-2xl bg-custom-white border border-custom-light-gray/20 rounded-3xl shadow-2xl p-8 hover:border-custom-light-gray/40 transition-all duration-500"
         style={{
           boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
         }}
       >
         {/* Progress Bar */}
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-custom-charcoal mb-3">Let's Personalize Your Experience</h1>
            <div className="w-full bg-custom-light-gray border border-custom-light-gray rounded-full h-2 overflow-hidden">
             <div
               className="bg-custom-charcoal h-full transition-all duration-500 shadow-lg"
               style={{ width: `${progressPercentage}%` }}
             ></div>
           </div>
          </div>

          {/* Step 1: Skin Type */}
         {step === 1 && (
           <div className="space-y-6">
             <div className="flex items-center gap-2">
               <h2 className="text-2xl font-semibold text-custom-charcoal">What is your skin type?</h2>
               <InfoTooltip 
                 title="Determine Your Skin Type" 
                 steps={helpTips.skinType}
               />
             </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skinTypes.map(type => (
                   <label
                     key={type}
                     className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                       formData.skinType === type
                         ? 'bg-custom-charcoal border border-custom-charcoal text-white shadow-lg'
                         : 'bg-custom-off-white border border-custom-light-gray hover:bg-custom-light-gray/50'
                     }`}
                   >
                    <input
                      type="radio"
                      name="skinType"
                      value={type}
                      checked={formData.skinType === type}
                      onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                      className="w-4 h-4 text-custom-charcoal"
                    />
                    <span className={`ml-3 font-medium ${
                      formData.skinType === type ? 'text-white' : 'text-custom-charcoal'
                    }`}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </label>
                ))}
              </div>
           </div>
         )}

         {/* Step 2: Sensitivity */}
         {step === 2 && (
           <div className="space-y-6">
             <div className="flex items-center gap-2">
               <h2 className="text-2xl font-semibold text-custom-charcoal">Is your skin highly sensitive?</h2>
               <InfoTooltip 
                 title="Check Skin Sensitivity" 
                 steps={helpTips.sensitivity}
               />
             </div>
                <div className="space-y-3">
                 <label className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                   formData.highSensitivity === true
                     ? 'bg-custom-charcoal border border-custom-charcoal text-white shadow-lg'
                     : 'bg-custom-off-white border border-custom-light-gray hover:bg-custom-light-gray/50'
                 }`}>
                  <input
                    type="radio"
                    name="sensitivity"
                    checked={formData.highSensitivity === true}
                    onChange={() => setFormData({ ...formData, highSensitivity: true })}
                    className="w-4 h-4 text-custom-charcoal"
                  />
                  <span className={`ml-3 font-medium ${
                    formData.highSensitivity === true ? 'text-white' : 'text-custom-charcoal'
                  }`}>Yes, very sensitive</span>
                </label>
                 <label className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                   formData.highSensitivity === false
                     ? 'bg-custom-charcoal border border-custom-charcoal text-white shadow-lg'
                     : 'bg-custom-off-white border border-custom-light-gray hover:bg-custom-light-gray/50'
                 }`}>
                  <input
                    type="radio"
                    name="sensitivity"
                    checked={formData.highSensitivity === false}
                    onChange={() => setFormData({ ...formData, highSensitivity: false })}
                    className="w-4 h-4 text-custom-charcoal"
                  />
                  <span className={`ml-3 font-medium ${
                    formData.highSensitivity === false ? 'text-white' : 'text-custom-charcoal'
                  }`}>No, normal to moderate</span>
                </label>
              </div>
           </div>
         )}

         {/* Step 3: Allergies */}
         {step === 3 && (
           <div className="space-y-6">
             <div className="flex items-start gap-2">
               <div>
                 <div className="flex items-center gap-2">
                   <h2 className="text-2xl font-semibold text-custom-charcoal">Do you have any allergies?</h2>
                   <InfoTooltip 
                     title="Identify Your Allergies" 
                     steps={helpTips.allergies}
                   />
                 </div>
                 <p className="text-custom-dark-gray mt-2">Select all that apply</p>
               </div>
             </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allergyOptions.map(allergy => (
                   <label
                     key={allergy}
                     className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                       formData.knownAllergies.includes(allergy)
                         ? 'bg-custom-charcoal border border-custom-charcoal text-white shadow-lg'
                         : 'bg-custom-off-white border border-custom-light-gray hover:bg-custom-light-gray/50'
                     }`}
                   >
                    <input
                      type="checkbox"
                      checked={formData.knownAllergies.includes(allergy)}
                      onChange={() => handleAllergiesChange(allergy)}
                      className="w-4 h-4 text-custom-charcoal rounded"
                    />
                    <span className={`ml-2 text-sm font-medium ${
                      formData.knownAllergies.includes(allergy) ? 'text-white' : 'text-custom-charcoal'
                    }`}>{allergy.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
           </div>
         )}

         {/* Step 4: Product Change Rate */}
         {step === 4 && (
           <div className="space-y-6">
             <div className="flex items-center gap-2">
               <h2 className="text-2xl font-semibold text-custom-charcoal">How often do you change skincare products?</h2>
               <InfoTooltip 
                 title="Product Change Frequency" 
                 steps={helpTips.changeRate}
               />
             </div>
              <div className="space-y-3">
                {changeRates.map(rate => (
                   <label
                     key={rate.value}
                     className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                       formData.productChangeRate === rate.value
                         ? 'bg-custom-charcoal border border-custom-charcoal text-white shadow-lg'
                         : 'bg-custom-off-white border border-custom-light-gray hover:bg-custom-light-gray/50'
                     }`}
                   >
                    <input
                      type="radio"
                      name="changeRate"
                      value={rate.value}
                      checked={formData.productChangeRate === rate.value}
                      onChange={(e) => setFormData({ ...formData, productChangeRate: e.target.value })}
                      className="w-4 h-4 text-custom-charcoal"
                    />
                    <span className={`ml-3 font-medium ${
                      formData.productChangeRate === rate.value ? 'text-white' : 'text-custom-charcoal'
                    }`}>{rate.label}</span>
                  </label>
                ))}
              </div>
           </div>
         )}

         {/* Step 5: Confirmation */}
         {step === 5 && (
           <div className="space-y-6">
             <h2 className="text-2xl font-semibold text-custom-charcoal">Confirm Your Preferences</h2>
              <div className="bg-custom-off-white border border-custom-light-gray rounded-2xl p-6 space-y-4">
               <p className="text-custom-charcoal"><strong className="text-custom-charcoal">Skin Type:</strong> <span className="text-custom-dark-gray">{formData.skinType}</span></p>
               <p className="text-custom-charcoal"><strong className="text-custom-charcoal">Sensitivity:</strong> <span className="text-custom-dark-gray">{formData.highSensitivity ? 'Highly sensitive' : 'Normal to moderate'}</span></p>
               <p className="text-custom-charcoal">
                 <strong className="text-custom-charcoal">Allergies:</strong> <span className="text-custom-dark-gray">{formData.knownAllergies.length > 0 ? formData.knownAllergies.join(', ') : 'None selected'}</span>
               </p>
               <p className="text-custom-charcoal">
                 <strong className="text-custom-charcoal">Change Frequency:</strong> <span className="text-custom-dark-gray">{changeRates.find(r => r.value === formData.productChangeRate)?.label}</span>
               </p>
             </div>
           </div>
         )}

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-start">
                <div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-custom-off-white border border-custom-light-gray text-custom-charcoal hover:bg-custom-light-gray hover:border-custom-dark-gray disabled:bg-custom-light-gray/30 disabled:text-custom-dark-gray/30 disabled:cursor-not-allowed transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-custom-white bg-custom-charcoal hover:bg-custom-black disabled:bg-custom-dark-gray/50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  step === 5 ? 'Complete & Apply' : 'Next'
                )}
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
