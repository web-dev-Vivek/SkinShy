# Skinshy Codebase Issues & Fix Guide

Hey Vivek! Is file me maine saare issues ko simple aur easy language me explain kiya hai (along with Hinglish explanations), aur ab har issue ke niche **"How to Reproduce (Steps to test on screen)"** add kar diya hai taaki aap screen par clicks karke khud verify kar sakein ki ye bugs exist karte hain.

Let's break them down step-by-step!

---

## 1. Broken Allergen Matching Logic (Allergen Group Mismatch)
* **File Links**: 
  - [OnboardingPage.jsx](file:///home/vivek/Skinshy/Frontend/src/pages/OnboardingPage.jsx)
  - [ProfilePage.jsx](file:///home/vivek/Skinshy/Frontend/src/pages/ProfilePage.jsx)
  - [safetyCalculator.js](file:///home/vivek/Skinshy/Backend/src/utils/safetyCalculator.js)

### Hinglish Explanation:
> Onboarding page, Profile page aur humara backend database... teenon jagah allergen groups ki spelling alag-alag hai! 
> 
> * Onboarding me store ho raha hai lowercase plurals: `'fragrances'`, `'essential_oils'`.
> * Profile page me store ho raha hai capitalized strings: `'Fragrance'`, `'Essential Oils'`.
> * Database (`ingredient_database.json`) me internal IDs hain: `'fragrance'`, `'botanical_oil'`.
>
> Ab `safetyCalculator.js` directly check karta hai: 
> `userProfile.knownAllergies.includes(ingredient.allergenGroup)`
> 
> Ab aap hi batao, `['fragrances'].includes('fragrance')` to hamesha `false` hi hoga na! Is wajah se product safety score me allergen penalties lagayenge to wo check fail ho jayega, aur safety warnings completely broken hain.

### How to Reproduce & Verify:
1. App par signup/onboarding ke waqt **Allergies** me `"Fragrances"` aur `"Essential Oils"` ko select karke onboarding complete kijiye.
2. Ab koi aisa product search karke open kijiye jisme fragrance ya essential oils bhare hon (Example: **"AMELIORATE Transforming Body Lotion 200ml"**). Is product ke ingredients me *Fragrance (Parfum)* aur *Lavender Oil* wagera hote hain.
3. Check kijiye Product Page par **Safety Score / Risk Assessment** ko.
4. **Observation**: Aapko koi bhi allergen warning ya penalty score nahi dikhega, aur safety score normal se zyada safe dikhayega, jabki user ko isse allergy honi chahiye thi!

### How to Fix:
Aapko frontend aur backend ke beech allergen names ko match karna padega. Sabse aasan tareeqa hai `safetyCalculator.js` ke andar checking logic ko sanitize karna:

Add a mapping helper inside [safetyCalculator.js](file:///home/vivek/Skinshy/Backend/src/utils/safetyCalculator.js) before the allergen stage:

```javascript
// Mapping user allergy selection to database allergen groups
const allergyMap = {
  'fragrances': 'fragrance',
  'fragrance': 'fragrance',
  'essential_oils': 'botanical_oil',
  'essential oils': 'botanical_oil',
  'parabens': 'paraben',
  'paraben': 'paraben',
  'lanolin': 'wool_wax',
  // Add other mappings if needed
};

// Inside STAGE 2 Allergen Triggers:
product.ingredients.forEach(ingredient => {
  if (ingredient.knownAllergen && userProfile.knownAllergies) {
    // Map user allergy input to database format before comparison
    const userHasAllergy = userProfile.knownAllergies.some(userAllergy => {
      const dbAllergenGroup = allergyMap[userAllergy.toLowerCase()] || userAllergy.toLowerCase();
      return dbAllergenGroup === ingredient.allergenGroup;
    });

    if (userHasAllergy) {
       // Apply allergen penalty
    }
  }
});
```

---

## 2. Dropdown Navigation 404 (MongoDB CastError)
* **File Links**: 
  - [ProductDropdown.jsx](file:///home/vivek/Skinshy/Frontend/src/components/ProductDropdown.jsx)
  - [ProductPage.jsx](file:///home/vivek/Skinshy/Frontend/src/pages/ProductPage.jsx)
  - [products.js (Backend Routes)](file:///home/vivek/Skinshy/Backend/src/routes/products.js)

### Hinglish Explanation:
> Main Navbar ke "Products" dropdown me saare products local static JSON file (`products.json`) se load ho rahe hain. Is local file ke products me database ki unique `_id` field nahi hai.
> 
> Jab aap kisi product par click karte hain, to code use navigate kar deta hai product ke naam par: `/search/Cetaphil%20Moisturizing%20Cream`.
> 
> Ab [ProductPage.jsx](file:///home/vivek/Skinshy/Frontend/src/pages/ProductPage.jsx) is product name ko MongoDB ki ID samajh kar backend call karta hai: `/api/products/Cetaphil Moisturizing Cream`.
> Backend is string ko `Product.findById()` me bhejta hai, jisse database crash ho jata hai (`CastError: Cast to ObjectId failed`), aur user ko `404 Product Not Found` screen dikhata hai.

### How to Reproduce & Verify:
1. Home page ya search page par jaakar top navigation bar me **"Products"** dropdown menu par click kijiye.
2. Dropdown me se kisi bhi product (Example: **"The Ordinary Natural Moisturising Factors + HA 30ml"**) ko select kijiye.
3. Aapka router aapko `/search/The%20Ordinary%20Natural%20Moisturising...` url par le jayega.
4. **Observation**: Screen par immediately **"Failed to Load Product / Product not found"** error screen aa jayegi. Agar aap backend console me dekhenge, to wahan Mongoose ka error dikhayega: `Cast to ObjectId failed for value "The Ordinary..." at path "_id"`.

### How to Fix:
Dropdown ko static `products.json` file load karne ke bajaye backend API se dynamic search queries fetch karni chahiye:

Modify [ProductDropdown.jsx](file:///home/vivek/Skinshy/Frontend/src/components/ProductDropdown.jsx):
1. Remove `import { getAllProducts } from '../services/productsJSON';`
2. Fetch results from backend autocomplete search using your existing backend services:

```javascript
import { searchProducts } from '../services/products';

// ... inside fetchProducts or handleSearch:
const handleSearchChange = async (e) => {
  const query = e.target.value;
  setSearchQuery(query);
  if (query.trim().length > 1) {
    setLoading(true);
    try {
      const response = await searchProducts(query);
      setProducts(response.data || []); // These will contain proper MongoDB _id!
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
};
```
3. Update the click navigation inside dropdown to use the unique `_id`:
```javascript
const handleProductClick = (product) => {
  navigate(`/search/${product._id}`); // Correct navigation using database ID
  setIsOpen(false);
};
```

---

## 3. Redundant API Path `/products/api/types`
* **File Links**: 
  - [products.js (Backend Routes)](file:///home/vivek/Skinshy/Backend/src/routes/products.js)
  - [products.js (Frontend Service)](file:///home/vivek/Skinshy/Frontend/src/services/products.js)

### Hinglish Explanation:
> Backend server me humara routes configuration `/api/products` par set hai.
> Par backend route file (`Backend/src/routes/products.js`) me endpoint ka naam galti se `/api/types` rakh diya. 
> Iski wajah se pure path ban gaya `/api/products/api/types` (do-do baar `/api`). 
> 
> Phir is mistake ko backend me theek karne ke bajaye, frontend code me call karne ke liye `/products/api/types` use kiya gaya. Ye bad practice hai.

### How to Reproduce & Verify:
1. Terminal open kijiye (ya Postman/browser tab).
2. Backend API url par hit kijiye standard route check karne ke liye: `curl http://localhost:5000/api/products/types`.
3. **Observation**: Ye call fail ho jayegi with `{"error": "Route not found"}`.
4. Ab hit kijiye: `curl http://localhost:5000/api/products/api/types`.
5. **Observation**: Ye call success ho jayegi aur saare types ka JSON data return karegi. Isse confirm hota hai ki route me redundant `/api` segment ghusa hua hai.

### How to Fix:
* **Backend [products.js](file:///home/vivek/Skinshy/Backend/src/routes/products.js)**:
  Change the endpoint name:
  ```javascript
  // Change line 145:
  router.get('/types', asyncHandler(async (req, res) => { ... }));
  ```
* **Frontend [products.js](file:///home/vivek/Skinshy/Frontend/src/services/products.js)**:
  Update path call:
  ```javascript
  // Change line 26:
  const response = await api.get('/products/types');
  ```

---

## 4. Flawed Ingredient Splitting in Data Loader
* **File Link**: 
  - [dataLoader.js](file:///home/vivek/Skinshy/Backend/src/utils/dataLoader.js)

### Hinglish Explanation:
> Agar kisi product ke ingredients array format me na hokar ek long comma/period split string me aate hain, to humara database loader (`dataLoader.js`) use correctly split to kar deta hai.
> 
> Par dikkat ye hai ki split karne ke baad loop me wo sabhi split ingredients par pehle wale original block ki classification detail copy kar deta hai. 
> Matlab `Aqua`, `Glycerin`, `Retinol` sabhi ke parameters aur category values exact same ho jayengi! Isse safety score calculator product safety report calculate karte samay bilkul galat penalties lagayega.

### How to Reproduce & Verify:
1. MongoDB client (like Compass or terminal shell) open kijiye.
2. Ye query run kijiye us product ko check karne ke liye jisme concatenated string split hui thi:
   `db.products.find({ productName: /Avène Rich/ })`
3. **Observation**: Aap dekhenge ki us product ke `ingredients` array me jitne bhi split ingredients hain (Water, Shea Butter, etc.), sabhi ka `reactivityScore`, `ingredientClass`, aur `knownAllergen` bilkul identical hain (jo ki pehle ingredient index se copy ho gaye)! Sabka behavior same ho gaya hai, jo ki real life me galat hai.

### How to Fix:
During raw product ingestion, lookup each parsed ingredient name in the database lookup dictionary to extract correct properties instead of copying `ingredients[0]` properties.

---

<!-- ## 5. Unused and Buggy `UserContext.jsx`
* **File Link**: 
  - [UserContext.jsx](file:///home/vivek/Skinshy/Frontend/src/context/UserContext.jsx)

### Hinglish Explanation:
> Ye file project me completely unused (dead code) padi hui hai, hum iski jagah Clerk Auth standard system use kar rahe hain. 
> 
> Aur is context ke andar to coding ki dher saari galtiyan hain. Jaise:
> `const token = getToken();`
> Kyunki `getToken` ek async function hai aur use bina `await` ke call kiya hai, wo hamesha ek Promise Object return karega jo Javascript me **truthy** hota hai. To check `if (token)` hamesha `true` pass ho jata hai. Aur `verifyToken()` bina argument ke `false` de deta hai, aur login status verify huye bina hi `isAuthenticated(true)` ho jata hai.

### How to Reproduce & Verify:
1. Browser me app open kijiye aur developer tools console (**F12 -> Console**) open kijiye.
2. Page reload/navigate karne par logs check kijiye.
3. **Observation**: Aapko context render logs jaise `OnboardingContext Provider - complete_signup: ...` dikhai denge, lekin agar aap search karenge `import { useUser } from './context/UserContext'`, to poore project me ek bhi component ise import nahi kar raha hoga, ye fuzool chal raha hai.

### How to Fix:
* Is file [UserContext.jsx](file:///home/vivek/Skinshy/Frontend/src/context/UserContext.jsx) ko simply **delete** kar do taaki koi confusion na ho.
* [App.jsx](file:///home/vivek/Skinshy/Frontend/src/App.jsx) se `UserProvider` import aur wrapping tags remove kar do. -->

---
<!-- 
## 6. Startup Script Process Leakage
* **File Link**: 
  - [START.sh](file:///home/vivek/Skinshy/START.sh)

### Hinglish Explanation:
> Jab aap bash command terminal par `Ctrl+C` press karte ho, to `START.sh` execute hona band ho jata hai. 
> Lekin jo backend node servers aur react development servers background me `&` operator se start huye the, wo background me chalu hi reh jaate hain! 
> Iski wajah se ports 3000 aur 5000 busy ho jate hain aur agli baar start karne par `EADDRINUSE` ports lock errors aane lagti hain.

### How to Reproduce & Verify:
1. Terminal me `./START.sh` run karke app start kijiye.
2. Jab backend aur frontend chalu ho jayein, to terminal me `Ctrl + C` press kijiye. Terminal control wapas mil jayega aur lagega ki app band ho gayi.
3. Ab check kijiye: `lsof -i :3000` aur `lsof -i :5000`.
4. **Observation**: Output me abhi bhi Node processes running state me ports busy rakh kar baithe honge! Aap browser me abhi bhi page open kar payenge, jo ki confirm karta hai ki servers sahi se kill nahi huye.

### How to Fix:
Bash script ke top par ek simple `trap` command lagayein jo process abort hone par background processes ko automatic terminate kar de:

Modify [START.sh](file:///home/vivek/Skinshy/START.sh):

```bash
#!/bin/bash

# Terminate background jobs when script terminates (Ctrl+C or Exit)
trap 'echo "Stopping Skinshy Servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' SIGINT SIGTERM EXIT

# ... rest of the file
``` -->

---
<!-- 
## 7. Absolute Paths in Python Transform Script
* **File Link**: 
  - [transform_ingredients.py](file:///home/vivek/Skinshy/transform_ingredients.py)

### Hinglish Explanation:
> Script ke andar paths `/home/vivek/Skinshy/Products_ingrediant.json` jaise absolute paths hardcoded hain.
> Agar ye code main apne server pe, ya aap kisi doosre system pe chalayenge to ye immediate fail ho jayega kyunki wahan user path `/home/vivek` nahi hoga.

### How to Reproduce & Verify:
1. Apne terminal me check kijiye ki aap `/home/vivek/Skinshy` ke aalawa kisi directory path me script copy karke execute karein.
2. Ya simple validation ke liye: Terminal me `python3 transform_ingredients.py` ko run kijiye temporary location change karke.
3. **Observation**: Script crash ho jayegi with `FileNotFoundError: [Errno 2] No such file or directory: '/home/vivek/Skinshy/ingredient_database.json'` agar absolute environment match nahi kiya.

### How to Fix:
Change lines to use relative directory paths:

```python
import os

# Get directory where the script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load database using dynamic absolute path
with open(os.path.join(BASE_DIR, 'ingredient_database.json'), 'r') as f:
    ingredient_db = json.load(f)['ingredients']
    
# Do the same for Products_ingrediant.json and output path
``` -->

---
<!-- 
## 8. Misleading Variable Types & Minor Typo Formatting
* **File Link**: 
  - [currencyConverter.js](file:///home/vivek/Skinshy/Frontend/src/utils/currencyConverter.js)

### Hinglish Explanation:
> `currencyConverter.js` me line number 149 par likha hai:
> `const inrPrice = (numericValue * CURRENCY_RATES.INR).toFixed(2);`
> Yahaan `.toFixed(2)` karne par `inrPrice` ek **String** ban jata hai (e.g., `"1345.50"`).
> 
> Aur uske baad line 151 par likha hai: 
> `inrPrice.toLocaleString('en-IN')`
> String variable par `.toLocaleString()` chalane par currency formats convert nahi hote (wo simple string hi reh jati hai). Ye function sirf **Numbers** par kaam karta hai.

### How to Reproduce & Verify:
1. Product comparison page (`/product_Comparasion`) open kijiye ya dynamic card prices dekhye.
2. Select currency me **INR (₹)** choose kijiye.
3. Kisi aise product ka price check kijiye jo ₹1000 se upar ho (Example: original price in GBP is £13.00, converted to INR it becomes approx ₹1,430).
4. **Observation**: UI par prices ₹1430 standard unformatted string dikhayenge, jabki readable formatting `₹1,430.00` honi chahiye thi (commas missing honge because `toLocaleString` string par fail ho gaya).

### How to Fix:
Phle dynamic calculation karein, format use karein fir parse convert karein:

```javascript
export function convertEURtoINRWithDecimals(priceStr) {
  if (!priceStr) return '₹0.00';

  const numericValue = parseFloat(priceStr.replace(/[£€$,]/g, ''));
  if (isNaN(numericValue)) return '₹0.00';

  const inrPrice = numericValue * CURRENCY_RATES.INR;

  // correct toLocaleString parameters formatting
  return `₹${inrPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
``` -->

---

Best of luck Vivek! In steps ko try karke verify kijiye, and jab ready ho to mujhe bataiye — hum in bugs ko turant theek kar denge!

---
---

# 🔐 Security Vulnerability Audit Report

> Yeh section **security vulnerabilities** ke baare mein hai — ye functional bugs nahi hain, balki ye attack vectors hain jo real production systems mein exploit ho sakte hain. Har vulnerability ke saath **severity rating**, **Hinglish explanation**, **reproduction steps**, aur **fix** diya gaya hai.

---
<!-- 
## 9. ReDoS — Regular Expression Denial of Service

* **Severity**: 🟠 HIGH
* **File Links**:
  - [products.js (Backend Routes)](file:///home/vivek/Skinshy/Backend/src/routes/products.js) — Lines 22–25

### Hinglish Explanation:
> `GET /api/products?search=` endpoint mein user ka raw search string seedha MongoDB `$regex` query mein inject ho raha hai — **bina kisi sanitization ya length check ke**.
>
> ```javascript
> // Backend/src/routes/products.js  (Line 22–25)
> query.$or = [
>   { productName: { $regex: search, $options: 'i' } },
>   { productType: { $regex: search, $options: 'i' } }
> ];
> ```
>
> Agar attacker ek **catastrophic backtracking regex** bheje jaise `(a+)+$` ya `((a|b)+)+`, to MongoDB ka regex engine is pattern ko match karne ki koshish mein **exponential time** lagayega. Isse server **completely freeze** ho sakta hai aur legitimate users ke liye app **down** ho jayegi — ye ek classic **ReDoS (Regular Expression Denial of Service)** attack hai.
>
> Saath hi, pagination parameters `limit` aur `skip` ka **koi upper bound nahi** hai. Attacker `limit=99999999` pass karke database ko ek hi request mein pauri memory khatam kar sakta hai.

### How to Reproduce & Verify:
1. Backend server ko locally start karein: `./START.sh`
2. Terminal mein yeh `curl` command chalayein:
   ```bash
   curl "http://localhost:5000/api/products?search=(a%2B)%2B%24"
   ```
   (Encoded form of `(a+)+$`)
3. **Observation**: Server response bahut slow ho jayega ya timeout aa jayegi. Backend console mein MongoDB query ka hang-up dekha ja sakta hai.
4. Alag se test karein: `curl "http://localhost:5000/api/products?limit=9999999"` — yeh query MongoDB se lakho documents fetch karne ki koshish karegi.

### How to Fix:

**[products.js (Backend Routes)](file:///home/vivek/Skinshy/Backend/src/routes/products.js)** mein yeh changes karein:

```javascript
// Line 17 ke paas — sanitize karo pehle
const { search, type, page, skip, limit = 20 } = req.query;

// 1. Limit ko cap karo (max 50 results allowed)
const limitNum = Math.min(Math.abs(parseInt(limit) || 20), 50);

// 2. Search string ko escape karo taaki koi regex injection na ho
if (search) {
  // Escape all regex special characters before injecting into $regex
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Also enforce a max length to prevent very long patterns
  if (escapedSearch.length > 100) {
    return res.status(400).json({ error: 'Search query too long' });
  }

  query.$or = [
    { productName: { $regex: escapedSearch, $options: 'i' } },
    { productType: { $regex: escapedSearch, $options: 'i' } }
  ];
}
``` -->

---

<!-- ## 10. SSTI — Server-Side Template Injection

* **Severity**: 🟡 LOW-MEDIUM (Potential / Future Risk)
* **File Links**:
  - [server.js](file:///home/vivek/Skinshy/Backend/src/server.js)
  - [safety.js (Backend Routes)](file:///home/vivek/Skinshy/Backend/src/routes/safety.js)

### Hinglish Explanation:
> **Abhi** is project mein koi template engine (jaise EJS, Pug, Handlebars) use nahi ho raha — isliye classic SSTI attack ka direct vector nahi hai.
>
> **Lekin ek indirect SSTI-like risk maujood hai**: `server.js` line 82 par error handler mein `req.body` ko **directly** `console.error()` mein log kiya ja raha hai aur line 87 par development mode mein `err.stack` aur `err.name` response mein bheja ja raha hai:
>
> ```javascript
> // server.js Line 74–88
> console.error('❌ ERROR HANDLER TRIGGERED:', {
>   ...
>   body: req.body    // ← Untrusted user data server-side logger mein
> });
>
> res.status(status).json({
>   success: false,
>   error: message,
>   ...(process.env.NODE_ENV === 'development' && { details: err.stack, name: err.name }) // ← Stack trace leak!
> });
> ```
>
> Pehli problem: Agar `NODE_ENV` kabhi bhi `development` mein production par chala gaya, to attacker ko **full server stack trace** milega — files paths, function names, aur internal architecture exposed ho jaayegi.
>
> Doosri problem: `glossary/ingredient/:name` route mein `decodeURIComponent(name)` user input seedha lookup mein jaata hai bina validation ke — koi bhi arbitrary string inject ki ja sakti hai.
>
> **Future risk**: Agar aap baad mein EJS, Pug, ya Handlebars add karo aur user input template mein render karo bina escaping ke — ye seedha SSTI ban jayega.

### How to Reproduce & Verify:
1. `NODE_ENV=development` set hoone par koi invalid request bhejein:
   ```bash
   curl -X POST http://localhost:5000/api/safety/calculate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer invalid_token" \
     -d '{"productId": "NOT_A_VALID_ID"}'
   ```
2. **Observation**: Response JSON mein `details` field mein full **Node.js stack trace** aa jayega jisme file paths aur function names honge.
3. Ingredient route test:
   ```bash
   curl "http://localhost:5000/api/safety/glossary/ingredient/{{7*7}}"
   ```
   **Observation**: Abhi koi output nahi aayega, lekin agar template engine add ho gaya, to `49` return hoga — SSTI confirm.

### How to Fix:

```javascript
// server.js — Error handler ko harden karo

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  // Log internally — NEVER send stack traces to client
  console.error('ERROR:', { status, message: err.message, url: req.path });

  res.status(status).json({
    success: false,
    // Only send generic message to client — never err.stack
    error: status === 500 ? 'Internal Server Error' : err.message
  });
});
```

```javascript
// safety.js — Validate ingredient name param
router.get('/glossary/ingredient/:name', asyncHandler(async (req, res) => {
  const rawName = decodeURIComponent(req.params.name);

  // Sanitize: only allow letters, numbers, spaces, hyphens
  if (!/^[a-zA-Z0-9 \-(),.]+$/.test(rawName)) {
    return res.status(400).json({ error: 'Invalid ingredient name format' });
  }
  // ... rest of handler
}));
``` -->

---
<!-- 
## 11. LPDOs — Local Path Disclosure / Over-Disclosure

* **Severity**: 🟠 HIGH
* **File Links**:
  - [server.js](file:///home/vivek/Skinshy/Backend/src/server.js) — Lines 74–88
  - [dataLoader.js](file:///home/vivek/Skinshy/Backend/src/utils/dataLoader.js) — Lines 7, 46, 121
  - [transform_ingredients.py](file:///home/vivek/Skinshy/transform_ingredients.py)

### Hinglish Explanation:
> **LPDO = Local Path Disclosure / Over-disclosure** — yani server ki internal file system structure, paths, ya sensitive debug info client ko dikh jaana.
>
> **Problem 1 — Stack Trace Leak (server.js):**
> Jab bhi koi error aata hai aur `NODE_ENV=development` set hai (jo ki `.env` file mein abhi set hai!), server response mein **full Node.js stack trace** bhejta hai:
> ```
> details: "Error: Cast to ObjectId failed\n    at /home/vivek/Skinshy/Backend/src/routes/products.js:100:..."
> ```
> Is stack trace mein `/home/vivek/Skinshy/Backend/src/routes/products.js` jaise **exact server file paths** hote hain. Attacker ko pura directory structure pata chal jaata hai.
>
> **Problem 2 — Warning Logs with Paths (dataLoader.js):**
> ```javascript
> // Line 46
> console.warn(`⚠️ Skipping product without productName:`, product);
> ```
> Agar yeh warning kisi logging service ya exposed debug endpoint par jaaye, to raw product data leak ho sakta hai.
>
> **Problem 3 — `backend.log` file:**
> `Backend/backend.log` file directly project directory mein hai. Agar yeh file git mein commit ho gayi ya web server ke static folder mein aa gayi, to saare server logs publicly accessible ho sakte hain.

### How to Reproduce & Verify:
1. `.env` mein `NODE_ENV=development` hona confirm karein (abhi yahi set hai).
2. Ye request bhejein:
   ```bash
   curl http://localhost:5000/api/products/INVALID_ID_12345
   ```
3. **Observation**: Response mein kuch aisa dikhega:
   ```json
   {
     "success": false,
     "error": "Cast to ObjectId failed...",
     "details": "CastError: Cast to ObjectId failed\n    at /home/vivek/Skinshy/Backend/src/...",
     "name": "CastError"
   }
   ```
   Full server path `/home/vivek/Skinshy/Backend/...` response mein clearly visible hai.
4. `Backend/backend.log` ko browser mein directly access karne ki koshish karein agar ye web server expose kar raha ho.

### How to Fix:

```javascript
// server.js — Production mein stack trace kabhi mat bhejo
res.status(status).json({
  success: false,
  error: status >= 500 ? 'Internal Server Error' : message
  // 'details' aur 'name' kabhi bhi client ko mat bhejo
});
```

```bash
# .env — Production mein ye set karo
NODE_ENV=production
```

```bash
# .gitignore mein backend.log add karo
echo "backend.log" >> /home/vivek/Skinshy/.gitignore
echo "*.log" >> /home/vivek/Skinshy/.gitignore
``` -->

---

## 12. Secret Key Leak — Hardcoded / Exposed Credentials

* **Severity**: 🔴 CRITICAL
* **File Links**:
  - [Backend/.env](file:///home/vivek/Skinshy/Backend/.env)
  - [Frontend/.env](file:///home/vivek/Skinshy/Frontend/.env)
  - [Frontend/.env.local](file:///home/vivek/Skinshy/Frontend/.env.local)

### Hinglish Explanation:
> Yeh project ki **sabse badi security problem** hai.
>
> `Backend/.env` file mein **live production credentials** hardcoded hain:
> ```
> MONGODB_URI=mongodb+srv://progamervivek2020_db_user:Ux2njgqbrrHZgrQo@cluster0.djohg3l.mongodb.net/skinshy
> CLERK_SECRET_KEY=sk_test_JtVdYCaOhkpeXCCELJeKYMbrUTXU9Dg727M7LMRgtT
> ```
>
> Yeh `.env` file abhi `.gitignore` mein listed hai — **par iska matlab yeh nahi ki yeh safe hai!**
> Problems:
> 1. `.gitignore` sirf **future commits** rokta hai. Agar yeh file ek baar bhi git history mein commit ho gayi thi, to wo **hamesha ke liye** `git log` mein rahegi — attacker `git clone + git log` se nikal sakta hai.
> 2. Is conversation mein, yeh file **plaintext mein read ho gayi** — matlab koi bhi tool jo project folder access kar sake, yeh credentials dekh sakta hai.
> 3. `CLERK_SECRET_KEY` ek **`sk_test_` prefix** ke saath hai — yeh real Clerk backend secret hai jo **server par kabhi bhi exposed nahi honi chahiye**. Isse Clerk account par koi bhi action perform ki ja sakti hai.
> 4. MongoDB URI mein **username aur password dono plaintext** mein hain. Isse attacker seedha database se connect karke **saara user data delete ya leak** kar sakta hai.
>
> **Frontend mein bhi:**
> `Frontend/.env` mein `REACT_APP_CLERK_PUBLISHABLE_KEY` hai — yeh React build mein bundle ho jaata hai aur browser mein **publicly visible** hota hai (DevTools > Sources). Publishable key ka exposed hona acceptable hai (yeh public hoti hai), lekin agar galti se `CLERK_SECRET_KEY` bhi `REACT_APP_` prefix ke saath Frontend mein aaya, to woh directly source code mein leak ho jayega.

### How to Reproduce & Verify:
1. Terminal mein check karein ki `.env` kabhi git history mein gayi thi:
   ```bash
   cd /home/vivek/Skinshy
   git log --all --full-history -- "Backend/.env"
   git log --all --full-history -- "Frontend/.env"
   ```
2. **Observation**: Agar koi commit history dikhti hai, to credentials permanently leaked hain.
3. Browser DevTools open karein (F12 > Sources > static/js) aur `REACT_APP_` variables search karein — yeh bundle mein plaintext mein dikh jayenge.

### How to Fix:

```bash
# STEP 1: Turant ye credentials rotate karo (invalidate karo):
# - Clerk Dashboard par jaao → API Keys → Secret Key rotate karo
# - MongoDB Atlas → Database Access → User ka password change karo

# STEP 2: Agar kabhi bhi .env git mein gayi thi, to git history se saaf karo:
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch Backend/.env Frontend/.env' \
  --prune-empty --tag-name-filter cat -- --all

# STEP 3: .gitignore ko verify karo ki .env properly listed hai
cat .gitignore | grep ".env"

# STEP 4: Ye example file banao — real values NAHI, sirf keys dikhao
```

```bash
# Backend/.env.example (git mein commit karo — values nahi, sirf keys)
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
CLERK_SECRET_KEY=sk_test_<your_clerk_secret_key>
NODE_ENV=development
```

---

## 13. Raw JSON Accept — Unvalidated / Unbounded JSON Body

* **Severity**: 🟠 HIGH
* **File Links**:
  - [server.js](file:///home/vivek/Skinshy/Backend/src/server.js) — Line 49
  - [safety.js (Backend Routes)](file:///home/vivek/Skinshy/Backend/src/routes/safety.js) — Lines 85–98
  - [users.js (Backend Routes)](file:///home/vivek/Skinshy/Backend/src/routes/users.js) — Lines 166–198

### Hinglish Explanation:
> `server.js` mein `express.json()` middleware **bina kisi size limit ke** use ho raha hai:
> ```javascript
> // server.js Line 49
> app.use(express.json()); // ← No size limit!
> ```
> Matlab koi bhi attacker ek **bahut bada JSON body** (100MB+) POST request mein bhej sakta hai, jisse server ki **memory exhaust** ho sakti hai aur service crash ho jaayegi — yeh **DoS (Denial of Service)** attack hai.
>
> Doosri problem — **`/api/safety/batch` endpoint** mein `productIds` array ka **koi length validation nahi**:
> ```javascript
> // safety.js Line 85–97
> router.post('/batch', authenticate, asyncHandler(async (req, res) => {
>   const { productIds } = req.body;
>   if (!Array.isArray(productIds) || productIds.length === 0) { ... }
>   // ← Koi MAX length check nahi!
>   const products = await Product.find({ _id: { $in: productIds } });
> ```
> Attacker 10,000 product IDs ka array bhej sakta hai — MongoDB ek hi query mein 10,000 documents fetch karega, server freeze ho jaayega.
>
> Teesri problem — `/api/users/preferences` mein `knownAllergies` array ki **koi validation nahi**:
> ```javascript
> if (Array.isArray(knownAllergies)) user.profile.knownAllergies = knownAllergies;
> ```
> Attacker 50,000 strings wala array bhej sakta hai jo database mein store ho jaayega — **unbounded data storage attack**.

### How to Reproduce & Verify:
1. **JSON size attack**:
   ```bash
   # 10MB random JSON generate karke POST karo
   python3 -c "import json; print(json.dumps({'a': 'x' * 10_000_000}))" | \
     curl -X POST http://localhost:5000/api/users \
     -H "Content-Type: application/json" \
     -d @-
   ```
2. **Batch array attack**:
   ```bash
   python3 -c "
   import json, requests
   ids = ['507f1f77bcf86cd799439011'] * 5000
   r = requests.post('http://localhost:5000/api/safety/batch',
     headers={'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
     json={'productIds': ids})
   print(r.status_code)
   "
   ```
3. **Observation**: Server response time drastically increase ho jayegi ya timeout aayega.

### How to Fix:

```javascript
// server.js — JSON body size limit set karo
app.use(express.json({ limit: '10kb' })); // Max 10KB JSON body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

```javascript
// safety.js — Batch endpoint mein length cap lagao
router.post('/batch', authenticate, asyncHandler(async (req, res) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'Product IDs array is required' });
  }

  // ✅ Maximum 20 products at a time
  if (productIds.length > 20) {
    return res.status(400).json({ error: 'Maximum 20 products can be processed at once' });
  }
  // ... rest
}));
```

```javascript
// users.js — knownAllergies array validate karo
if (Array.isArray(knownAllergies)) {
  // Max 20 allergies, each max 50 chars
  if (knownAllergies.length > 20) {
    return res.status(400).json({ error: 'Too many allergies listed (max 20)' });
  }
  const validAllergies = knownAllergies
    .filter(a => typeof a === 'string' && a.length <= 50)
    .slice(0, 20);
  user.profile.knownAllergies = validAllergies;
}
```

---

## 14. Clipboard Attack — Sensitive Data Exposure via Clipboard

* **Severity**: 🟡 MEDIUM
* **File Links**:
  - [Frontend/src](file:///home/vivek/Skinshy/Frontend/src) (General frontend concern)
  - [Frontend/.env](file:///home/vivek/Skinshy/Frontend/.env)

### Hinglish Explanation:
> **Clipboard attack** do tarike se ho sakta hai:
>
> **Type 1 — Pastejacking (Malicious Copy):**
> Yeh tab hota hai jab website kisi sensitive cheez (jaise JWT token, user ID, password reset link) ko user ke clipboard mein silently copy kar deti hai — user ko pata bhi nahi chalta. Fir user isse kisi jagah paste kar deta hai aur data leak ho jaata hai.
>
> **Type 2 — Clipboard Snooping:**
> Agar koi malicious browser extension ya aur site `navigator.clipboard.readText()` call kare, to wo user ka copied content padh sakta hai. Agar user ne apna JWT token ya koi sensitive info copy ki thi, to wo exposed ho sakti hai.
>
> **Is project mein specific risk:**
> - Skinshy ke frontend mein abhi `navigator.clipboard` ka direct use nahi hai — isliye direct clipboard write attack nahi hai.
> - **Lekin** agar future mein "Copy product link", "Share ingredients", ya "Copy auth code" feature aaya bina proper `Permissions-Policy` headers ke, to clipboard attack possible ho jayega.
> - **Ek real risk abhi bhi hai**: Developer tools mein ya API testing mein, JWT Bearer tokens copy-paste kiye jaate hain. Agar development machine par koi malicious extension installed hai, to `navigator.clipboard` ke through yeh tokens snoop kiye ja sakte hain.
> - `api.js` mein `withCredentials: true` set hai — iska matlab cookies bhi automatically send ho rahi hain. Agar koi XSS vulnerability future mein aayi (even a small one), to `document.cookie` clipboard ke through bhi leak ho sakta hai.

### How to Reproduce & Verify:
1. Browser Console (F12) mein yeh try karein (permission maang sakta hai):
   ```javascript
   // Test karo ki clipboard read ho sakti hai without explicit user gesture
   navigator.clipboard.readText().then(text => console.log('Clipboard:', text));
   ```
2. **Observation**: Modern browsers mein yeh permission dialog dikhaayega — **lekin koi bhi installed browser extension bina permission ke clipboard access kar sakta hai**.
3. Network tab mein `Authorization: Bearer <token>` header dekho — token copy karo aur check karo ki koi aur extension isko access kar sakti hai.

### How to Fix:

```html
<!-- Frontend/public/index.html — Clipboard access policy restrict karo -->
<meta http-equiv="Permissions-Policy" content="clipboard-read=(), clipboard-write=(self)">
```

```javascript
// Frontend mein agar kabhi copy feature add karo, to always use secure pattern:
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // ✅ Only copy non-sensitive info (product names, URLs — never tokens)
    console.log('Copied!');
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

// ⚠️ NEVER do this — JWT ya sensitive tokens kabhi clipboard mein mat dalo:
// navigator.clipboard.writeText(authToken); // ← WRONG
```

```javascript
// Backend mein sensitive data response se remove karo jo clipboard mein ja sakta hai
// users.js — Response mein unnecessary fields mat bhejo
res.json({
  success: true,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
    // ← clerkId kabhi mat bhejo — yeh internal identifier hai
    // ← profile.knownAllergies jaisi sensitive health data carefully handle karo
  }
});
```

---

## 15. Replay Attack — Token/Request Reuse Vulnerability

* **Severity**: 🟠 HIGH
* **File Links**:
  - [auth.js (Backend Middleware)](file:///home/vivek/Skinshy/Backend/src/middleware/auth.js)
  - [products.js (Backend Routes)](file:///home/vivek/Skinshy/Backend/src/routes/products.js) — Lines 112–134
  - [api.js (Frontend Service)](file:///home/vivek/Skinshy/Frontend/src/services/api.js)

### Hinglish Explanation:
> **Replay attack** tab hota hai jab ek **valid request ko capture karke dobara bheja jaaye** — bina original user ki knowledge ke.
>
> **Problem 1 — JWT Token Reuse (No Expiry Enforcement Check):**
> `auth.js` mein Clerk ke `verifyToken()` se token verify hota hai — Clerk khud expiry check karta hai. Lekin `products.js` mein ek **alag JWT verification** bhi ho rahi hai bina `authenticate` middleware ke:
> ```javascript
> // products.js Lines 116–122 — Duplicate auth logic, inconsistent!
> const token = authHeader.slice(7);
> const decoded = await verifyToken(token, {
>   secretKey: process.env.CLERK_SECRET_KEY
> });
> ```
> Yahan agar token expire ho jaaye, Clerk `verifyToken` throw karega — **lekin error silently catch ho raha hai** (line 131: `// Silently fail`). Matlab ek expired/stolen token bhi agar Clerk ki side par kuch issue ho, to **silently pass ho sakta hai**.
>
> **Problem 2 — No Request Nonce / Idempotency Key:**
> Koi bhi POST request (jaise `/api/safety/calculate`, `/api/users/complete-onboarding`) ko **baar baar replay** kiya ja sakta hai. Koi nonce (unique one-time identifier) ya idempotency key nahi hai. Agar attacker ne network traffic intercept karke ek valid POST request capture ki, to use **unlimited times replay** kar sakta hai.
>
> **Problem 3 — `withCredentials: true` + CORS wildcard in development:**
> `api.js` mein `withCredentials: true` set hai. Saath hi `server.js` mein development mode par **saare origins allow** hain:
> ```javascript
> if (process.env.NODE_ENV === 'development') {
>   return callback(null, true); // ← ALL origins allowed!
> }
> ```
> Iska matlab development server par koi bhi origin se request aa sakti hai aur cookies bhi automatically attach ho jaayengi — **CSRF + Replay attack ka perfect combination**.
>
> **Problem 4 — No Rate Limiting on Auth Endpoints:**
> `/api/users/complete-onboarding` aur `/api/safety/calculate` par koi rate limiting nahi hai. Attacker ek valid token se yeh endpoints **hazaron baar** call kar sakta hai.

### How to Reproduce & Verify:
1. Network tab (F12 > Network) open karo aur app use karo.
2. Koi bhi API call (jaise `POST /api/safety/calculate`) capture karo — `cURL` command copy karo browser ke "Copy as cURL" feature se.
3. Terminal mein wahi cURL command **5 baar consecutively** chalao:
   ```bash
   # Browser se copy ki gayi exact curl command yahan paste karo
   curl -X POST http://localhost:5000/api/safety/calculate \
     -H "Authorization: Bearer eyJhbGc..." \
     -H "Content-Type: application/json" \
     -d '{"productId":"507f1f77bcf86cd799439011"}'
   ```
4. **Observation**: Har baar same response aayega — **koi rejection nahi, koi rate limit nahi**. Token 1 minute baad bhi valid rahega aur replay chalti rahegi.
5. `server.js` mein `NODE_ENV=development` hone par kisi bhi origin se request bhejein — sab allow ho jaayegi.

### How to Fix:

```bash
# STEP 1: Rate limiting install karo
npm install express-rate-limit --save
```

```javascript
// server.js — Rate limiting add karo
const rateLimit = require('express-rate-limit');

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP per 15 min
  message: { error: 'Too many requests, please try again later' }
});

// Strict limit for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 requests per IP per minute
  message: { error: 'Rate limit exceeded' }
});

app.use(globalLimiter);
app.use('/api/safety/calculate', strictLimiter);
app.use('/api/users/complete-onboarding', strictLimiter);
```

```javascript
// server.js — Development mein bhi CORS restrict karo
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // ✅ Remove the blanket development bypass!
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
```

```javascript
// safety.js — Idempotency check for expensive operations
router.post('/calculate', authenticate, asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const requestKey = `${req.userId}_${productId}`;

  // Simple in-memory cache (use Redis in production)
  if (global.recentRequests?.has(requestKey)) {
    return res.status(429).json({ error: 'Duplicate request detected. Please wait.' });
  }

  // Track request for 5 seconds
  if (!global.recentRequests) global.recentRequests = new Set();
  global.recentRequests.add(requestKey);
  setTimeout(() => global.recentRequests.delete(requestKey), 5000);

  // ... rest of handler
}));
```

---

> **📋 Summary Table:**
>
> | # | Vulnerability | Severity | Location | Status |
> |---|---|---|---|---|
> | 9 | ReDoS | 🟠 HIGH | `routes/products.js` | ❌ Unpatched |
> | 10 | SSTI | 🟡 MEDIUM | `server.js`, `routes/safety.js` | ❌ Unpatched |
> | 11 | LPDOs | 🟠 HIGH | `server.js`, `dataLoader.js` | ❌ Unpatched |
> | 12 | Secret Key Leak | 🔴 CRITICAL | `Backend/.env`, `Frontend/.env` | ❌ URGENT |
> | 13 | Raw JSON Accept | 🟠 HIGH | `server.js`, `routes/safety.js` | ❌ Unpatched |
> | 14 | Clipboard Attack | 🟡 MEDIUM | Frontend general | ⚠️ Future Risk |
> | 15 | Replay Attack | 🟠 HIGH | `middleware/auth.js`, `server.js` | ❌ Unpatched |
>
> **🔴 CRITICAL action needed FIRST**: Issue #12 — `CLERK_SECRET_KEY` aur `MONGODB_URI` ko **abhi rotate karo** — ye live credentials hain!

---

Vivek, in security issues ko **functional bugs se pehle** fix karna zaroori hai, especially Secret Key Leak (#12) — kyunki agar yeh credentials already compromise ho gaye, to baaki sab fixes bhi useless hain. Pehle keys rotate karo, phir upar wale fixes implement karo!
