import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ProductDropdown from './ProductDropdown';

export default function PageHeader({ showTitle = true }) {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  return (
    <header className="bg-custom-charcoal text-custom-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-8">
            <h1 
              onClick={() => navigate('/')}
              className="text-4xl font-bold font-playfair cursor-pointer hover:text-custom-off-white transition"
            >
              Skinshy
            </h1>
            {showTitle && <ProductDropdown />}
          </div>
          <div className="flex gap-3">
            {isSignedIn ? (
              <button
                onClick={() => navigate('/profile')}
                className="bg-custom-white/20 hover:bg-custom-white/30 px-4 py-2 rounded-lg font-semibold transition"
              >
                Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-custom-white/20 hover:bg-custom-white/30 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-custom-white text-custom-charcoal hover:bg-custom-off-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
