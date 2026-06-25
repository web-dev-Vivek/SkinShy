import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import OnboardingWarningBanner from '../components/Common/OnboardingWarningBanner';
import { useOnboarding } from '../context/OnboardingContext';
import CurrencySelector from '../components/Common/CurrencySelector';
import { convertPrice } from '../utils/currencyConverter';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

const PRODUCTS_PER_PAGE = 100;

export default function SearchPage() {
  const { complete_onboarding } = useOnboarding();
  const navigate = useNavigate();
  const { user } = useUser();
  const { selectedCurrency } = useCurrency();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const observerTarget = useRef(null);

  // Handle responsive background image
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload background images
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };
    preloadImage('/Backmen.png');
    preloadImage('/Backmenmobile.png');
  }, []);

  // Initial load - fetch first batch of products
  useEffect(() => {
    setLoading(true);
    setCurrentPage(0);
    setProducts([]);
    setFilteredProducts([]);
    setHasMoreProducts(true);
    
    let params = {
      skip: 0,
      limit: PRODUCTS_PER_PAGE
    };
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    
    api.get('/products', { params })
      .then(res => {
        const data = res.data;
        setProducts(data.data || []);
        setFilteredProducts(data.data || []);
        // Check if there are more products available by comparing with total count
        const totalProducts = data.pagination?.total || 0;
        const loadedProducts = (data.data || []).length;
        setHasMoreProducts(loadedProducts + 0 < totalProducts);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [searchQuery]);

  // Load more products when user scrolls to bottom
  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMoreProducts) return;

    setLoadingMore(true);
    const skip = currentPage * PRODUCTS_PER_PAGE;
    
    let params = {
      skip,
      limit: PRODUCTS_PER_PAGE
    };
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    
    api.get('/products', { params })
      .then(res => {
        const data = res.data;
        const newProducts = data.data || [];
        setProducts(prev => {
          const combined = [...prev, ...newProducts];
          // Remove duplicates based on product ID
          const uniqueProducts = Array.from(new Map(combined.map(p => [p._id, p])).values());
          setFilteredProducts(uniqueProducts);
          return uniqueProducts;
        });
        // Check if there are more products available by comparing with total count
        const totalProducts = data.pagination?.total || 0;
        const currentLoadedCount = products.length + newProducts.length;
        setHasMoreProducts(currentLoadedCount < totalProducts);
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
      })
      .catch(err => {
        console.error('Error fetching more products:', err);
        setLoadingMore(false);
      });
  }, [currentPage, loadingMore, hasMoreProducts, searchQuery, products.length]);

   // Intersection Observer for infinite scroll
   useEffect(() => {
     const observer = new IntersectionObserver(
       entries => {
         if (entries[0].isIntersecting && !loadingMore && hasMoreProducts) {
           loadMoreProducts();
         }
       },
       { threshold: 0.1 }
     );

     const target = observerTarget.current;
     if (target) {
       observer.observe(target);
     }

     return () => {
       if (target) {
         observer.unobserve(target);
       }
     };
   }, [loadMoreProducts, loadingMore, hasMoreProducts]);

  const handleProductClick = (productId, productName) => {
    navigate(`/search/${productId}`, { state: { productName } });
  };

    return (
      <>
        <OnboardingWarningBanner />
        {/* Fixed Background - Full Screen */}
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `url('${isMobile ? '/Backmenmobile.png' : '/Backmen.png'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        <div className="flex flex-col h-screen relative z-0">

          {/* Fixed Search Bar Header */}
          <div className={`fixed ${complete_onboarding !== 1 ? 'top-36 sm:top-40' : 'top-16 sm:top-20'} left-0 right-0 z-30 px-4 py-6 transition-all duration-300`}>
            <div className="max-w-7xl mx-auto">
              {/* Header Text */}
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold font-playfair text-white mb-1">
                  Welcome, {user?.firstName || 'User'}!
                </h1>
                <p className="text-white/80 text-sm md:text-base">
                  Browse personalized skincare products for you
                </p>
              </div>
              
              {/* Search Bar and Currency Converter on same line */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search products by name or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-custom-charcoal placeholder-custom-dark-gray bg-white/90"
                  />
                </div>
                <div className="flex items-center">
                  <CurrencySelector />
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Products Container */}
          <div className={`flex-1 overflow-y-auto ${complete_onboarding !== 1 ? 'mt-72 md:mt-[336px]' : 'mt-52 md:mt-64'} pb-20 scrollbar-custom transition-all duration-300`}>
            <div className="relative z-10 px-4">
              <div className="max-w-7xl mx-auto">
                
                {/* Results Count */}
                <div className="mb-6 text-sm text-white/80">
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white/80">Loading products...</p>
                  </div>
                )}

                {/* No Results */}
                {!loading && filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/80 text-lg">
                      No products found matching "{searchQuery}"
                    </p>
                  </div>
                )}

                {/* Products Grid */}
                {!loading && filteredProducts.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                      {filteredProducts.map(product => (
                        <div
                          key={product._id}
                          onClick={() => handleProductClick(product._id, product.productName)}
                          className="border border-white/20 rounded-lg p-4 hover:shadow-lg hover:border-white/50 transition cursor-pointer hover:scale-105 transform bg-white/10 backdrop-blur-sm"
                        >
                          <h3 className="font-semibold text-white mb-2 line-clamp-2 hover:text-white/80">
                            {product.productName}
                          </h3>
                          <p className="text-sm text-white/70 mb-2">
                            {product.productType}
                          </p>
                          <p className="text-lg font-bold text-white">
                            {convertPrice(product.price, selectedCurrency)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Loading More Indicator */}
                    {loadingMore && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-white/70 text-sm">Loading more products...</p>
                      </div>
                    )}

                    {/* Observer target for infinite scroll */}
                    <div ref={observerTarget} className="py-8" />

                    {/* No More Products Message */}
                    {!hasMoreProducts && filteredProducts.length > 0 && (
                      <div className="text-center py-8">
                        <p className="text-white/80">You've reached the end of available products</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
     </>
   );
}
