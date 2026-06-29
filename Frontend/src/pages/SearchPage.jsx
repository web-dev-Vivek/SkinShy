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
  const [productTypes, setProductTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
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

  // Fetch unique product types on mount
  useEffect(() => {
    api.get('/products/types')
      .then(res => {
        if (res.data && res.data.success) {
          // Sort types alphabetically for better UX
          const sortedTypes = (res.data.data || []).sort((a, b) => a.localeCompare(b));
          setProductTypes(sortedTypes);
        }
      })
      .catch(err => {
        console.error('Error fetching product types:', err);
      });
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
    if (selectedType) {
      params.type = selectedType;
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
  }, [searchQuery, selectedType]);

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
    if (selectedType) {
      params.type = selectedType;
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
  }, [currentPage, loadingMore, hasMoreProducts, searchQuery, selectedType, products.length]);

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

      <div className="flex flex-col h-screen pt-20 relative z-0">

        {/* Onboarding Banner Spacer (10% height) */}
        {complete_onboarding !== 1 && (
          <div className="h-[10vh] flex-shrink-0" />
        )}

        {/* Fixed Search Bar Header (20% height) */}
        <div className="h-[25vh] flex-shrink-0 px-4 py-4 z-30 transition-all duration-300">
          <div className="max-w-7xl mx-auto h-full flex flex-col justify-between">
            {/* Header Text */}
            <div>
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

            {/* Product Type Filter Pills */}
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <button
                onClick={() => setSelectedType('')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap backdrop-blur-sm ${selectedType === ''
                  ? 'bg-white text-custom-charcoal shadow-md font-semibold scale-105'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
                  }`}
              >
                All Products
              </button>
              {productTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap backdrop-blur-sm ${selectedType === type
                    ? 'bg-white text-custom-charcoal shadow-md font-semibold scale-105'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Products Container (60% or 70% height) */}
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-custom">
          <div className="relative z-10 px-4">
            <div className="max-w-7xl mx-auto">

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
                  <div className="grid grid-cols-1 md:mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
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
