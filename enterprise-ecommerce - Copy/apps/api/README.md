# Enterprise E-Commerce API

Backend API for the Enterprise E-Commerce Platform built with Express.js, MySQL, and Redis.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- MySQL >= 8.0
- Redis >= 6.0

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_NAME=ecommerce
   DB_USER=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   ```

3. **Run database migrations**
   ```bash
   npm run migrate
   ```

4. **Seed database (optional)**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
src/
├── common/
│   ├── config/              # Configuration files
│   │   ├── index.js         # Main config
│   │   ├── database.js      # Database config
│   │   └── redis.js         # Redis config
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # Authentication
│   │   ├── errorHandler.js  # Error handling
│   │   ├── validator.js     # Request validation
│   │   └── requestLogger.js # Request logging
│   └── utils/               # Utility functions
│       ├── logger.js        # Winston logger
│       ├── response.js      # API response formatter
│       ├── asyncHandler.js  # Async error handler
│       └── pagination.js    # Pagination helpers
│
├── modules/                 # Feature modules
│   ├── auth/               # Authentication
│   ├── users/              # User management
│   ├── products/           # Product catalog
│   ├── orders/             # Order processing
│   ├── payments/           # Payment handling
│   └── analytics/          # Analytics & reporting
│
├── database/
│   ├── migrations/         # Database migrations
│   ├── seeders/            # Database seeders
│   └── models/             # Sequelize models
│
├── events/                 # Event handlers
├── jobs/                   # Background jobs
├── socket/                 # WebSocket handlers
└── server.js               # Application entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_NAME` | Database name | ecommerce |
| `DB_USER` | Database user | root |
| `DB_PASSWORD` | Database password | - |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |

### Database Configuration

The API uses Sequelize ORM with MySQL. Configuration is in `src/common/config/database.js`.

**Connection pooling:**
- Max connections: 5
- Min connections: 0
- Acquire timeout: 30s
- Idle timeout: 10s

### Redis Configuration

Redis is used for:
- Session management
- Caching
- Rate limiting
- Queue management

## 📡 API Endpoints

### Health Check
```
GET /health
```

### API Info
```
GET /api
```

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Users
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders
```
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

### Payments
```
POST   /api/payments/create-intent
POST   /api/payments/confirm
POST   /api/payments/webhook
```

### Analytics
```
GET    /api/analytics/dashboard
GET    /api/analytics/sales
GET    /api/analytics/products
GET    /api/analytics/users
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Request Header:**
```
Authorization: Bearer <token>
```

**Token Expiration:**
- Access Token: 7 days (configurable)
- Refresh Token: 30 days

## 📝 Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message",
  "errors": [ ... ]
}
```

### Paginated Response
```json
{
  "status": "success",
  "message": "Data retrieved",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - 100 requests per 15 minutes
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Express-validator
- **SQL Injection Protection** - Sequelize ORM
- **XSS Protection** - Sanitized inputs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📊 Logging

The API uses Winston for logging:

- **Development**: Console output with colors
- **Production**: File-based logging
  - `logs/error.log` - Error logs
  - `logs/combined.log` - All logs

## 🚀 Deployment

### Using Docker

```bash
docker build -t enterprise-api .
docker run -p 5000:5000 enterprise-api
```

### Manual Deployment

```bash
# Install dependencies
npm install --production

# Run migrations
npm run migrate

# Start server
npm start
```

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm test` | Run tests with Jest |
| `npm run migrate` | Run database migrations |
| `npm run migrate:undo` | Undo last migration |
| `npm run seed` | Seed database |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |

## 🐛 Debugging

Enable debug logs:
```bash
DEBUG=* npm run dev
```

## 📖 Additional Documentation

- [Architecture](../../docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

MIT
