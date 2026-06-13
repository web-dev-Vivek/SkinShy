import React from 'react';
import { ChevronRight, Search, Zap, Shield, Eye } from 'lucide-react';

function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-custom-white to-custom-light-gray/30 pt-24">
      <div className="container-custom max-w-4xl">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-custom-charcoal mb-4">
            How to Use Skinshy
          </h1>
          <p className="text-lg text-custom-dark-gray max-w-2xl">
            Welcome to Skinshy! Learn how to discover skincare products that work best for your skin type and concerns.
          </p>
        </div>

        {/* Getting Started Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal mb-8">
            Getting Started
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="bg-custom-white rounded-xl p-8 shadow-sm border border-custom-light-gray hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-custom-charcoal/10 text-custom-charcoal font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-custom-charcoal mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-custom-dark-gray mb-3">
                    During onboarding, tell us about your skin type, concerns, and preferences. This helps us recommend products tailored to your needs.
                  </p>
                  <p className="text-sm text-custom-dark-gray/70">
                    Your profile information is kept private and secure.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-custom-white rounded-xl p-8 shadow-sm border border-custom-light-gray hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-custom-charcoal/10 text-custom-charcoal font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-custom-charcoal mb-2">
                    Browse Products
                  </h3>
                  <p className="text-custom-dark-gray mb-3">
                    Head to the Browse section to explore skincare products matched to your profile. Filter by category, price, and brand.
                  </p>
                  <p className="text-sm text-custom-dark-gray/70">
                    Use search to find specific products or ingredients.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-custom-white rounded-xl p-8 shadow-sm border border-custom-light-gray hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-custom-charcoal/10 text-custom-charcoal font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-custom-charcoal mb-2">
                    Check Safety Ratings
                  </h3>
                  <p className="text-custom-dark-gray mb-3">
                    Each product displays a safety rating based on ingredient analysis. Check the safety bar to understand potential concerns.
                  </p>
                  <p className="text-sm text-custom-dark-gray/70">
                    Read ingredient details to make informed choices.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-custom-white rounded-xl p-8 shadow-sm border border-custom-light-gray hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-custom-charcoal/10 text-custom-charcoal font-bold text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-custom-charcoal mb-2">
                    Compare Ingredients
                  </h3>
                  <p className="text-custom-dark-gray mb-3">
                    Use the Compare section to view detailed information about skincare ingredients and their effects.
                  </p>
                  <p className="text-sm text-custom-dark-gray/70">
                    Learn about benefits, concerns, and which ingredients work best together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal mb-8">
            Key Features
          </h2>

          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="bg-custom-white rounded-lg p-6 border border-custom-light-gray hover:border-custom-charcoal/30 transition-colors flex items-start gap-4">
              <Search className="w-6 h-6 text-custom-charcoal flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-custom-charcoal mb-2">
                  Smart Product Search
                </h3>
                <p className="text-custom-dark-gray">
                  Find skincare products that match your skin type and concerns. Filter by category, price range, and brand to narrow down options.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-custom-white rounded-lg p-6 border border-custom-light-gray hover:border-custom-charcoal/30 transition-colors flex items-start gap-4">
              <Shield className="w-6 h-6 text-custom-charcoal flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-custom-charcoal mb-2">
                  Safety Analysis
                </h3>
                <p className="text-custom-dark-gray">
                  Our AI-powered safety bar analyzes product ingredients to identify potential irritants and concerns based on your skin profile.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-custom-white rounded-lg p-6 border border-custom-light-gray hover:border-custom-charcoal/30 transition-colors flex items-start gap-4">
              <Eye className="w-6 h-6 text-custom-charcoal flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-custom-charcoal mb-2">
                  Ingredient Glossary
                </h3>
                <p className="text-custom-dark-gray">
                  Access a comprehensive database of skincare ingredients. Learn about their benefits, potential side effects, and compatibility with different skin types.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-custom-white rounded-lg p-6 border border-custom-light-gray hover:border-custom-charcoal/30 transition-colors flex items-start gap-4">
              <Zap className="w-6 h-6 text-custom-charcoal flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-custom-charcoal mb-2">
                  Personalized Recommendations
                </h3>
                <p className="text-custom-dark-gray">
                  Get product suggestions tailored to your specific skin profile. Our algorithm considers your skin type, concerns, and preferences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips & Best Practices */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal mb-8">
            Tips & Best Practices
          </h2>

          <div className="bg-gradient-to-br from-custom-charcoal/5 to-custom-charcoal/10 rounded-xl p-8 border border-custom-charcoal/10">
            <ul className="space-y-4">
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-custom-charcoal flex-shrink-0 mt-0.5" />
                <span className="text-custom-dark-gray">
                  <strong>Update Your Profile:</strong> Keep your skin information up-to-date for better recommendations as your skin changes.
                </span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-custom-charcoal flex-shrink-0 mt-0.5" />
                <span className="text-custom-dark-gray">
                  <strong>Read Ingredient Lists:</strong> Always check ingredient details to avoid known irritants for your skin.
                </span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-custom-charcoal flex-shrink-0 mt-0.5" />
                <span className="text-custom-dark-gray">
                  <strong>Patch Test:</strong> Test new products on a small area first to ensure compatibility with your skin.
                </span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-custom-charcoal flex-shrink-0 mt-0.5" />
                <span className="text-custom-dark-gray">
                  <strong>Give Products Time:</strong> Most skincare products require 4-6 weeks of consistent use to show results.
                </span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-custom-charcoal flex-shrink-0 mt-0.5" />
                <span className="text-custom-dark-gray">
                  <strong>Use Filters Wisely:</strong> Take advantage of our filtering system to find products that match your needs.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="bg-custom-white rounded-lg p-6 border border-custom-light-gray">
              <h3 className="text-lg font-semibold text-custom-charcoal mb-2">
                How accurate is the safety rating?
              </h3>
              <p className="text-custom-dark-gray">
                Our safety ratings are based on comprehensive ingredient analysis and scientific research. However, individual skin reactions can vary. Always patch test new products and consult a dermatologist if you have specific concerns.
              </p>
            </div>

            <div className="bg-custom-white rounded-lg p-6 border border-custom-light-gray">
              <h3 className="text-lg font-semibold text-custom-charcoal mb-2">
                Can I edit my profile after onboarding?
              </h3>
              <p className="text-custom-dark-gray">
                Yes! You can update your profile at any time from your Profile page. Changes will immediately reflect in your product recommendations.
              </p>
            </div>

            <div className="bg-custom-white rounded-lg p-6 border border-custom-light-gray">
              <h3 className="text-lg font-semibold text-custom-charcoal mb-2">
                How do I find products within my budget?
              </h3>
              <p className="text-custom-dark-gray">
                Use the price filter on the Browse page to show only products within your desired price range. This helps you find suitable options without exceeding your budget.
              </p>
            </div>

            <div className="bg-custom-white rounded-lg p-6 border border-custom-light-gray">
              <h3 className="text-lg font-semibold text-custom-charcoal mb-2">
                What do the safety bar colors mean?
              </h3>
              <p className="text-custom-dark-gray">
                Green indicates a safe product for your skin type, yellow indicates some caution-worthy ingredients, and red indicates potential concerns. Always read the details for more information.
              </p>
            </div>

            <div className="bg-custom-white rounded-lg p-6 border border-custom-light-gray">
              <h3 className="text-lg font-semibold text-custom-charcoal mb-2">
                Is my personal data secure?
              </h3>
              <p className="text-custom-dark-gray">
                Absolutely. Your personal data and skin profile are encrypted and protected with industry-standard security measures. We never share your information with third parties.
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default GuidePage;
