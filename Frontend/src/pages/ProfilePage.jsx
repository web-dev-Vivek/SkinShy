import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { getUserProfile, getUserPreferences, updateUserProfile } from '../services/users';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [profileData, preferencesData] = await Promise.all([
        getUserProfile(),
        getUserPreferences()
      ]);
      setProfile(profileData);
      setPreferences(preferencesData);
      setFormData({ name: profileData.name, email: profileData.email });
    } catch (error) {
      setError('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(formData.name, formData.email);
      const updatedProfile = await getUserProfile();
      setProfile(updatedProfile);
      setEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    }
  };

   if (loading) {
     return (
       <div className="min-h-screen bg-custom-white flex items-center justify-center">
         <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-charcoal mx-auto mb-4"></div>
           <p className="text-custom-dark-gray">Loading profile...</p>
         </div>
       </div>
     );
   }

   return (
     <div className="min-h-screen bg-custom-white mt-20">
       {/* Header */}
       <div className="bg-custom-charcoal text-custom-white py-8 px-4">
         <div className="max-w-4xl mx-auto flex justify-between items-center">
           <h1 className="text-3xl font-bold font-playfair">My Profile</h1>
           <button
             onClick={() => navigate('/search')}
             className="bg-custom-white/20 hover:bg-custom-white/30 px-4 py-2 rounded-lg font-semibold transition"
           >
             ← Back
           </button>
         </div>
       </div>

       <div className="max-w-4xl mx-auto px-4 py-8">
         {error && (
           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-700 rounded">
             {error}
           </div>
         )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Account Information Card */}
            <div className="bg-custom-white border border-custom-light-gray/20 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-custom-charcoal font-playfair mb-6">Account Information</h2>
              
              {/* Profile Picture */}
              {user?.imageUrl && (
                <div className="mb-6 flex justify-center">
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || 'Profile'} 
                    className="w-32 h-32 rounded-full border-4 border-custom-light-gray object-cover"
                  />
                </div>
              )}

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-custom-charcoal mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-custom-light-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-charcoal text-custom-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-custom-charcoal mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-custom-light-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-charcoal text-custom-charcoal"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 py-2 px-4 rounded-lg font-semibold text-custom-charcoal bg-custom-light-gray/20 hover:bg-custom-light-gray/40 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-2 px-4 rounded-lg font-semibold text-custom-white bg-custom-charcoal hover:bg-custom-black transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-custom-dark-gray">Name</p>
                    <p className="text-lg font-semibold text-custom-charcoal">{profile?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-custom-dark-gray">Email</p>
                    <p className="text-lg font-semibold text-custom-charcoal">{profile?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-custom-dark-gray">Member Since</p>
                    <p className="text-lg font-semibold text-custom-charcoal">{new Date(profile?.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full mt-4 py-2 px-4 rounded-lg font-semibold text-custom-white bg-custom-charcoal hover:bg-custom-black transition"
                  >
                    Edit Profile
                  </button>
               </div>
             )}
           </div>

           {/* Skin Profile Card */}
           {preferences && (
             <div className="bg-custom-white border border-custom-light-gray/20 rounded-lg shadow p-6">
               <h2 className="text-2xl font-bold text-custom-charcoal font-playfair mb-6">Skin Profile</h2>
               <div className="space-y-4">
                 <div>
                   <p className="text-sm text-custom-dark-gray">Skin Type</p>
                   <p className="text-lg font-semibold text-custom-charcoal capitalize">{preferences.skinType}</p>
                 </div>
                 <div>
                   <p className="text-sm text-custom-dark-gray">Sensitivity</p>
                   <p className="text-lg font-semibold text-custom-charcoal">
                     {preferences.highSensitivity ? 'Highly Sensitive' : 'Normal to Moderate'}
                   </p>
                 </div>
                 <div>
                   <p className="text-sm text-custom-dark-gray">Change Frequency</p>
                   <p className="text-lg font-semibold text-custom-charcoal capitalize">{preferences.productChangeRate}</p>
                 </div>
                 {preferences.knownAllergies?.length > 0 && (
                   <div>
                     <p className="text-sm text-custom-dark-gray mb-2">Known Allergies</p>
                     <div className="flex flex-wrap gap-2">
                       {preferences.knownAllergies.map(allergy => (
                         <span
                           key={allergy}
                           className="inline-block bg-custom-light-gray/20 text-custom-charcoal text-xs font-semibold px-3 py-1 rounded-full"
                         >
                           {allergy.replace(/_/g, ' ')}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}
                 <button
                   onClick={() => navigate('/onboarding')}
                   className="w-full mt-4 py-2 px-4 rounded-lg font-semibold text-custom-charcoal bg-custom-light-gray/20 hover:bg-custom-light-gray/40 transition"
                 >
                   Update Preferences
                 </button>
               </div>
             </div>
           )}
         </div>

         {/* Logout Section */}
         <div className="bg-custom-white border border-custom-light-gray/20 rounded-lg shadow p-6 text-center">
           <h2 className="text-xl font-bold text-custom-charcoal font-playfair mb-4">Account Settings</h2>
           <UserButton />
         </div>
      </div>
    </div>
  );
}
