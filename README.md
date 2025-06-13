# InsightWire - News Bias Analysis Platform

A comprehensive news bias analysis and perspective comparison platform built with React (Frontend) and Express.js (Backend).

## 🚀 Quick Start

### Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)
- MongoDB (for backend database)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/0331sameer/insightwire-fyp.git
cd insightwire-fyp
```

2. Install all dependencies:

```bash
npm run setup
```

### Development

Start both frontend and backend in development mode:

```bash
npm run dev
```

This will start:

- Frontend on `http://localhost:5173/`
- Backend on `http://localhost:5000`

## 📋 Available Scripts

### Main Scripts

| Script          | Description                                         |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Start both frontend and backend in development mode |
| `npm run start` | Start both frontend and backend in production mode  |
| `npm run build` | Build the frontend for production                   |
| `npm run setup` | Install root dependencies and setup all packages    |

### Frontend Scripts

| Script                     | Description                                 |
| -------------------------- | ------------------------------------------- |
| `npm run dev:frontend`     | Start only the frontend development server  |
| `npm run start:frontend`   | Start only the frontend in production mode  |
| `npm run build:frontend`   | Build the frontend for production           |
| `npm run install:frontend` | Install frontend dependencies               |
| `npm run clean:frontend`   | Clean frontend node_modules and build files |
| `npm run lint:frontend`    | Run ESLint on frontend code                 |
| `npm run test:frontend`    | Run frontend tests                          |

### Backend Scripts

| Script                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `npm run dev:backend`     | Start only the backend development server |
| `npm run start:backend`   | Start only the backend in production mode |
| `npm run install:backend` | Install backend dependencies              |
| `npm run clean:backend`   | Clean backend node_modules                |
| `npm run test:backend`    | Run backend tests                         |

### Utility Scripts

| Script                | Description                                        |
| --------------------- | -------------------------------------------------- |
| `npm run install:all` | Install dependencies for both frontend and backend |
| `npm run clean`       | Clean all node_modules and build files             |
| `npm run lint`        | Run linting on the project                         |
| `npm run test`        | Run all tests                                      |

## 🛠️ Development Workflow

### Starting Development

```bash
# Install everything and start developing
npm run setup
npm run dev
```

### Frontend Only Development

```bash
npm run dev:frontend
```

### Backend Only Development

```bash
npm run dev:backend
```

### Production Build

```bash
npm run build
npm run start
```

### Clean Install

```bash
npm run clean
npm run setup
```

## 🏗️ Project Structure

```
insightwire-fyp/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS and styling
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Express.js backend API
│   ├── controllers/        # API controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── package.json       # Backend dependencies
├── package.json           # Root package.json with scripts
└── README.md             # This file
```

## 🌟 Features

- **News Bias Analysis**: Analyze news articles for political bias
- **Perspective Comparison**: Compare different perspectives on the same story
- **Category Management**: Organize news by categories
- **User Authentication**: Mock authentication system for development
- **Saved Categories**: Users can save their favorite news categories
- **Comments System**: Users can provide feedback on categories
- **Profile Management**: User profile with saved items and feedback history

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**:

```env
REACT_APP_API_URL=http://localhost:5000
```

**Backend (.env)**:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/insightwire
JWT_SECRET=your-jwt-secret
```

## 🚀 Deployment

### Frontend Deployment

```bash
npm run build:frontend
# Deploy the built files from frontend/build/
```

### Backend Deployment

```bash
npm run start:backend
# Ensure MongoDB is running and environment variables are set
```

## 📝 API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id/articles` - Get articles for a category

### Saved Categories

- `POST /api/saved-categories` - Save a category
- `DELETE /api/saved-categories/:id` - Unsave a category
- `GET /api/saved-categories` - Get user's saved categories

### Feedback

- `POST /api/feedback` - Add feedback to a category
- `GET /api/feedback/:categoryId` - Get feedback for a category

### Articles

- `GET /api/articles` - Get articles with pagination
- `GET /api/articles/:id` - Get a specific article
- `GET /api/articles/search` - Search articles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

---

**Happy Coding! 🎉**
