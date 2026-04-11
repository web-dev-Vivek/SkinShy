import React, { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { api } from '../services/api';

export default function UserSyncComponent({ children }) {
  const { isLoaded: isAuthLoaded, getToken } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthLoaded && isUserLoaded && user) {
        try {
          // Get the token from Clerk
          const token = await getToken();
          
          if (!token) {
            console.warn('No token available for user sync');
            return;
          }

          // Use axios with token already set in headers
          const response = await api.post('/auth/sync', {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            name: user.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : 'User',
            profileImage: user.profileImageUrl || null
          });

          console.log('User synced successfully:', response.data);
        } catch (error) {
          console.error('Error syncing user:', error.response?.data?.error || error.message);
        }
      }
    };

    syncUser();
  }, [isAuthLoaded, isUserLoaded, user, getToken]);

  return <>{children}</>;
}
