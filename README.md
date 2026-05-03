# 🧴 Skinshy - Personalized Skincare Safety Platform
<<<<<<< HEAD
**Skinshy** is an intelligent skincare product evaluation platform that helps users find safe and suitable skincare products based on their skin type, concerns, and ingredient preferences. Our platform uses AI-powered safety scoring to analyze product ingredients and match them with personalized user profiles.
---
## 🎯 Features
=======

**Skinshy** is an intelligent skincare product evaluation platform that helps users find safe and suitable skincare products based on their skin type, concerns, and ingredient preferences. Our platform uses AI-powered safety scoring to analyze product ingredients and match them with personalized user profiles.

---

## 🎯 Features

>>>>>>> 2ac3d256 (.)
### 🔍 **Product Discovery**
- Browse a curated database of skincare products
- Advanced search and filtering by product type
- Infinite scroll pagination for seamless browsing
- Real-time product filtering
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### 🛡️ **Safety Scoring System**
- Personalized safety scores based on user skin profile
- Ingredient analysis against harmful substances
- Customizable safety thresholds
- Detailed breakdown of product safety metrics
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### 👤 **User Personalization**
- Comprehensive onboarding questionnaire
- Skin type and concern assessment
- Ingredient preference management
- Safe and unsafe ingredient tracking
- User profile management
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### 💱 **Multi-Currency Support**
- Real-time currency conversion
- Support for multiple global currencies
- Localized pricing display
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### 🔐 **Secure Authentication**
- Integration with Clerk for secure authentication
- OAuth social login support
- Protected routes and user data encryption
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### 📊 **Product Comparison**
- Side-by-side ingredient comparison
- Safety score comparison
- Ingredient glossary and information
<<<<<<< HEAD
---
## 🛠️ Tech Stack
=======

---

## 🛠️ Tech Stack

>>>>>>> 2ac3d256 (.)
### **Frontend**
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **Clerk** - Authentication
- **Vercel** - Deployment
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### **Backend**
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Clerk Backend** - User management
- **Render** - Deployment
<<<<<<< HEAD
---
## 🚀 Getting Started
=======

---

## 🚀 Getting Started

>>>>>>> 2ac3d256 (.)
### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB
- Clerk account
<<<<<<< HEAD
### Installation
=======

### Installation

>>>>>>> 2ac3d256 (.)
#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/skinshy.git
cd Skinshy
```
<<<<<<< HEAD
#### 2. Backend Setup
```bash
cd Backend
# Install dependencies
npm install
=======

#### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

>>>>>>> 2ac3d256 (.)
# Create .env file
cat > .env << EOF
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
NODE_ENV=development
EOF
<<<<<<< HEAD
# Start backend
npm start
```
The backend will run on `http://localhost:5000`
#### 3. Frontend Setup
```bash
cd ../Frontend
# Install dependencies
npm install
=======

# Start backend
npm start
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd ../Frontend

# Install dependencies
npm install

>>>>>>> 2ac3d256 (.)
# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EOF
<<<<<<< HEAD
# Start frontend
npm start
```
The frontend will run on `http://localhost:3000`
=======

# Start frontend
npm start
```

The frontend will run on `http://localhost:3000`

>>>>>>> 2ac3d256 (.)
#### 4. Quick Start Script
Alternatively, use the provided startup script:
```bash
bash START.sh
```
<<<<<<< HEAD
---
## 📁 Project Structure
=======

---

## 📁 Project Structure

>>>>>>> 2ac3d256 (.)
```
Skinshy/
├── Backend/
│   ├── src/
│   │   ├── server.js                 # Express server setup
│   │   ├── middleware/
│   │   │   └── auth.js              # Authentication middleware
│   │   ├── routes/
│   │   │   ├── products.js          # Product API routes
│   │   │   ├── users.js             # User management routes
│   │   │   └── safety.js            # Safety scoring routes
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Product.js           # Product schema
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   └── utils/
│   │       ├── safetyCalculator.js  # Safety score logic
│   │       ├── dataLoader.js        # Product data loading
│   │       └── topIngredientCategories.json
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main app component
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SearchPage.jsx       # Product search
│   │   │   ├── ProductPage.jsx      # Product details
│   │   │   ├── ProfilePage.jsx      # User profile
│   │   │   ├── OnboardingPage.jsx   # User onboarding
│   │   │   └── ProductComparePage.jsx
│   │   ├── components/
│   │   │   ├── Common/
│   │   │   ├── Skeletons/           # Loading skeletons
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── context/
│   │   │   ├── UserContext.js
│   │   │   ├── CurrencyContext.js
│   │   │   └── OnboardingContext.js
│   │   └── utils/
│   │       ├── currencyConverter.js
│   │       └── validators.js
│   └── package.json
│
└── README.md
```
<<<<<<< HEAD
---
## 🔌 API Documentation
### Authentication
All endpoints (except `/health` and `/api/safety/test`) require Clerk authentication via Bearer token.
### Products API
=======

---

## 🔌 API Documentation

### Authentication
All endpoints (except `/health` and `/api/safety/test`) require Clerk authentication via Bearer token.

### Products API

>>>>>>> 2ac3d256 (.)
**GET** `/api/products` - Get all products with pagination
```bash
GET /api/products?skip=0&limit=100&search=moisturizer&type=cream
```
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
**GET** `/api/products/:id` - Get specific product details
```bash
GET /api/products/60d5ec49f1b2c72b8c8e4a1b
```
<<<<<<< HEAD
### Safety API
=======

### Safety API

>>>>>>> 2ac3d256 (.)
**POST** `/api/safety/calculate` - Calculate safety score for a product
```json
{
  "productId": "60d5ec49f1b2c72b8c8e4a1b"
}
```
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
**GET** `/api/safety/ingredients` - Get ingredient information
```bash
GET /api/safety/ingredients?ingredient=retinol
```
<<<<<<< HEAD
### Users API
=======

### Users API

>>>>>>> 2ac3d256 (.)
**GET** `/api/users/profile` - Get user profile
```bash
GET /api/users/profile
```
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
**PUT** `/api/users/profile` - Update user profile
```json
{
  "skinType": "oily",
  "concerns": ["acne", "sensitivity"],
  "unsafeIngredients": ["sulfates"]
}
```
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
**POST** `/api/users/onboarding` - Complete user onboarding
```json
{
  "skinType": "combination",
  "concerns": ["dryness", "sensitivity"],
  "allergies": ["essential oils"]
}
```
<<<<<<< HEAD
---
## 🔒 Environment Variables
=======

---

## 🔒 Environment Variables

>>>>>>> 2ac3d256 (.)
### Backend (.env)
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/skinshy
CLERK_SECRET_KEY=sk_test_xxxxx
NODE_ENV=development
```
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```
<<<<<<< HEAD
---
## 🌐 Production Deployment
=======

---

## 🌐 Production Deployment

>>>>>>> 2ac3d256 (.)
### Deploy Backend to Render
1. Push Backend code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables:
   ```env
   FRONTEND_URL=https://your-frontend-domain.com
   MONGODB_URI=your_production_mongodb_uri
   CLERK_SECRET_KEY=sk_live_xxxxx
   NODE_ENV=production
   ```
5. Deploy
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### Deploy Frontend to Vercel
1. Push Frontend code to GitHub
2. Import project to Vercel
3. Set environment variables:
   ```env
   REACT_APP_API_URL=https://your-render-backend.onrender.com/api
   REACT_APP_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
   ```
4. Deploy
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### CORS Configuration
Ensure your backend `.env` includes the correct `FRONTEND_URL`:
```env
FRONTEND_URL=https://your-vercel-domain.com
```
<<<<<<< HEAD
---
## 🧪 Testing
=======

---

## 🧪 Testing

>>>>>>> 2ac3d256 (.)
### Backend Health Check
```bash
curl http://localhost:5000/health
```
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### Safety Score Test
```bash
curl http://localhost:5000/api/safety/test
```
<<<<<<< HEAD
---
## 🔧 Common Issues & Solutions
=======

---

## 🔧 Common Issues & Solutions

>>>>>>> 2ac3d256 (.)
### CORS Error
**Issue:** Cross-Origin Request Blocked
- **Solution:** Ensure `FRONTEND_URL` in backend `.env` matches your frontend domain
- Verify `credentials: true` is set in axios configuration
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### Cookie Domain Error
**Issue:** `__clerk_test_etld` has been rejected
- **Solution:** 
  - Use production Clerk keys for production deployments
  - Add your domain to Clerk Allowed Origins in dashboard
  - Ensure proper domain configuration for cookies
<<<<<<< HEAD
=======

>>>>>>> 2ac3d256 (.)
### Network Error Fetching Products
**Issue:** TypeError: NetworkError when attempting to fetch resource
- **Solution:**
  - Check API_URL is correctly configured
  - Verify backend is running and accessible
  - Check CORS headers in backend
<<<<<<< HEAD
---
## 📱 User Flow
=======

---

## 📱 User Flow

>>>>>>> 2ac3d256 (.)
1. **Landing Page** → User views platform information
2. **Authentication** → Sign up/Login with Clerk
3. **Onboarding** → Complete skin profile questionnaire
4. **Search** → Browse and search for skincare products
5. **Product Details** → View safety score and ingredients
6. **Comparison** → Compare multiple products
7. **Profile** → Manage preferences and settings
<<<<<<< HEAD
---
## 🤝 Contributing
Contributions are welcome! Please follow these steps:
=======

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

>>>>>>> 2ac3d256 (.)
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
<<<<<<< HEAD
---
## 📝 License
This project is licensed under the ISC License - see the LICENSE file for details.
---
## 📞 Support
=======

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 📞 Support

>>>>>>> 2ac3d256 (.)
For issues and feature requests, please:
- Open an issue on GitHub
- Check existing documentation
- Review API documentation above
<<<<<<< HEAD
---
## 🙏 Acknowledgments
=======

---

## 🙏 Acknowledgments

>>>>>>> 2ac3d256 (.)
- Clerk for secure authentication
- MongoDB Atlas for database hosting
- Render for backend deployment
- Vercel for frontend deployment
- Tailwind CSS for styling framework
<<<<<<< HEAD
---
## 📊 Current Deployment
- **Frontend:** https://skinshy.vercel.app
- **Backend:** https://skinshy.onrender.com
- **Database:** MongoDB Atlas
---
=======

---

## 📊 Current Deployment

- **Frontend:** https://skinshy.vercel.app
- **Backend:** https://skinshy.onrender.com
- **Database:** MongoDB Atlas

---

>>>>>>> 2ac3d256 (.)
**Made with ❤️ for healthier skincare choices**
