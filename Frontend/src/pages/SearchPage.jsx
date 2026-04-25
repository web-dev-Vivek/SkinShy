import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import OnboardingWarningBanner from '../components/Common/OnboardingWarningBanner';
import ProductGridSkeleton from '../components/Skeletons/ProductGridSkeleton';
import ProductCardSkeleton from '../components/Skeletons/ProductCardSkeleton';
import CurrencySelector from '../components/Common/CurrencySelector';
import { convertPrice } from '../utils/currencyConverter';
import { useCurrency } from '../context/CurrencyContext';

const PRODUCTS_PER_PAGE = 100;

export default function SearchPage() {
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
  const observerTarget = useRef(null);

  // Initial load - fetch first batch of products
  useEffect(() => {
    setLoading(true);
    setCurrentPage(0);
    setProducts([]);
    setFilteredProducts([]);
    setHasMoreProducts(true);
    
    let url = `http://localhost:5000/api/products?skip=0&limit=${PRODUCTS_PER_PAGE}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
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
    
    let url = `http://localhost:5000/api/products?skip=${skip}&limit=${PRODUCTS_PER_PAGE}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
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
      <div className="min-h-screen bg-custom-white px-4 py-8 mt-20">
      <div className="max-w-7xl mx-auto">
       {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <h1 className="text-4xl font-bold font-playfair text-custom-charcoal mb-2">
                Welcome, {user?.firstName || 'User'}!
              </h1>
              <p className="text-custom-dark-gray">
                Browse personalized skincare products for you
              </p>
            </div>
            
            {/* Search Bar and Currency Converter on same line */}
            <div className="flex gap-2">
              <div className="w-12/14">
                <input
                  type="text"
                  placeholder="Search products by name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-custom-light-gray/30 rounded-lg focus:ring-2 focus:ring-custom-charcoal focus:border-transparent text-custom-charcoal placeholder-custom-dark-gray"
                />
              </div>
              <div className="w-1/14 flex items-center">
                <CurrencySelector />
              </div>
            </div>
          </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-custom-dark-gray">
          Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>

        {/* Loading State */}
        {loading && (
          <ProductGridSkeleton count={12} />
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-custom-dark-gray text-lg">
              No products found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredProducts.map(product => (
                 <div
                   key={product._id}
                   onClick={() => handleProductClick(product._id, product.productName)}
                   className="border border-custom-light-gray/20 rounded-lg p-4 hover:shadow-lg hover:border-custom-charcoal/30 transition cursor-pointer hover:scale-105 transform"
                 >
                  <h3 className="font-semibold text-custom-charcoal mb-2 line-clamp-2 hover:text-custom-black">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-custom-dark-gray mb-2">
                    {product.productType}
                  </p>
                   <p className="text-lg font-bold text-custom-charcoal">
                     {convertPrice(product.price, selectedCurrency)}
                   </p>
                </div>
              ))}
            </div>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            )}

            {/* Observer target for infinite scroll */}
            <div ref={observerTarget} className="py-8" />

            {/* No More Products Message */}
            {!hasMoreProducts && filteredProducts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-custom-dark-gray">You've reached the end of available products</p>
              </div>
            )}
          </>
        )}
       </div>
      </div>
    </>
  );
}
