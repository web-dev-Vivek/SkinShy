import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { api } from '../services/api';
import { getUserName, getUserEmail } from '../services/auth';
import { useOnboarding } from '../context/OnboardingContext';

const ALLERGIES = [
  'fragrances',
  'essential_oils',
  'alcohol',
  'sulfates',
  'parabens',
  'silicones',
  'mineral_oil',
  'lanolin'
];

const QUESTIONS = [
  {
    id: 'skinType',
    title: 'What is your skin type?',
    type: 'select',
    required: true,
    options: [
      { value: 'oily', label: 'Oily' },
      { value: 'dry', label: 'Dry' },
      { value: 'combination', label: 'Combination' },
      { value: 'normal', label: 'Normal' },
      { value: 'sensitive', label: 'Sensitive' }
    ]
  },
  {
    id: 'highSensitivity',
    title: 'Do you have high skin sensitivity?',
    type: 'checkbox',
    required: false
  },
  {
    id: 'knownAllergies',
    title: 'Do you have any known allergies?',
    type: 'multicheck',
    required: false,
    options: ALLERGIES.map(a => ({
      value: a,
      label: a.replace('_', ' ')
    }))
  },
  {
    id: 'productChangeRate',
    title: 'How often do you change products?',
    type: 'select',
    required: true,
    options: [
      { value: 'rarely', label: 'Rarely' },
      { value: 'occasionally', label: 'Occasionally' },
      { value: 'frequently', label: 'Frequently' },
      { value: 'very_frequently', label: 'Very Frequently' }
    ]
  }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { complete_signup, complete_onboarding, setOnboardingComplete } = useOnboarding();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({
    skinType: '',
    highSensitivity: false,
    knownAllergies: [],
    productChangeRate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedQuestions, setCompletedQuestions] = useState(new Set());

  // Redirect if onboarding already complete to prevent loop
  useEffect(() => {
    if (complete_onboarding === 1) {
      navigate('/search', { replace: true });
    }
  }, [complete_onboarding, navigate]);

  const handleSkinTypeChange = (value) => {
    setFormData({ ...formData, skinType: value });
    markQuestionCompleted('skinType');
  };

  const handleSensitivityChange = (checked) => {
    setFormData({ ...formData, highSensitivity: checked });
    markQuestionCompleted('highSensitivity');
  };

  const handleAllergyToggle = (allergy) => {
    setFormData(prev => ({
      ...prev,
      knownAllergies: prev.knownAllergies.includes(allergy)
        ? prev.knownAllergies.filter(a => a !== allergy)
        : [...prev.knownAllergies, allergy]
    }));
    markQuestionCompleted('knownAllergies');
  };

  const handleProductChangeRateChange = (value) => {
    setFormData({ ...formData, productChangeRate: value });
    markQuestionCompleted('productChangeRate');
  };

  const markQuestionCompleted = (questionId) => {
    setCompletedQuestions(prev => new Set([...prev, questionId]));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setError('');
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setError('');
    }
  };

  const handleSkip = () => {
    goToNextQuestion();
  };

   const handleSubmit = async (e) => {
       e.preventDefault();
       setError('');

       // Validate required fields
       const skinTypeQuestion = QUESTIONS.find(q => q.id === 'skinType');
       const productChangeRateQuestion = QUESTIONS.find(q => q.id === 'productChangeRate');

       if (skinTypeQuestion.required && !formData.skinType) {
         setError('Please select your skin type');
         return;
       }

       if (productChangeRateQuestion.required && !formData.productChangeRate) {
         setError('Please select how often you change products');
         return;
       }

       setLoading(true);

       try {
         // Get Clerk token to verify authentication
         const token = await getToken();
         if (!token) {
           throw new Error('No authentication token available. Please refresh and try again.');
         }

         console.log('✅ Authenticated with Clerk token');

         // Create user in MongoDB first if needed
         try {
           await api.post('/users', {
             clerkId: user.id,
             email: getUserEmail(user),
             name: getUserName(user)
           });
           console.log('✅ User created in MongoDB');
         } catch (err) {
           // Only ignore 409 (conflict - user already exists)
           if (err.response?.status !== 409) {
             console.error('User creation failed:', err);
             throw new Error(`Failed to create user: ${err.response?.data?.error || err.message}`);
           }
           console.log('✅ User already exists in MongoDB');
         }

         // Complete onboarding - note: highSensitivity and knownAllergies are optional
         await api.post('/users/complete-onboarding', {
           skinType: formData.skinType,
           highSensitivity: formData.highSensitivity,
           knownAllergies: formData.knownAllergies || [],
           productChangeRate: formData.productChangeRate
         });
         console.log('✅ Onboarding completed successfully');

         // Set onboarding complete flag to 1 - prevents redirect loop
         setOnboardingComplete();

         // Redirect to search
         navigate('/search', { replace: true });
       } catch (err) {
         console.error('Onboarding error:', err);
         setError(err.response?.data?.error || err.message || 'Failed to complete onboarding');
       } finally {
         setLoading(false);
       }
     };

  const currentQ = QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const questionValue = formData[currentQ.id];

   return (
     <div className="min-h-screen bg-custom-white px-3 sm:px-4 py-6 sm:py-8 mt-20">
       <div className="max-w-2xl mx-auto">
         {/* Progress Bar */}
         <div className="mb-6 sm:mb-8">
           <div className="flex justify-between items-center mb-2">
             <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-custom-charcoal">
               Complete Your Profile
             </h1>
             <span className="text-xs sm:text-sm font-semibold text-custom-dark-gray">
               {currentQuestion + 1} / {QUESTIONS.length}
             </span>
           </div>
           <div className="w-full bg-custom-light-gray/20 rounded-full h-2">
             <div
               className="bg-custom-charcoal h-2 rounded-full transition-all duration-300"
               style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
             ></div>
           </div>
         </div>

         {error && (
           <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 sm:mb-6 text-xs sm:text-sm">
             {error}
           </div>
         )}

         {/* Question Container */}
         <div className="bg-custom-off-white border border-custom-light-gray/20 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
           <h2 className="text-xl sm:text-2xl font-bold text-custom-charcoal mb-4 sm:mb-6">
             {currentQ.title}
           </h2>

           <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
             {/* SKIN TYPE - Select */}
             {currentQ.type === 'select' && currentQ.id === 'skinType' && (
               <select
                 value={questionValue}
                 onChange={(e) => handleSkinTypeChange(e.target.value)}
                 className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-custom-light-gray/30 rounded-lg focus:ring-2 focus:ring-custom-charcoal focus:border-transparent text-sm sm:text-base"
               >
                 <option value="">Select your skin type</option>
                 {currentQ.options.map(opt => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
             )}

             {/* PRODUCT CHANGE RATE - Select */}
             {currentQ.type === 'select' && currentQ.id === 'productChangeRate' && (
               <select
                 value={questionValue}
                 onChange={(e) => handleProductChangeRateChange(e.target.value)}
                 className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-custom-light-gray/30 rounded-lg focus:ring-2 focus:ring-custom-charcoal focus:border-transparent text-sm sm:text-base"
               >
                 <option value="">Select frequency</option>
                 {currentQ.options.map(opt => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
             )}

             {/* HIGH SENSITIVITY - Checkbox */}
             {currentQ.type === 'checkbox' && (
               <div className="flex items-center p-3 sm:p-4 border border-custom-light-gray/30 rounded-lg hover:bg-custom-white transition gap-3 sm:gap-4">
                 <input
                   type="checkbox"
                   id="sensitivity"
                   checked={questionValue}
                   onChange={(e) => handleSensitivityChange(e.target.checked)}
                   className="w-5 sm:w-6 h-5 sm:h-6 text-custom-charcoal rounded cursor-pointer flex-shrink-0"
                 />
                 <label htmlFor="sensitivity" className="text-sm sm:text-lg text-custom-charcoal font-medium cursor-pointer">
                   Yes, I have high skin sensitivity
                 </label>
               </div>
             )}

             {/* ALLERGIES - Multi-select */}
             {currentQ.type === 'multicheck' && (
               <div className="grid grid-cols-2 gap-2 sm:gap-3">
                 {currentQ.options.map(allergy => (
                   <label key={allergy.value} className="flex items-center p-2 sm:p-3 border border-custom-light-gray/30 rounded-lg hover:bg-custom-white transition cursor-pointer gap-2">
                     <input
                       type="checkbox"
                       checked={formData.knownAllergies.includes(allergy.value)}
                       onChange={() => handleAllergyToggle(allergy.value)}
                       className="w-4 sm:w-5 h-4 sm:h-5 text-custom-charcoal rounded cursor-pointer flex-shrink-0"
                     />
                     <span className="text-xs sm:text-sm text-custom-dark-gray font-medium capitalize break-words">
                       {allergy.label}
                     </span>
                  </label>
                ))}
              </div>
            )}
          </form>
        </div>

         {/* Navigation Buttons */}
         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between">
           <button
             onClick={goToPreviousQuestion}
             disabled={isFirstQuestion}
             className="px-4 sm:px-6 py-2 sm:py-3 border border-custom-charcoal text-custom-charcoal rounded-lg font-semibold hover:bg-custom-light-gray/10 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm sm:text-base order-2 sm:order-1"
           >
             ← Back
           </button>

           <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
             {/* Skip Button (always available) */}
             <button
               onClick={handleSkip}
               disabled={isLastQuestion || loading}
               className="px-4 sm:px-6 py-2 sm:py-3 border border-custom-light-gray text-custom-dark-gray rounded-lg font-semibold hover:border-custom-charcoal hover:text-custom-charcoal transition disabled:opacity-30 disabled:cursor-not-allowed text-sm sm:text-base"
             >
               Skip
             </button>

             {/* Next or Complete Button */}
             {!isLastQuestion ? (
               <button
                 onClick={goToNextQuestion}
                 className="px-4 sm:px-6 py-2 sm:py-3 bg-custom-charcoal text-custom-white rounded-lg font-semibold hover:bg-custom-black transition text-sm sm:text-base"
               >
                 Next →
               </button>
             ) : (
               <button
                 type="submit"
                 onClick={handleSubmit}
                 disabled={loading}
                 className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-custom-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm sm:text-base"
               >
                 {loading ? 'Saving...' : 'Complete Profile'}
               </button>
             )}
           </div>
         </div>
      </div>
    </div>
  );
}
