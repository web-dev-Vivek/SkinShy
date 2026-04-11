import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useOnboarding } from '../context/OnboardingContext';
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
  const { isSignedIn } = useAuth();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const [formData, setFormData] = useState({
    skinType: onboardingData?.skinType || '',
    highSensitivity: onboardingData?.highSensitivity || false,
    knownAllergies: onboardingData?.knownAllergies || [],
    productChangeRate: onboardingData?.productChangeRate || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      navigate('/signup', { replace: true });
    }
  }, [isSignedIn, navigate]);

  // Create user in MongoDB if doesn't exist
  useEffect(() => {
    const createUserIfNeeded = async () => {
      if (!isSignedIn || !user) return;

      try {
        // Try to fetch existing user
        await api.get('/users/profile');
      } catch (err) {
        if (err.response?.status === 404) {
          // User doesn't exist, create it
          try {
            await api.post('/users', {
              clerkId: user.id,
              email: getUserEmail(user),
              name: getUserName(user)
            });
          } catch (createError) {
            console.error('Failed to create user:', createError);
            setError('Failed to create your profile. Please try again.');
          }
        }
      }
    };

    createUserIfNeeded();
  }, [isSignedIn, user]);

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
    setSuccess('');

    // Validate all fields
    if (!formData.skinType || !formData.productChangeRate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Update onboarding data in localStorage
      updateOnboardingData(formData);

      // Save to MongoDB
      await api.post('/users/complete-onboarding', {
        skinType: formData.skinType,
        highSensitivity: formData.highSensitivity,
        knownAllergies: formData.knownAllergies,
        productChangeRate: formData.productChangeRate
      });

      setSuccess('Onboarding completed successfully!');

      // Redirect to search page after short delay
      setTimeout(() => {
        navigate('/search', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError(err.response?.data?.error || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-custom-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-playfair text-custom-charcoal mb-2">Complete Your Skin Profile</h1>
          <p className="text-custom-dark-gray">Help us understand your skin to provide better recommendations</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-custom-white border border-custom-light-gray/20 rounded-lg shadow p-8">
          {/* Skin Type */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-custom-charcoal mb-4">Skin Type *</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['dry', 'oily', 'combination', 'sensitive', 'normal'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, skinType: type })}
                  className={`px-4 py-3 rounded-lg font-medium transition capitalize ${
                    formData.skinType === type
                      ? 'bg-custom-charcoal text-custom-white'
                      : 'bg-custom-light-gray/20 text-custom-charcoal hover:bg-custom-light-gray/40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sensitivity */}
          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.highSensitivity}
                onChange={handleSensitivityChange}
                className="w-5 h-5 rounded border-custom-light-gray/30 accent-custom-charcoal"
              />
              <span className="text-lg font-semibold text-custom-charcoal">I have highly sensitive skin</span>
            </label>
          </div>

          {/* Known Allergies */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-custom-charcoal mb-4">Known Allergies</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ALLERGIES.map(allergy => (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => handleAllergyToggle(allergy)}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    formData.knownAllergies.includes(allergy)
                      ? 'bg-custom-charcoal text-custom-white'
                      : 'bg-custom-light-gray/20 text-custom-charcoal hover:bg-custom-light-gray/40'
                  }`}
                >
                  {allergy.replace(/_/g, ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Product Change Rate */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-custom-charcoal mb-4">How often do you change products? *</label>
            <div className="space-y-3">
              {['frequent', 'moderate', 'rare'].map(rate => (
                <label key={rate} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="productChangeRate"
                    value={rate}
                    checked={formData.productChangeRate === rate}
                    onChange={handleProductChangeRateChange}
                    className="w-5 h-5 accent-custom-charcoal"
                  />
                  <span className="text-custom-charcoal font-medium capitalize">
                    {rate === 'frequent'
                      ? 'Frequently (every 1-2 months)'
                      : rate === 'moderate'
                      ? 'Moderately (every 3-6 months)'
                      : 'Rarely (every 6+ months)'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-3 px-4 rounded-lg font-semibold text-custom-charcoal bg-custom-light-gray/20 hover:bg-custom-light-gray/40 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg font-semibold text-custom-white bg-custom-charcoal hover:bg-custom-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
