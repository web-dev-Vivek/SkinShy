import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import ProfileSkeleton from '../components/Skeletons/ProfileSkeleton';
import { getUserProfile, getUserPreferences, updateUserProfile, updateUserPreferences } from '../services/users';
import { useOnboarding } from '../context/OnboardingContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { setOnboardingComplete } = useOnboarding();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingSkin, setEditingSkin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [skinFormData, setSkinFormData] = useState({
    skinType: '',
    highSensitivity: false,
    knownAllergies: [],
    productChangeRate: ''
  });

  const skinTypeOptions = ['dry', 'oily', 'combination', 'sensitive', 'normal'];
  const productChangeRateOptions = ['rarely', 'occasionally', 'frequently', 'very_frequently'];
  const allergyOptions = [
    'Parabens',
    'Sulfates',
    'Silicones',
    'Fragrance',
    'Alcohol',
    'Dyes',
    'Preservatives',
    'Essential Oils'
  ];

  const loadUserData = useCallback(async () => {
    try {
      const [profileData, preferencesData] = await Promise.all([
        getUserProfile(),
        getUserPreferences()
      ]);
      setProfile(profileData);
      setPreferences(preferencesData);
      setFormData({ name: profileData.name, email: profileData.email });
      setSkinFormData({
        skinType: preferencesData?.skinType || '',
        highSensitivity: preferencesData?.highSensitivity || false,
        knownAllergies: preferencesData?.knownAllergies || [],
        productChangeRate: preferencesData?.productChangeRate || ''
      });

      // Check if user is old/existing (completed onboarding in DB)
      if (profileData?.profile?.onboardingCompleted) {
        setOnboardingComplete();
      }
    } catch (error) {
      setError('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [setOnboardingComplete]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile(formData.name, formData.email);
      const updatedProfile = await getUserProfile();
      setProfile(updatedProfile);
      setEditingProfile(false);
      setError('');
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkinProfile = async () => {
    try {
      setLoading(true);
      await updateUserPreferences(skinFormData);
      const updatedPreferences = await getUserPreferences();
      setPreferences(updatedPreferences);
      setEditingSkin(false);
      setError('');
      setSuccess('Skin profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update skin profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllergyChange = (allergy) => {
    setSkinFormData(prev => ({
      ...prev,
      knownAllergies: prev.knownAllergies.includes(allergy)
        ? prev.knownAllergies.filter(a => a !== allergy)
        : [...prev.knownAllergies, allergy]
    }));
  };

  const getFormattedValue = (value) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'None';
    }
    if (typeof value === 'string') {
      return value
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Not set';
    }
    return value?.charAt(0).toUpperCase() + value?.slice(1) || 'Not set';
  };

  if (loading) {
    return (
      <ProfileSkeleton />
    );
  }

  return (
    <div className="min-h-screen relative pt-24 overflow-hidden">
      {/* Dot Grid Background Pattern */}
      <div className="fixed inset-0 bg-custom-charcoal -z-10">
        {/* Animated dot pattern */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" patternUnits="userSpaceOnUse" width="40" height="40">
              <circle cx="20" cy="20" r="2" fill="white" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Back Button - Top Left */}
      <div className="z-30 p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-custom-white/10 transition-all duration-200 text-custom-white font-medium text-sm font-lato group backdrop-blur-sm border border-custom-white/20"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform duration-200">←</span>
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg animate-slide-up backdrop-blur-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-lg animate-slide-up backdrop-blur-sm">
            ✓ {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Account Information Card */}
          <div className="bg-custom-white/10 backdrop-blur-xl border border-custom-white/20 rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:bg-custom-white/15 transition-all duration-300">
            <h2 className="text-2xl font-bold text-custom-white font-playfair mb-8">Account Information</h2>
            
            {/* Profile Picture */}
            {user?.imageUrl && (
              <div className="mb-8 flex justify-center">
                <img 
                  src={user.imageUrl} 
                  alt={user.fullName || 'Profile'} 
                  className="w-32 h-32 rounded-full border-4 border-custom-white/30 object-cover ring-2 ring-custom-white/20"
                />
              </div>
            )}

            {editingProfile ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-custom-white/90 mb-2 font-lato">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-custom-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-white text-custom-charcoal font-lato bg-custom-white/90 placeholder-custom-dark-gray"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-custom-white/90 mb-2 font-lato">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-custom-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-white text-custom-charcoal font-lato bg-custom-white/90 placeholder-custom-dark-gray"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="flex-1 py-3 px-4 rounded-lg font-medium text-custom-white bg-custom-white/10 hover:bg-custom-white/20 transition-all duration-200 font-lato border border-custom-white/20 backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex-1 py-3 px-4 rounded-lg font-medium text-custom-charcoal bg-custom-white hover:bg-custom-white/90 transition-all duration-200 disabled:opacity-50 font-lato"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-custom-white/70 font-lato mb-1">Name</p>
                  <p className="text-lg font-semibold text-custom-white font-lato">{profile?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-custom-white/70 font-lato mb-1">Email</p>
                  <p className="text-lg font-semibold text-custom-white font-lato">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-custom-white/70 font-lato mb-1">Member Since</p>
                  <p className="text-lg font-semibold text-custom-white font-lato">{new Date(profile?.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setEditingProfile(true)}
                  className="w-full mt-4 py-3 px-4 rounded-lg font-medium text-custom-charcoal bg-custom-white hover:bg-custom-white/90 transition-all duration-200 font-lato"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Skin Profile Card - Now Editable */}
          {preferences && (
            <div className="bg-custom-white/10 backdrop-blur-xl border border-custom-white/20 rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:bg-custom-white/15 transition-all duration-300 relative overflow-hidden">
              <h2 className="text-2xl font-bold text-custom-white font-playfair mb-8">Skin Profile</h2>
              
              {!profile?.profile?.onboardingCompleted ? (
                <div className="relative">
                  {/* Blurred Content Placeholder */}
                  <div className="filter blur-md select-none pointer-events-none space-y-6 opacity-30">
                    <div>
                      <p className="text-sm text-custom-white/70 font-lato mb-1">Skin Type</p>
                      <p className="text-lg font-semibold text-custom-white capitalize font-lato">Combination</p>
                    </div>
                    <div>
                      <p className="text-sm text-custom-white/70 font-lato mb-1">Sensitivity</p>
                      <p className="text-lg font-semibold text-custom-white font-lato">Normal to Moderate</p>
                    </div>
                    <div>
                      <p className="text-sm text-custom-white/70 font-lato mb-1">Change Frequency</p>
                      <p className="text-lg font-semibold text-custom-white capitalize font-lato">Frequently</p>
                    </div>
                  </div>
                  
                  {/* Overlay Banner */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <p className="text-custom-white font-semibold text-lg mb-2">Onboarding Required</p>
                    <p className="text-custom-white/70 text-xs mb-6 max-w-xs leading-relaxed">
                      Complete your skin profile onboarding to view and manage your personalized skincare safety settings.
                    </p>
                    <button
                      onClick={() => navigate('/onboarding')}
                      className="px-6 py-2.5 bg-custom-white text-custom-charcoal font-semibold rounded-xl hover:bg-custom-off-white transition duration-200 font-lato text-sm shadow-lg hover:scale-105"
                    >
                      Start Onboarding
                    </button>
                  </div>
                </div>
              ) : (
                editingSkin ? (
                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-custom-white/90 mb-2 font-lato">Skin Type</label>
                      <select
                        value={skinFormData.skinType}
                        onChange={(e) => setSkinFormData(prev => ({ ...prev, skinType: e.target.value }))}
                        className="w-full px-4 py-3 border border-custom-white/20 rounded-lg text-custom-charcoal focus:outline-none focus:ring-2 focus:ring-custom-white font-lato bg-custom-white/90"
                      >
                        <option value="">Select skin type</option>
                        {skinTypeOptions.map(type => (
                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-3 text-sm font-medium text-custom-white/90 cursor-pointer font-lato">
                        <input
                          type="checkbox"
                          checked={skinFormData.highSensitivity}
                          onChange={(e) => setSkinFormData(prev => ({ ...prev, highSensitivity: e.target.checked }))}
                          className="w-5 h-5 rounded border-custom-white/30 focus:ring-2 focus:ring-custom-white cursor-pointer"
                        />
                        <span>High Sensitivity</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-custom-white/90 mb-3 font-lato">Known Allergies</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {allergyOptions.map(allergy => (
                          <label key={allergy} className="flex items-center gap-3 cursor-pointer font-lato">
                            <input
                              type="checkbox"
                              checked={skinFormData.knownAllergies.includes(allergy)}
                              onChange={() => handleAllergyChange(allergy)}
                              className="w-5 h-5 rounded border-custom-white/30 focus:ring-2 focus:ring-custom-white cursor-pointer"
                            />
                            <span className="text-sm text-custom-white/80">{allergy}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-custom-white/90 mb-2 font-lato">Product Change Rate</label>
                      <select
                        value={skinFormData.productChangeRate}
                        onChange={(e) => setSkinFormData(prev => ({ ...prev, productChangeRate: e.target.value }))}
                        className="w-full px-4 py-3 border border-custom-white/20 rounded-lg text-custom-charcoal focus:outline-none focus:ring-2 focus:ring-custom-white font-lato bg-custom-white/90"
                      >
                        <option value="">Select rate</option>
                        {productChangeRateOptions.map(rate => {
                          const displayRate = rate.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                          return (
                            <option key={rate} value={rate}>{displayRate}</option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSkin(false);
                          setSkinFormData({
                            skinType: preferences.skinType || '',
                            highSensitivity: preferences.highSensitivity || false,
                            knownAllergies: preferences.knownAllergies || [],
                            productChangeRate: preferences.productChangeRate || ''
                          });
                        }}
                        className="flex-1 py-3 px-4 rounded-lg font-medium text-custom-white bg-custom-white/10 hover:bg-custom-white/20 transition-all duration-200 font-lato border border-custom-white/20 backdrop-blur-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSkinProfile}
                        disabled={loading}
                        className="flex-1 py-3 px-4 rounded-lg font-medium text-custom-charcoal bg-custom-white hover:bg-custom-white/90 transition-all duration-200 disabled:opacity-50 font-lato"
                      >
                        {loading ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-custom-white/70 font-lato mb-1">Skin Type</p>
                      <p className="text-lg font-semibold text-custom-white capitalize font-lato">{preferences.skinType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-custom-white/70 font-lato mb-1">Sensitivity</p>
                      <p className="text-lg font-semibold text-custom-white font-lato">
                        {preferences.highSensitivity ? 'Highly Sensitive' : 'Normal to Moderate'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-custom-white/70 font-lato mb-1">Change Frequency</p>
                      <p className="text-lg font-semibold text-custom-white capitalize font-lato">{getFormattedValue(preferences.productChangeRate)}</p>
                    </div>
                    {preferences.knownAllergies?.length > 0 && (
                      <div>
                        <p className="text-sm text-custom-white/70 font-lato mb-3">Known Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {preferences.knownAllergies.map(allergy => (
                            <span
                              key={allergy}
                              className="inline-block bg-custom-white/20 text-custom-white text-xs font-semibold px-3 py-1.5 rounded-full font-lato border border-custom-white/30 backdrop-blur-sm"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setEditingSkin(true)}
                      className="w-full mt-4 py-3 px-4 rounded-lg font-medium text-custom-charcoal bg-custom-white hover:bg-custom-white/90 transition-all duration-200 font-lato"
                    >
                      Edit Profile
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
