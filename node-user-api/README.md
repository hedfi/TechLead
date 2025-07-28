# Node.js User API

A refactored Express.js API implementing clean architecture and SOLID principles.

## 🏗️ Architecture

- **Layered Architecture**: Controllers → Services → Repositories
- **Dependency Injection**: Proper IoC container setup
- **Type Safety**: Full TypeScript implementation
- **Security**: JWT auth, input validation, SQL injection prevention
- **Performance**: Redis caching, connection pooling, rate limiting

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run migrations
npm run migrate

# Start development server
npm run dev