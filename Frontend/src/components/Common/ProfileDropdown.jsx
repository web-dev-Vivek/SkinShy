import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { getUserProfile, getUserPreferences, updateUserPreferences } from '../../services/users';

function ProfileDropdown({ isMobile = false }) {
  const { signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const { complete_onboarding } = useOnboarding();
  
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const dropdownRef = useRef(null);

  const [editFormData, setEditFormData] = useState({
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

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);

      if (complete_onboarding === 1) {
        try {
          const preferences = await getUserPreferences();
          setUserPreferences(preferences);
          setEditFormData({
            skinType: preferences.skinType || '',
            highSensitivity: preferences.highSensitivity || false,
            knownAllergies: preferences.knownAllergies || [],
            productChangeRate: preferences.productChangeRate || ''
          });
        } catch (err) {
          console.log('Could not fetch preferences:', err);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateUserPreferences(editFormData);
      setUserPreferences(editFormData);
      setIsEditing(false);
      await fetchUserData();
    } catch (error) {
      console.error('Failed to update preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllergyChange = (allergy) => {
    setEditFormData(prev => ({
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
    // Handle enum values with underscores (e.g., 'very_frequently' -> 'Very Frequently')
    if (typeof value === 'string') {
      return value
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Not set';
    }
    return value?.charAt(0).toUpperCase() + value?.slice(1) || 'Not set';
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut(() => {
      window.location.href = '/';
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-custom-light-gray transition-colors focus:outline-none"
      >
        {clerkUser?.profileImageUrl ? (
          <img
            src={clerkUser.profileImageUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-custom-charcoal flex items-center justify-center text-custom-white text-sm font-medium">
            {clerkUser?.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <span className="hidden sm:inline text-sm font-medium text-custom-dark-gray">
          {clerkUser?.firstName || 'Profile'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 bg-custom-white rounded-xl shadow-xl border border-custom-light-gray z-50 overflow-hidden ${
            isMobile 
              ? 'w-full max-w-xs sm:w-80 sm:max-w-sm' 
              : 'w-full max-w-xs sm:w-80 md:w-96'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-custom-charcoal to-custom-dark-gray p-3 sm:p-4 text-custom-white">
            <div className="flex items-center gap-2 sm:gap-3">
              {clerkUser?.profileImageUrl ? (
                <img
                  src={clerkUser.profileImageUrl}
                  alt="Profile"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-custom-light-gray flex items-center justify-center text-custom-charcoal text-base sm:text-lg font-bold flex-shrink-0">
                  {clerkUser?.firstName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">{clerkUser?.fullName || 'User'}</p>
                <p className="text-xs sm:text-sm text-custom-light-gray truncate">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-custom-light-gray">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('profile');
              }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-custom-charcoal border-b-2 border-custom-charcoal'
                  : 'text-custom-dark-gray hover:text-custom-charcoal'
              }`}
            >
              Profile
            </button>
            {complete_onboarding === 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('skin');
                }}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'skin'
                    ? 'text-custom-charcoal border-b-2 border-custom-charcoal'
                    : 'text-custom-dark-gray hover:text-custom-charcoal'
                }`}
              >
                Skin Details
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 max-h-96 overflow-y-auto">
            {isLoading && activeTab === 'profile' && <p className="text-center text-custom-dark-gray py-4 text-sm">Loading...</p>}

            {!isLoading && activeTab === 'profile' && userProfile && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-custom-dark-gray mb-1">Name</label>
                  <p className="text-sm text-custom-charcoal break-words">{userProfile.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-custom-dark-gray mb-1">Email</label>
                  <p className="text-sm text-custom-charcoal break-words">{userProfile.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-custom-dark-gray mb-1">Account Status</label>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <p className="text-sm text-custom-charcoal">Active</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skin' && (
              <div className="space-y-3">
                {!isEditing && userPreferences ? (
                  <div className="space-y-2">
                    <div className="bg-custom-off-white p-2 sm:p-3 rounded-lg">
                      <label className="block text-xs font-semibold text-custom-dark-gray mb-1">Skin Type</label>
                      <p className="text-sm text-custom-charcoal font-medium break-words">{getFormattedValue(userPreferences.skinType)}</p>
                    </div>

                    <div className="bg-custom-off-white p-2 sm:p-3 rounded-lg">
                      <label className="block text-xs font-semibold text-custom-dark-gray mb-1">High Sensitivity</label>
                      <p className="text-sm text-custom-charcoal font-medium">{getFormattedValue(userPreferences.highSensitivity)}</p>
                    </div>

                    <div className="bg-custom-off-white p-2 sm:p-3 rounded-lg">
                      <label className="block text-xs font-semibold text-custom-dark-gray mb-1">Known Allergies</label>
                      <p className="text-sm text-custom-charcoal font-medium break-words">{getFormattedValue(userPreferences.knownAllergies)}</p>
                    </div>

                    <div className="bg-custom-off-white p-2 sm:p-3 rounded-lg">
                      <label className="block text-xs font-semibold text-custom-dark-gray mb-1">Product Change Rate</label>
                      <p className="text-sm text-custom-charcoal font-medium break-words">{getFormattedValue(userPreferences.productChangeRate)}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditing(true);
                      }}
                      className="w-full mt-3 px-3 sm:px-4 py-2 bg-custom-charcoal text-custom-white rounded-lg hover:bg-custom-black transition font-medium text-sm"
                    >
                      Edit Skin Details
                    </button>
                  </div>
                ) : (
                  <form className="space-y-2 sm:space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-custom-charcoal mb-1 sm:mb-2">Skin Type</label>
                      <select
                        value={editFormData.skinType}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, skinType: e.target.value }))}
                        className="w-full px-2 sm:px-3 py-2 border border-custom-light-gray rounded-lg text-xs sm:text-sm focus:outline-none focus:border-custom-charcoal"
                      >
                        <option value="">Select skin type</option>
                        {skinTypeOptions.map(type => (
                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-custom-charcoal cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editFormData.highSensitivity}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, highSensitivity: e.target.checked }))}
                          className="w-4 h-4 rounded border-custom-light-gray flex-shrink-0"
                        />
                        <span>High Sensitivity</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-custom-charcoal mb-1 sm:mb-2">Known Allergies</label>
                      <div className="space-y-1 max-h-28 sm:max-h-32 overflow-y-auto">
                        {allergyOptions.map(allergy => (
                          <label key={allergy} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editFormData.knownAllergies.includes(allergy)}
                              onChange={() => handleAllergyChange(allergy)}
                              className="w-4 h-4 rounded border-custom-light-gray flex-shrink-0"
                            />
                            <span className="text-xs sm:text-sm text-custom-dark-gray break-words">{allergy}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-custom-charcoal mb-1 sm:mb-2">Product Change Rate</label>
                       <select
                         value={editFormData.productChangeRate}
                         onChange={(e) => setEditFormData(prev => ({ ...prev, productChangeRate: e.target.value }))}
                         className="w-full px-2 sm:px-3 py-2 border border-custom-light-gray rounded-lg text-xs sm:text-sm focus:outline-none focus:border-custom-charcoal"
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

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsEditing(false);
                          setEditFormData({
                            skinType: userPreferences.skinType || '',
                            highSensitivity: userPreferences.highSensitivity || false,
                            knownAllergies: userPreferences.knownAllergies || [],
                            productChangeRate: userPreferences.productChangeRate || ''
                          });
                        }}
                        className="flex-1 px-2 sm:px-4 py-2 border border-custom-light-gray text-custom-charcoal rounded-lg hover:bg-custom-off-white transition font-medium text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePreferences}
                        disabled={isLoading}
                        className="flex-1 px-2 sm:px-4 py-2 bg-custom-charcoal text-custom-white rounded-lg hover:bg-custom-black transition font-medium text-xs sm:text-sm disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'skin' && complete_onboarding !== 1 && (
              <div className="text-center py-6">
                <p className="text-sm text-custom-dark-gray mb-2">Complete your onboarding to manage skin details</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/onboarding';
                  }}
                  className="px-4 py-2 bg-custom-charcoal text-custom-white rounded-lg hover:bg-custom-black transition font-medium text-sm"
                >
                  Start Onboarding
                </button>
              </div>
            )}
          </div>

           {/* Footer */}
          <div className="border-t border-custom-light-gray p-3 sm:p-4 bg-custom-off-white">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full px-3 sm:px-4 py-2 text-custom-charcoal border border-custom-light-gray rounded-lg hover:bg-custom-white transition font-medium text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
