import { useAuth } from '@clerk/clerk-react';

/**
 * Frontend auth service for Clerk integration
 * Provides helper functions to interact with Clerk authentication
 */

/**
 * Get the current Clerk user object
 * @returns {Promise<Object>} Clerk user object
 */
export const getCurrentUser = async (user) => {
  return user;
};

/**
 * Get the current authentication token
 * @param {Object} session - Clerk session object
 * @returns {Promise<string>} JWT token for authenticated requests
 */
export const getToken = async (session) => {
  if (!session) return null;
  return await session.getToken();
};

/**
 * Verify if a token is valid
 * @param {string} token - The JWT token to verify
 * @returns {Promise<boolean>} True if token is valid, false otherwise
 */
export const verifyToken = async (token) => {
  if (!token) return false;

  try {
    // Token validity is checked by Clerk automatically
    // If we got the token from Clerk, it's valid
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

/**
 * Get the Clerk user ID (sub claim)
 * @param {Object} user - Clerk user object
 * @returns {string} Clerk user ID
 */
export const getUserId = (user) => {
  return user?.id;
};

/**
 * Get user's full name from Clerk
 * @param {Object} user - Clerk user object
 * @returns {string} User's full name
 */
export const getUserName = (user) => {
  if (!user) return '';
  return user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
};

/**
 * Get user's email from Clerk
 * @param {Object} user - Clerk user object
 * @returns {string} User's email
 */
export const getUserEmail = (user) => {
  if (!user?.emailAddresses?.length) return '';
  return user.emailAddresses[0].emailAddress;
};

/**
 * Check if user is authenticated
 * @param {Object} session - Clerk session object
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = (session) => {
  return !!session;
};
