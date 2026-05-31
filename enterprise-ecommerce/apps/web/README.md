# Admin Dashboard - Frontend

Modern admin dashboard for Enterprise E-Commerce built with Vue 3, Vite, and Element Plus.

## Features

- 🎨 Modern UI with Element Plus component library
- 📊 Interactive charts and analytics
- 📱 Responsive design
- 🔐 Authentication system
- 📈 Dashboard with real-time stats
- 🛍️ Product management
- 📦 Order tracking
- 💳 Payment management
- 📊 Advanced analytics
- 🎭 Beautiful theme with gradients

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Element Plus** - Vue 3 UI component library
- **Pinia** - State management
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **SCSS** - Styling

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable components
│   ├── charts/       # Chart components
│   └── layout/       # Layout components
├── layouts/          # Layout templates
├── pages/            # Page components
├── router/           # Vue Router configuration
├── stores/           # Pinia stores
├── styles/           # Global styles
├── api/              # API client
├── App.vue           # Root component
└── main.js           # Entry point
```

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API URL
```

### Development

```bash
# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Available Routes

- `/login` - Login page
- `/` - Dashboard
- `/products` - Product management
- `/products/:id` - Product details
- `/categories` - Category management
- `/brands` - Brand management
- `/orders` - Order management
- `/orders/:id` - Order details
- `/payments` - Payment management
- `/analytics` - Analytics & reports
- `/profile` - User profile

## Components

### Layout Components
- `Sidebar.vue` - Navigation sidebar
- `Header.vue` - Top header

### Chart Components
- `SalesChart.vue` - Sales trend chart
- `RevenueChart.vue` - Revenue distribution chart

## Stores (Pinia)

### Auth Store
Manages authentication state and user information
- `login()` - User login
- `logout()` - User logout
- `getProfile()` - Fetch user profile
- `updateProfile()` - Update user profile

### Dashboard Store
Manages dashboard statistics and analytics
- `fetchDashboardStats()` - Get dashboard statistics
- `fetchSalesAnalytics()` - Get sales data
- `fetchProductAnalytics()` - Get product data

### Product Store
Manages product data
- `fetchProducts()` - Get products list
- `getProductById()` - Get product details
- `createProduct()` - Create new product
- `updateProduct()` - Update product
- `deleteProduct()` - Delete product

## API Integration

The dashboard connects to the backend API at `http://localhost:5000/api`

### API Endpoints Used

**Auth**
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/profile`
- `PUT /auth/profile`

**Products**
- `GET /products/products`
- `POST /products/products`
- `PUT /products/products/:id`
- `DELETE /products/products/:id`

**Orders**
- `GET /orders/orders`
- `GET /orders/orders/:id`
- `POST /orders/orders`

**Analytics**
- `GET /analytics/dashboard`
- `GET /analytics/sales`
- `GET /analytics/products`

## Styling

The project uses SCSS for styling with predefined color variables and utilities:

```scss
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
```

## Demo Credentials

Default login credentials for testing:
- **Email**: admin@example.com
- **Password**: password123

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_TITLE=Admin Dashboard
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, modify `vite.config.js`:
```javascript
server: {
  port: 3001,
  ...
}
```

### CORS Issues
Ensure backend is configured with proper CORS headers. The proxy in `vite.config.js` should handle API requests.

### Build Size
To analyze bundle size:
```bash
npm install --save-dev vite-plugin-visualizer
```

## Performance Tips

1. Use lazy loading for routes
2. Optimize images
3. Use production build for deployment
4. Enable gzip compression on server
5. Use CDN for static assets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please refer to the API documentation or create an issue in the repository.
