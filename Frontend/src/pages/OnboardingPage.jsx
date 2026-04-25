import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { api } from '../services/api';
import { getUserName, getUserEmail } from '../services/auth';
import { useOnboarding } from '../context/OnboardingContext';
import OnboardingInstructionsPanel from '../components/Onboarding/OnboardingInstructionsPanel';

const ALLERGIES = [
  'none',
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
    info: 'Understanding your skin type helps us recommend products that work best for your specific needs.',
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
    required: false,
    info: 'High sensitivity means your skin reacts easily to irritants. Mark this if you experience redness, itching, or burning.'
  },
  {
    id: 'knownAllergies',
    title: 'Do you have any known allergies?',
    type: 'multicheck',
    required: false,
    info: 'Select any ingredients you know trigger reactions on your skin to help us filter out unsafe products.',
    options: ALLERGIES.map(a => ({
      value: a,
      label: a.replace('_', ' ').charAt(0).toUpperCase() + a.replace('_', ' ').slice(1)
    }))
  },
  {
    id: 'productChangeRate',
    title: 'How often do you change products?',
    type: 'select',
    required: true,
    info: 'Frequent product changes can irritate sensitive skin, while occasional changes allow your skin to adapt.',
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
  const { complete_onboarding, setOnboardingComplete } = useOnboarding();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({
    skinType: '',
    highSensitivity: false,
    knownAllergies: [],
    productChangeRate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [onboardingComplete, setOnboardingCompleteState] = useState(false);

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
    // Track question as completed (used for form validation)
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
          
          // Show completion page instead of immediate redirect
          setOnboardingCompleteState(true);

          // Redirect to search after a delay (5 seconds)
          setTimeout(() => {
            navigate('/search', { replace: true });
          }, 5000);
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
      <>
        {/* Completion Page */}
        {onboardingComplete && (
          <div className="fixed inset-0 bg-gradient-to-br from-custom-charcoal via-custom-charcoal to-custom-dark-gray flex items-center justify-center min-h-screen z-50 overflow-hidden">
            {/* Animated background blurs */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-10 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-md mx-auto px-6">
              {/* Icon */}
              <div className="mb-8 flex justify-center">
                <svg className="w-20 h-20 text-white animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </div>

              {/* Heading */}
              <h1 className="text-5xl font-playfair font-bold text-white mb-4">
                Thank you!
              </h1>

              {/* Message */}
              <p className="text-gray-300 font-lato text-base leading-relaxed mb-8">
                We appreciate your interest and we promise to be in contact in less than <span className="font-semibold text-white">48 hours</span> so we can have a chat about how we can help you grow with Skinshy.
              </p>

              {/* Button */}
              <button
                onClick={() => navigate('/search')}
                className="px-8 py-3 bg-white text-custom-charcoal font-playfair font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 inline-block"
              >
                Back Home
              </button>

              {/* Branding */}
              <div className="mt-16 pt-8 border-t border-white/20">
                <p className="text-white font-playfair font-bold text-lg">Skinshy</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Onboarding Form */}
        {!onboardingComplete && (
          <div className="w-screen h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full">
              <div className="flex flex-col lg:flex-row gap-0 h-full">
                
                 {/* LEFT SIDEBAR - Dark with branding */}
                 <div className="w-full lg:w-2/5 bg-gradient-to-br from-custom-charcoal via-custom-charcoal to-custom-dark-gray text-white p-8 sm:p-12 flex flex-col justify-between">
                   
                   {/* Back Button */}
                   <button
                     onClick={() => navigate('/')}
                     className="mb-6 text-white hover:text-gray-300 transition-colors flex items-center gap-2 text-sm font-lato"
                   >
                     ← Back
                   </button>

                   {/* Top Section */}
                   <div>
                     {/* Logo/Branding */}
                     <h1 className="text-3xl font-playfair font-bold mb-8">Skinshy</h1>
                    
                    {/* Main Headline */}
                    <div className="mb-8">
                      <h2 className="text-4xl sm:text-5xl font-playfair font-bold mb-4 leading-tight">
                        Complete Your Profile
                      </h2>
                      <p className="text-gray-300 font-lato text-sm sm:text-base leading-relaxed">
                        Let us know about your skin to get personalized product recommendations that work best for you.
                      </p>
                    </div>
                  </div>

                   {/* Bottom Section - Dynamic Instructions */}
                   <div className="space-y-4">
                     {/* Instructions Panel */}
                     <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/5">
                       <OnboardingInstructionsPanel questionId={QUESTIONS[currentQuestion].id} />
                     </div>
                     
                     <div className="text-xs sm:text-sm text-gray-400 space-y-1">
                       <p>Already have an account? <a href="/login" className="text-white hover:underline font-semibold">Sign In</a></p>
                       <p>Need help? <a href="mailto:help@skinshy.com" className="text-white hover:underline font-semibold">Contact us</a></p>
                     </div>
                   </div>
                </div>

                {/* RIGHT CONTENT - White with form */}
                <div className="w-full lg:w-3/5 bg-white p-8 sm:p-12 flex flex-col justify-between overflow-y-auto">
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-end gap-2 mb-10">
                    {QUESTIONS.map((_, idx) => (
                      <React.Fragment key={idx}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold font-playfair transition-all ${
                            idx < currentQuestion
                              ? 'bg-custom-charcoal text-white'
                              : idx === currentQuestion
                              ? 'bg-custom-charcoal text-white ring-2 ring-custom-charcoal ring-offset-2'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {idx < currentQuestion ? '✓' : idx + 1}
                        </div>
                        {idx < QUESTIONS.length - 1 && (
                          <div
                            className={`w-6 h-0.5 transition-all ${
                              idx < currentQuestion ? 'bg-custom-charcoal' : 'bg-gray-300'
                            }`}
                          ></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Current Question Title */}
                  <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-custom-charcoal mb-8">
                    {QUESTIONS[currentQuestion].title}
                  </h3>

                  {/* Error message */}
                  {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-lato">
                      {error}
                    </div>
                  )}

                  {/* Form Content */}
                  <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                    
                    {/* SKIN TYPE */}
                    {QUESTIONS[currentQuestion].type === 'select' && QUESTIONS[currentQuestion].id === 'skinType' && (
                      <div className="space-y-3">
                        {QUESTIONS[currentQuestion].options.map(opt => (
                          <label key={opt.value} className="flex items-center p-3 sm:p-4 bg-gray-50 border-2 border-gray-200 hover:border-custom-charcoal/30 hover:bg-gray-100 rounded-lg cursor-pointer transition-all group">
                            <input
                              type="radio"
                              name="skinType"
                              value={opt.value}
                              checked={questionValue === opt.value}
                              onChange={(e) => handleSkinTypeChange(e.target.value)}
                              className="w-5 h-5 rounded-full cursor-pointer accent-custom-charcoal"
                            />
                            <span className="ml-3 text-sm sm:text-base text-custom-charcoal font-lato font-medium">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* HIGH SENSITIVITY */}
                    {QUESTIONS[currentQuestion].type === 'checkbox' && (
                      <label className="flex items-center p-4 bg-gray-50 border-2 border-gray-200 hover:border-custom-charcoal/30 hover:bg-gray-100 rounded-lg cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={questionValue}
                          onChange={(e) => handleSensitivityChange(e.target.checked)}
                          className="w-5 h-5 rounded border-2 cursor-pointer accent-custom-charcoal"
                        />
                        <span className="ml-3 text-base text-custom-charcoal font-lato font-medium">
                          Yes, I have high skin sensitivity
                        </span>
                      </label>
                    )}

                    {/* ALLERGIES */}
                    {QUESTIONS[currentQuestion].type === 'multicheck' && (
                      <div 
                        className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                          QUESTIONS[currentQuestion].options.length > 6 
                            ? 'max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' 
                            : ''
                        }`}
                      >
                        {QUESTIONS[currentQuestion].options.map(allergy => (
                          <label key={allergy.value} className="flex items-center p-3 bg-gray-50 border-2 border-gray-200 hover:border-custom-charcoal/30 hover:bg-gray-100 rounded-lg cursor-pointer transition-all">
                            <input
                              type="checkbox"
                              checked={formData.knownAllergies.includes(allergy.value)}
                              onChange={() => handleAllergyToggle(allergy.value)}
                              className="w-5 h-5 rounded border-2 cursor-pointer accent-custom-charcoal"
                            />
                            <span className="ml-3 text-sm text-custom-charcoal font-lato font-medium capitalize">
                              {allergy.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* PRODUCT CHANGE RATE */}
                    {QUESTIONS[currentQuestion].type === 'select' && QUESTIONS[currentQuestion].id === 'productChangeRate' && (
                      <div className="space-y-3">
                        {QUESTIONS[currentQuestion].options.map(opt => (
                          <label key={opt.value} className="flex items-center p-3 sm:p-4 bg-gray-50 border-2 border-gray-200 hover:border-custom-charcoal/30 hover:bg-gray-100 rounded-lg cursor-pointer transition-all group">
                            <input
                              type="radio"
                              name="productChangeRate"
                              value={opt.value}
                              checked={questionValue === opt.value}
                              onChange={(e) => handleProductChangeRateChange(e.target.value)}
                              className="w-5 h-5 rounded-full cursor-pointer accent-custom-charcoal"
                            />
                            <span className="ml-3 text-sm sm:text-base text-custom-charcoal font-lato font-medium">
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </form>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-8 border-t border-gray-200 mt-8">
                    <button
                      onClick={goToPreviousQuestion}
                      disabled={isFirstQuestion}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-custom-charcoal hover:border-custom-charcoal hover:bg-gray-50 rounded-lg font-semibold font-playfair transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      Back
                    </button>
                    <button
                      onClick={isLastQuestion ? handleSubmit : goToNextQuestion}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-custom-charcoal to-custom-dark-gray hover:from-custom-black hover:to-custom-charcoal text-white rounded-lg font-semibold font-playfair transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isLastQuestion ? 'Saving...' : 'Next Step'}
                        </span>
                      ) : (
                        isLastQuestion ? 'Complete Profile' : 'Next Step'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
}
