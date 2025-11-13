# TODO: Connect Frontend and Backend

- [x] Update vite.config.js to add proxy for /api requests to backend at http://localhost:8000
- [x] Create frontend/src/services/api.js for base axios instance with interceptors
- [x] Create frontend/src/services/authService.js for authentication API calls (login, register, etc.)
- [x] Create frontend/src/services/productService.js for product-related API calls
- [x] Update Home.jsx to use productService instead of direct axios call
- [x] Update Login.jsx to use authService for login functionality
- [x] Ensure backend .env has CORS_ORIGIN set to allow frontend origin (http://localhost:5173)
- [x] Test the connection by running both frontend (npm run dev) and backend (npm run dev)
