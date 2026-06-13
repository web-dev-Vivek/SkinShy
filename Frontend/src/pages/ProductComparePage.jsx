import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useOnboarding } from '../context/OnboardingContext';
import OnboardingWarningBanner from '../components/Common/OnboardingWarningBanner';
import { getProductById } from '../services/products';
import { api } from '../services/api';
import { convertPrice } from '../utils/currencyConverter';
import { useCurrency } from '../context/CurrencyContext';

const PRODUCTS_PER_PAGE = 100;

export default function ProductComparePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { complete_onboarding } = useOnboarding();
  const { selectedCurrency } = useCurrency();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
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
    preloadImage('/Back.png');
    preloadImage('/Backmenmobile.png');
  }, []);

    // Fetch products with pagination
    useEffect(() => {
      setLoading(true);
      const skip = 0;
      api.get(`/products?skip=${skip}&limit=${PRODUCTS_PER_PAGE}`)
        .then(res => {
          setProducts(res.data.data);
          setFilteredProducts(res.data.data);
          // Check if there are more products
          const totalProducts = res.data.pagination?.total || 0;
          const loadedProducts = (res.data.data || []).length;
          setHasMoreProducts(loadedProducts + skip < totalProducts);
          setCurrentPage(1);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load products');
          setLoading(false);
        });
    }, []);

   // Filter products based on search query
   useEffect(() => {
     if (searchQuery.trim() === '') {
       setFilteredProducts(products);
     } else {
       const query = searchQuery.toLowerCase();
       const filtered = products.filter(product =>
         product.productName.toLowerCase().includes(query) ||
         product.productType.toLowerCase().includes(query)
       );
       setFilteredProducts(filtered);
     }
   }, [searchQuery, products]);

   // Load product details when selected
   const handleProductSelect = async (product) => {
     if (selectedProducts.find(p => p._id === product._id)) {
       // Deselect if already selected
       setSelectedProducts(selectedProducts.filter(p => p._id !== product._id));
       const newDetails = { ...productDetails };
       delete newDetails[product._id];
       setProductDetails(newDetails);
     } else if (selectedProducts.length < 3) {
       // Add to comparison if less than 3 selected
       setLoadingDetails(true);
        try {
          const details = await getProductById(product._id);
          setSelectedProducts([...selectedProducts, product]);
          setProductDetails({
            ...productDetails,
            [product._id]: details
          });
        } catch (err) {
          setError('Failed to load product details');
        } finally {
          setLoadingDetails(false);
        }
     }
   };

    // Check if product is selected
    const isProductSelected = (productId) => {
      return selectedProducts.some(p => p._id === productId);
    };

    // Load more products on infinite scroll
    const loadMoreProducts = useCallback(() => {
      if (loadingMore || !hasMoreProducts) return;

      setLoadingMore(true);
      const skip = currentPage * PRODUCTS_PER_PAGE;
      
      api.get(`/products?skip=${skip}&limit=${PRODUCTS_PER_PAGE}`)
        .then(res => {
          const newProducts = res.data.data || [];
          setProducts(prev => {
            const combined = [...prev, ...newProducts];
            // Remove duplicates based on product ID
            const uniqueProducts = Array.from(new Map(combined.map(p => [p._id, p])).values());
            setFilteredProducts(uniqueProducts);
            return uniqueProducts;
          });
          // Check if there are more products
          const totalProducts = res.data.pagination?.total || 0;
          const currentLoadedCount = products.length + newProducts.length;
          setHasMoreProducts(currentLoadedCount < totalProducts);
          setCurrentPage(prev => prev + 1);
          setLoadingMore(false);
        })
        .catch(err => {
          console.error('Error fetching more products:', err);
          setLoadingMore(false);
        });
    }, [currentPage, loadingMore, hasMoreProducts, products.length]);

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

   if (!isLoaded) {
     return (
       <div className="fixed inset-0 flex items-center justify-center z-50 bg-custom-white animate-scale-grow">
         <img 
           src="/Product.png" 
           alt="Loading" 
           className="w-3/4 md:w-1/2 lg:w-1/3 h-auto object-cover rounded-3xl border-2 border-custom-charcoal/20"
         />
       </div>
     );
   }

   if (!isSignedIn) {
     return (
       <div className="h-screen bg-custom-white mt-20 flex items-center justify-center">
         <div className="text-center">
           <p className="text-custom-dark-gray mb-4">Please sign in to compare products</p>
         </div>
       </div>
     );
   }

   return (
     <>
       <OnboardingWarningBanner />
       
       <div 
         className="h-screen overflow-hidden relative"
         style={{
           backgroundImage: `url('${isMobile ? '/Backmenmobile.png' : '/Back.png'}')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
         }}
       >
         {/* Blur overlay */}
         <div className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-none"></div>
         
         {/* ============ MOBILE VIEW (Vertical Stack) ============ */}
         {isMobile && (
           <div className="relative z-10 pt-24 pb-8 px-4 h-full overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10">
             {/* Header */}
             <div className="text-center mb-6 max-w-md mx-auto">
               <h1 className="text-3xl font-bold text-white mb-2">
                 Compare Products
               </h1>
               <p className="text-sm text-white/80">
                 Select up to 3 products to compare side-by-side. View ingredients, safety scores, and allergen warnings.
               </p>
             </div>

             {/* Error Message */}
             {error && (
               <div className="mb-4 max-w-md mx-auto">
                 <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 backdrop-blur-sm text-sm">
                   {error}
                 </div>
               </div>
             )}

             {/* Vertical Levels */}
             <div className="mx-auto h-full max-w-md space-y-4">
               
               {/* LEVEL 1: Search Bar */}
               <div className="p-4 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                 <input
                   type="text"
                   placeholder="Search Products..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/90 backdrop-blur text-custom-charcoal placeholder:text-custom-dark-gray focus:outline-none focus:border-white transition-all text-sm font-semibold"
                 />
                </div>

                {/* Instruction text between search and product list */}
                {selectedProducts.length === 0 && (
                  <div className="p-3 rounded-lg bg-white/15 border border-white/30 backdrop-blur-sm text-center">
                    <p className="text-xs text-white/80 font-semibold">Select product from product list</p>
                  </div>
                )}

                {/* LEVEL 2: First Selected Product */}
               {selectedProducts.length >= 1 && (
                 <div className="p-4 rounded-lg bg-white/25 border-2 border-white/60 backdrop-blur-sm hover:bg-white/30 transition-all">
                   <div className="flex justify-between items-start gap-3 mb-2">
                     <div className="flex-1 min-w-0">
                       <p className="font-semibold text-sm text-white truncate">
                         {selectedProducts[0].productName}
                       </p>
                       <div className="flex items-center gap-3 mt-2">
                         <div className="w-12 h-0.5 bg-white/50"></div>
                         <p className="text-sm font-bold text-white whitespace-nowrap">
                           {convertPrice(selectedProducts[0].price, selectedCurrency)}
                         </p>
                       </div>
                     </div>
                     <button
                       onClick={() => handleProductSelect(selectedProducts[0])}
                       className="text-white/70 hover:text-red-300 transition-colors flex-shrink-0 text-lg font-bold"
                     >
                       ✕
                     </button>
                   </div>
                   {productDetails[selectedProducts[0]._id]?.safetyScore && complete_onboarding === 1 && (
                     <div className="mt-2 text-xs text-white/80">
                       <span className="font-semibold">Safety Score: </span>
                       <span className="font-bold text-white">
                         {Math.round(productDetails[selectedProducts[0]._id].safetyScore.score)}%
                       </span>
                     </div>
                   )}
                 </div>
               )}

               {/* LEVEL 3: Second Selected Product OR Product List */}
               {selectedProducts.length >= 2 ? (
                 <div className="p-4 rounded-lg bg-white/25 border-2 border-white/60 backdrop-blur-sm hover:bg-white/30 transition-all">
                   <div className="flex justify-between items-start gap-3 mb-2">
                     <div className="flex-1 min-w-0">
                       <p className="font-semibold text-sm text-white truncate">
                         {selectedProducts[1].productName}
                       </p>
                       <div className="flex items-center gap-3 mt-2">
                         <div className="w-12 h-0.5 bg-white/50"></div>
                         <p className="text-sm font-bold text-white whitespace-nowrap">
                           {convertPrice(selectedProducts[1].price, selectedCurrency)}
                         </p>
                       </div>
                     </div>
                     <button
                       onClick={() => handleProductSelect(selectedProducts[1])}
                       className="text-white/70 hover:text-red-300 transition-colors flex-shrink-0 text-lg font-bold"
                     >
                       ✕
                     </button>
                   </div>
                   {productDetails[selectedProducts[1]._id]?.safetyScore && complete_onboarding === 1 && (
                     <div className="mt-2 text-xs text-white/80">
                       <span className="font-semibold">Safety Score: </span>
                       <span className="font-bold text-white">
                         {Math.round(productDetails[selectedProducts[1]._id].safetyScore.score)}%
                       </span>
                     </div>
                   )}
                 </div>
               ) : (
                 selectedProducts.length < 2 && (
                   <div className="space-y-2 p-4 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm h-3/4 overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10">
                      {loading ? (
                        <div className="text-center py-4">
                          <p className="text-xs text-white/80 font-semibold">Loading products...</p>
                        </div>
                     ) : filteredProducts.length === 0 ? (
                       <div className="text-center py-6">
                         <p className="text-sm text-white/70">No products found</p>
                       </div>
                     ) : (
                       filteredProducts.map(product => (
                         <button
                           key={product._id}
                           onClick={() => handleProductSelect(product)}
                           disabled={loadingDetails || (selectedProducts.length === 3 && !isProductSelected(product._id))}
                           className={`w-full text-left p-3 rounded-lg transition-all border-2 backdrop-blur-sm ${
                             isProductSelected(product._id)
                               ? 'bg-white/30 border-white/80 cursor-default'
                               : 'bg-white/10 border-white/20 hover:border-white/50 hover:bg-white/20'
                           } ${selectedProducts.length === 3 && !isProductSelected(product._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                           <div className="flex justify-between items-start gap-2">
                             <div className="flex-1 min-w-0">
                               <p className="font-semibold text-sm text-white truncate">
                                 {product.productName}
                               </p>
                               <div className="flex items-center gap-3 mt-2">
                                 <div className="w-10 h-0.5 bg-white/50"></div>
                                 <p className="text-sm font-bold text-white whitespace-nowrap">
                                   {convertPrice(product.price, selectedCurrency)}
                                 </p>
                               </div>
                             </div>
                             {isProductSelected(product._id) && (
                               <div className="text-xs bg-white/60 text-custom-charcoal px-2 py-1 rounded font-bold flex-shrink-0">
                                 ✓
                               </div>
                             )}
                           </div>
                         </button>
                      ))
                    )}
                    {/* Loading More Indicator */}
                    {loadingMore && (
                      <div className="mt-2 p-3 rounded-lg bg-white/15 border border-white/20 text-center">
                        <p className="text-xs text-white/70 font-semibold">Loading more products...</p>
                      </div>
                    )}
                    {/* Observer target for infinite scroll */}
                    <div ref={observerTarget} className="py-4" />
                    {/* End of products message */}
                    {!hasMoreProducts && (
                      <div className="mt-2 p-3 rounded-lg bg-white/15 border border-white/20 text-center">
                        <p className="text-xs text-white/70 font-semibold">
                          End of available products
                        </p>
                      </div>
                    )}
                  </div>
                 )
               )}

               {/* LEVEL 4: Third Selected Product */}
               {selectedProducts.length >= 3 && (
                 <div className="p-4 rounded-lg bg-white/25 border-2 border-white/60 backdrop-blur-sm hover:bg-white/30 transition-all">
                   <div className="flex justify-between items-start gap-3 mb-2">
                     <div className="flex-1 min-w-0">
                       <p className="font-semibold text-sm text-white truncate">
                         {selectedProducts[2].productName}
                       </p>
                       <div className="flex items-center gap-3 mt-2">
                         <div className="w-12 h-0.5 bg-white/50"></div>
                         <p className="text-sm font-bold text-white whitespace-nowrap">
                           {convertPrice(selectedProducts[2].price, selectedCurrency)}
                         </p>
                       </div>
                     </div>
                     <button
                       onClick={() => handleProductSelect(selectedProducts[2])}
                       className="text-white/70 hover:text-red-300 transition-colors flex-shrink-0 text-lg font-bold"
                     >
                       ✕
                     </button>
                   </div>
                   {productDetails[selectedProducts[2]._id]?.safetyScore && complete_onboarding === 1 && (
                     <div className="mt-2 text-xs text-white/80">
                       <span className="font-semibold">Safety Score: </span>
                       <span className="font-bold text-white">
                         {Math.round(productDetails[selectedProducts[2]._id].safetyScore.score)}%
                       </span>
                     </div>
                   )}
                 </div>
               )}

               {/* LEVEL 5: Product List */}
               {selectedProducts.length >= 2 && (
                 <div className="space-y-2 p-4 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm max-h-96 overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10">
                    {loading ? (
                      <div className="text-center py-4">
                        <p className="text-xs text-white/80 font-semibold">Loading products...</p>
                      </div>
                   ) : filteredProducts.length === 0 ? (
                     <div className="text-center py-4">
                       <p className="text-xs text-white/70">No products found</p>
                     </div>
                   ) : (
                     <>
                       {filteredProducts.map(product => (
                         <button
                           key={product._id}
                           onClick={() => handleProductSelect(product)}
                           disabled={loadingDetails || (selectedProducts.length === 3 && !isProductSelected(product._id))}
                           className={`w-full text-left p-3 rounded-lg transition-all border-2 backdrop-blur-sm ${
                             isProductSelected(product._id)
                               ? 'bg-white/30 border-white/80 cursor-default'
                               : 'bg-white/10 border-white/20 hover:border-white/50 hover:bg-white/20'
                           } ${selectedProducts.length === 3 && !isProductSelected(product._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                           <div className="flex justify-between items-start gap-2">
                             <div className="flex-1 min-w-0">
                               <p className="font-semibold text-sm text-white truncate">
                                 {product.productName}
                               </p>
                               <div className="flex items-center gap-3 mt-2">
                                 <div className="w-10 h-0.5 bg-white/50"></div>
                                 <p className="text-sm font-bold text-white whitespace-nowrap">
                                   {convertPrice(product.price, selectedCurrency)}
                                 </p>
                               </div>
                             </div>
                             {isProductSelected(product._id) && (
                               <div className="text-xs bg-white/60 text-custom-charcoal px-2 py-1 rounded font-bold flex-shrink-0">
                                 ✓
                               </div>
                             )}
                           </div>
                         </button>
                        ))}
                        {/* Loading More Indicator */}
                        {loadingMore && (
                          <div className="mt-2 p-3 rounded-lg bg-white/15 border border-white/20 text-center">
                            <p className="text-xs text-white/70 font-semibold">Loading more products...</p>
                          </div>
                        )}
                        {/* Observer target for infinite scroll */}
                        <div ref={observerTarget} className="py-4" />
                        {/* End of products message */}
                        {!hasMoreProducts && (
                          <div className="mt-2 p-3 rounded-lg bg-white/15 border border-white/20 text-center">
                            <p className="text-xs text-white/70 font-semibold">
                              End of available products
                            </p>
                          </div>
                        )}
                      </>
                    )}
                 </div>
               )}
             </div>
           </div>
         )}

         {/* ============ DESKTOP VIEW (Two Panels) ============ */}
         {!isMobile && (
           <div className="relative z-10 h-full pt-24 pb-8 px-4">
             {/* Header */}
             <div className="text-center mb-6 max-w-2xl mx-auto">
               <h1 className="text-3xl font-bold text-white mb-2">
                 Compare Products
               </h1>
               <p className="text-sm text-white/80">
                 Select up to 3 products to compare side-by-side. View ingredients, safety scores, and allergen warnings.
               </p>
             </div>

             {/* Error Message */}
             {error && (
               <div className="mb-4 max-w-6xl mx-auto">
                 <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 backdrop-blur-sm text-sm">
                   {error}
                 </div>
               </div>
             )}

             {/* Two Panel Layout */}
             <div className="h-[calc(100%-180px)] mx-auto max-w-6xl flex gap-4">
               
               {/* LEFT PANEL: Product Selection */}
               <div className="w-1/3 flex flex-col bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm p-4 overflow-hidden">
                 {/* Search Bar */}
                 <div className="mb-4 flex-shrink-0">
                   <input
                     type="text"
                     placeholder="Search products..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/90 backdrop-blur text-custom-charcoal placeholder:text-custom-dark-gray focus:outline-none focus:border-white transition-all text-sm"
                   />
                 </div>

                  {/* Product List - Scrollable */}
                  <div className="flex-1 overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10 space-y-2 pr-2">
                    {loading ? (
                      <div className="text-center py-8">
                        <p className="text-xs text-white/80 font-semibold">Loading products...</p>
                      </div>
                   ) : filteredProducts.length === 0 ? (
                     <div className="text-center py-6">
                       <p className="text-sm text-white/70">No products found</p>
                     </div>
                   ) : (
                     filteredProducts.map(product => (
                       <button
                         key={product._id}
                         onClick={() => handleProductSelect(product)}
                         disabled={loadingDetails || (selectedProducts.length === 3 && !isProductSelected(product._id))}
                         className={`w-full text-left p-3 rounded-lg transition-all border-2 backdrop-blur-sm ${
                           isProductSelected(product._id)
                             ? 'bg-white/30 border-white/80 cursor-default'
                             : 'bg-white/10 border-white/20 hover:border-white/50 hover:bg-white/20'
                         } ${selectedProducts.length === 3 && !isProductSelected(product._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                       >
                         <div className="flex justify-between items-start gap-2">
                           <div className="flex-1 min-w-0">
                             <p className="font-semibold text-sm text-white truncate">
                               {product.productName}
                             </p>
                             <div className="flex items-center gap-3 mt-2">
                               <div className="w-8 h-0.5 bg-white/50"></div>
                               <p className="text-xs font-bold text-white whitespace-nowrap">
                                 {convertPrice(product.price, selectedCurrency)}
                               </p>
                             </div>
                           </div>
                           {isProductSelected(product._id) && (
                             <div className="text-xs bg-white/60 text-custom-charcoal px-2 py-1 rounded font-bold flex-shrink-0">
                               ✓
                             </div>
                           )}
                         </div>
                       </button>
                     ))
                   )}
                 </div>
               </div>

                {/* RIGHT PANEL: Comparison View */}
                <div className="w-2/3 flex flex-col bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm p-4 overflow-hidden">
                  {selectedProducts.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-3/4 h-3/4 rounded-lg border-2 border-white/30 overflow-hidden">
                          <img 
                            src="/Product.png" 
                            alt="Product placeholder" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-lg text-white font-semibold mb-2">
                            No Products Selected
                          </p>
                          <p className="text-white/80 text-sm">
                            Select products from the left to compare them
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                   <div className="flex-1 overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10 pr-2">
                     <div className="space-y-4">
                       {selectedProducts.map(product => {
                         const details = productDetails[product._id];
                         return (
                           <div key={product._id} className="p-4 rounded-lg bg-white/25 border-2 border-white/60 backdrop-blur-sm hover:bg-white/30 transition-all">
                             <div className="flex justify-between items-start gap-3 mb-3">
                               <div className="flex-1 min-w-0">
                                 <p className="font-semibold text-sm text-white truncate">
                                   {product.productName}
                                 </p>
                                 <p className="text-xs text-white/70 mt-1">
                                   {product.productType}
                                 </p>
                                 <div className="flex items-center gap-3 mt-2">
                                   <div className="w-12 h-0.5 bg-white/50"></div>
                                   <p className="text-sm font-bold text-white whitespace-nowrap">
                                     {convertPrice(product.price, selectedCurrency)}
                                   </p>
                                 </div>
                               </div>
                               <button
                                 onClick={() => handleProductSelect(product)}
                                 className="text-white/70 hover:text-red-300 transition-colors flex-shrink-0 text-lg font-bold"
                               >
                                 ✕
                               </button>
                             </div>

                             {/* Safety Score */}
                             {details?.safetyScore && complete_onboarding === 1 && (
                               <div className="mt-3 pt-3 border-t border-white/20">
                                 <div className="flex justify-between items-center">
                                   <span className="text-xs text-white/70">Safety Score:</span>
                                   <div className="flex items-center gap-2">
                                     <div className="w-20 bg-white/20 rounded-full h-1.5">
                                       <div
                                         className={`h-1.5 rounded-full transition-all ${
                                           details.safetyScore.score >= 75
                                             ? 'bg-green-400'
                                             : details.safetyScore.score >= 50
                                             ? 'bg-yellow-400'
                                             : 'bg-red-400'
                                         }`}
                                         style={{
                                           width: `${details.safetyScore.score}%`
                                         }}
                                       ></div>
                                     </div>
                                     <span className="font-bold text-white text-xs">
                                       {Math.round(details.safetyScore.score)}%
                                     </span>
                                   </div>
                                 </div>
                               </div>
                             )}

                             
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 )}
               </div>
             </div>
           </div>
         )}
       </div>
     </>
   );
}
