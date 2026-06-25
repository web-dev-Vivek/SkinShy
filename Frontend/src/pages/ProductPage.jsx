import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useOnboarding } from '../context/OnboardingContext';
import OnboardingWarningBanner from '../components/Common/OnboardingWarningBanner';
import SafetyBar from '../components/SafetyBar';
import SafetyScoreSkeleton from '../components/Skeletons/SafetyScoreSkeleton';
import ProductDetailSkeleton from '../components/Skeletons/ProductDetailSkeleton';
import { getProductById } from '../services/products';
import { convertPrice } from '../utils/currencyConverter';
import { useCurrency } from '../context/CurrencyContext';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { complete_onboarding } = useOnboarding();
  const { selectedCurrency } = useCurrency();
  const [product, setProduct] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isLoaded, isSignedIn, complete_onboarding]);

  const loadProductData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load product from backend API (which includes safety score for authenticated users)
      const productData = await getProductById(id);
      
      if (!productData) {
        setError('Product not found');
        setProduct(null);
        setLoading(false);
        return;
      }
      
      setProduct(productData);
      
      // Only show safety score if user is signed in AND onboarding is completed
      if (isSignedIn && complete_onboarding === 1 && productData.safetyScore) {
        setSafetyScore(productData.safetyScore);
      } else {
        setSafetyScore(null);
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      // Extract error message from axios error or use default
      let errorMessage = 'Failed to load product. Please try again.';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

    if (loading) {
      return (
        <>
          <OnboardingWarningBanner />
          <div className={`min-h-screen bg-custom-white ${complete_onboarding !== 1 ? 'mt-[156px]' : 'mt-20'} transition-all duration-300`}>
            <div className="max-w-7xl mx-auto px-4 py-12">
              <ProductDetailSkeleton />
            </div>
          </div>
        </>
      );
    }

    if (error) {
      return (
        <>
          <OnboardingWarningBanner />
          <div className={`min-h-screen bg-custom-white ${complete_onboarding !== 1 ? 'mt-[156px]' : 'mt-20'} transition-all duration-300`}>
         <div className="sticky z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/search')}
              className="text-custom-charcoal hover:text-custom-black font-semibold flex items-center gap-1 transition"
            >
              ← Back to Search
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-custom-charcoal mb-2">Failed to Load Product</h2>
            <p className="text-custom-dark-gray mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => loadProductData()}
                className="px-6 py-2 bg-custom-charcoal text-custom-white font-semibold rounded-lg hover:bg-custom-black transition"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/search')}
                className="px-6 py-2 border border-custom-light-gray text-custom-charcoal font-semibold rounded-lg hover:border-custom-charcoal transition"
              >
                Back to Search
              </button>
             </div>
            </div>
         </div>
        </div>
        </>
      );
    }

   if (!product) {
     return (
       <>
         <OnboardingWarningBanner />
         <div className={`min-h-screen bg-custom-white ${complete_onboarding !== 1 ? 'mt-[156px]' : 'mt-20'} flex items-center justify-center transition-all duration-300`}>
           <div className="text-center">
             <p className="text-red-600 text-lg">Product not found</p>
             <button onClick={() => navigate('/search')} className="mt-4 text-custom-charcoal hover:text-custom-black">
               Back to Search
             </button>
           </div>
         </div>
       </>
     );
   }

   // Parse ingredients string or array into array
   const ingredientsList = product.ingredients
     ? Array.isArray(product.ingredients)
       ? product.ingredients.map(ing => 
           typeof ing === 'string' ? ing : ing.name || JSON.stringify(ing)
         )
       : product.ingredients.split(',').map(ing => ing.trim())
     : [];

   return (
     <>
       <OnboardingWarningBanner />
       <div className={`min-h-screen bg-custom-white ${complete_onboarding !== 1 ? 'mt-[156px]' : 'mt-20'} transition-all duration-300`}>
       {/* Header */}
       <div className="bg-custom-off-white border-b border-custom-light-gray/20 sticky z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/search')}
            className="text-custom-charcoal hover:text-custom-black font-semibold flex items-center gap-1 transition"
          >
            ← Back to Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Product Image & Info */}
          <div className="lg:col-span-1 space-y-6">
             {/* Product Image */}
             <div className="aspect-square bg-custom-light-gray/10 border-2 border-dashed border-custom-light-gray/30 rounded-2xl flex items-center justify-center overflow-hidden">
               {product.productUrl ? (
                 <img
                   src={product.productUrl}
                   alt={product.productName}
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     e.target.style.display = 'none';
                   }}
                 />
               ) : (
                <div className="text-center text-custom-dark-gray">
                  <svg className="w-16 h-16 mx-auto opacity-30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Product Image</p>
                </div>
              )}
            </div>

             {/* Product Name & Price */}
             <div className="border-t pt-6 space-y-3">
               <h1 className="text-2xl lg:text-3xl font-bold text-custom-charcoal font-playfair break-words">{product.productName}</h1>
               
               {product.productType && (
                 <p className="text-custom-dark-gray text-sm lg:text-base">{product.productType}</p>
               )}

               {product.price && (
                 <p className="text-2xl lg:text-3xl font-bold text-custom-charcoal">{convertPrice(product.price, selectedCurrency)}</p>
               )}

               {product.productUrl && (
                 <a
                   href={product.productUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-block bg-custom-charcoal hover:bg-custom-black text-custom-white font-semibold py-2 px-4 rounded-lg transition w-full text-center mt-4"
                 >
                   View on Store →
                 </a>
               )}
            </div>
          </div>

          {/* RIGHT COLUMN: Ingredients & Safety */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Auth Required Prompt */}
            {!isSignedIn && (
              <div className="bg-custom-charcoal text-custom-white rounded-2xl p-6 lg:p-8">
                <h2 className="text-lg lg:text-xl font-bold mb-3">Sign In for Safety Analysis</h2>
                <p className="text-custom-off-white mb-6">
                  Get a detailed safety analysis for this product, including ingredient risks and personalized recommendations based on your skin profile.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-custom-white text-custom-charcoal hover:bg-custom-off-white px-6 py-2 font-semibold rounded-lg transition"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="border border-custom-white text-custom-white hover:bg-custom-white/10 px-6 py-2 font-semibold rounded-lg transition"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
            
            {/* Ingredients Section */}
            {ingredientsList.length > 0 && (
              <div className="bg-custom-off-white border border-custom-light-gray/20 rounded-2xl p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg lg:text-xl font-bold text-custom-charcoal">Ingredients</h2>
                  <span className="bg-custom-light-gray/20 text-custom-charcoal text-sm font-semibold px-3 py-1 rounded-full">
                    {ingredientsList.length} items
                  </span>
                </div>

                {/* Ingredients List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                  {ingredientsList.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="bg-custom-white border border-custom-light-gray/20 rounded-xl p-4 hover:shadow-md hover:border-custom-light-gray/40 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-custom-dark-gray bg-custom-light-gray/30 px-2 py-1 rounded">
                              #{idx + 1}
                            </span>
                            <span className="text-sm lg:text-base font-semibold text-custom-charcoal break-words">{ingredient}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety & Risk Percentage - Below Ingredients */}
            {isSignedIn && (
              safetyScore ? (
                <SafetyBar safetyScore={safetyScore} />
              ) : (
                <SafetyScoreSkeleton />
              )
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
     </div>
     </>
   );
 }
