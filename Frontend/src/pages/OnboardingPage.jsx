import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { api } from '../services/api';
import { getUserName, getUserEmail } from '../services/auth';

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

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    skinType: '',
    highSensitivity: false,
    knownAllergies: [],
    productChangeRate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSkinTypeChange = (e) => {
    setFormData({ ...formData, skinType: e.target.value });
  };

  const handleSensitivityChange = (e) => {
    setFormData({ ...formData, highSensitivity: e.target.checked });
  };

  const handleAllergyToggle = (allergy) => {
    setFormData(prev => ({
      ...prev,
      knownAllergies: prev.knownAllergies.includes(allergy)
        ? prev.knownAllergies.filter(a => a !== allergy)
        : [...prev.knownAllergies, allergy]
    }));
  };

  const handleProductChangeRateChange = (e) => {
    setFormData({ ...formData, productChangeRate: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    if (!formData.skinType || !formData.productChangeRate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create user in MongoDB first if needed
      try {
        await api.post('/users', {
          clerkId: user.id,
          email: getUserEmail(user),
          name: getUserName(user)
        });
      } catch (err) {
        // User might already exist, continue
        console.log('User creation/fetch:', err.response?.status);
      }

      // Complete onboarding
      await api.post('/users/complete-onboarding', {
        skinType: formData.skinType,
        highSensitivity: formData.highSensitivity,
        knownAllergies: formData.knownAllergies,
        productChangeRate: formData.productChangeRate
      });

      // Redirect to search
      navigate('/search', { replace: true });
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err.response?.data?.error || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-custom-white px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold font-playfair text-custom-charcoal mb-2">
          Complete Your Profile
        </h1>
        <p className="text-custom-dark-gray mb-8">
          Tell us about your skin to get personalized recommendations
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Skin Type */}
          <div>
            <label className="block text-sm font-semibold text-custom-charcoal mb-3">
              Skin Type *
            </label>
            <select
              value={formData.skinType}
              onChange={handleSkinTypeChange}
              className="w-full px-4 py-2 border border-custom-light-gray/30 rounded-lg focus:ring-2 focus:ring-custom-charcoal focus:border-transparent"
              required
            >
              <option value="">Select your skin type</option>
              <option value="oily">Oily</option>
              <option value="dry">Dry</option>
              <option value="combination">Combination</option>
              <option value="normal">Normal</option>
              <option value="sensitive">Sensitive</option>
            </select>
          </div>

          {/* High Sensitivity */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sensitivity"
              checked={formData.highSensitivity}
              onChange={handleSensitivityChange}
              className="w-4 h-4 text-custom-charcoal rounded"
            />
            <label htmlFor="sensitivity" className="ml-3 text-custom-charcoal font-medium">
              I have high skin sensitivity
            </label>
          </div>

          {/* Known Allergies */}
          <div>
            <label className="block text-sm font-semibold text-custom-charcoal mb-3">
              Known Allergies
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ALLERGIES.map(allergy => (
                <label key={allergy} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.knownAllergies.includes(allergy)}
                    onChange={() => handleAllergyToggle(allergy)}
                    className="w-4 h-4 text-custom-charcoal rounded"
                  />
                  <span className="ml-2 text-custom-dark-gray capitalize">
                    {allergy.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Change Rate */}
          <div>
            <label className="block text-sm font-semibold text-custom-charcoal mb-3">
              How often do you change products? *
            </label>
            <select
              value={formData.productChangeRate}
              onChange={handleProductChangeRateChange}
              className="w-full px-4 py-2 border border-custom-light-gray/30 rounded-lg focus:ring-2 focus:ring-custom-charcoal focus:border-transparent"
              required
            >
              <option value="">Select frequency</option>
              <option value="rarely">Rarely</option>
              <option value="occasionally">Occasionally</option>
              <option value="frequently">Frequently</option>
              <option value="very_frequently">Very Frequently</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-custom-charcoal text-custom-white rounded-lg font-semibold hover:bg-custom-black transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
