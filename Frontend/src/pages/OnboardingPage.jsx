import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { completeOnboarding } from '../services/users';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    skinType: '',
    highSensitivity: false,
    knownAllergies: [],
    productChangeRate: ''
  });

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

  const handleAllergiesChange = (allergy) => {
    const updated = formData.knownAllergies.includes(allergy)
      ? formData.knownAllergies.filter(a => a !== allergy)
      : [...formData.knownAllergies, allergy];
    setFormData({ ...formData, knownAllergies: updated });
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Submit
      setLoading(true);
      setError('');
      try {
        await completeOnboarding(
          formData.skinType,
          formData.highSensitivity,
          formData.knownAllergies,
          formData.productChangeRate
        );
        
        navigate('/search');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to save preferences');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const progressPercentage = (step / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-800">Let's Personalize Your Experience</h1>
            <span className="text-lg font-semibold text-rose-600">Step {step}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-400 to-rose-600 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Skin Type */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">What is your skin type?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skinTypes.map(type => (
                <label key={type} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition">
                  <input
                    type="radio"
                    name="skinType"
                    value={type}
                    checked={formData.skinType === type}
                    onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                    className="w-4 h-4 text-rose-600"
                  />
                  <span className="ml-3 font-medium text-gray-700">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Sensitivity */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Is your skin highly sensitive?</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition">
                <input
                  type="radio"
                  name="sensitivity"
                  checked={formData.highSensitivity === true}
                  onChange={() => setFormData({ ...formData, highSensitivity: true })}
                  className="w-4 h-4 text-rose-600"
                />
                <span className="ml-3 font-medium text-gray-700">Yes, very sensitive</span>
              </label>
              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition">
                <input
                  type="radio"
                  name="sensitivity"
                  checked={formData.highSensitivity === false}
                  onChange={() => setFormData({ ...formData, highSensitivity: false })}
                  className="w-4 h-4 text-rose-600"
                />
                <span className="ml-3 font-medium text-gray-700">No, normal to moderate</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Allergies */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Do you have any allergies?</h2>
              <p className="text-gray-600 mt-2">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allergyOptions.map(allergy => (
                <label key={allergy} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition">
                  <input
                    type="checkbox"
                    checked={formData.knownAllergies.includes(allergy)}
                    onChange={() => handleAllergiesChange(allergy)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">{allergy.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Product Change Rate */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">How often do you change skincare products?</h2>
            <div className="space-y-3">
              {changeRates.map(rate => (
                <label key={rate.value} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition">
                  <input
                    type="radio"
                    name="changeRate"
                    value={rate.value}
                    checked={formData.productChangeRate === rate.value}
                    onChange={(e) => setFormData({ ...formData, productChangeRate: e.target.value })}
                    className="w-4 h-4 text-rose-600"
                  />
                  <span className="ml-3 font-medium text-gray-700">{rate.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Confirm Your Preferences</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <p className="text-gray-700"><strong className="text-gray-900">Skin Type:</strong> {formData.skinType}</p>
              <p className="text-gray-700"><strong className="text-gray-900">Sensitivity:</strong> {formData.highSensitivity ? 'Highly sensitive' : 'Normal to moderate'}</p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Allergies:</strong> {formData.knownAllergies.length > 0 ? formData.knownAllergies.join(', ') : 'None selected'}
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Change Frequency:</strong> {changeRates.find(r => r.value === formData.productChangeRate)?.label}
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex-1 py-3 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-lg font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 transition"
          >
            {step === 5 ? (loading ? 'Saving...' : 'Complete') : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
