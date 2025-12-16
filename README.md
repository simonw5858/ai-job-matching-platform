# 🤖 AI Job Matching Platform

AI-powered job matching platform with explainable match scores and recruiter dashboard. This platform demonstrates modern full-stack development with AI-driven features, perfect for showcasing UX design, AI thinking, forms, and dashboards.

## ⭐ Features

### For Job Seekers (Candidates)
- **Smart Onboarding**: Intuitive skill input and profile creation
- **AI-Powered Job Matching**: Get personalized job recommendations based on your skills and experience
- **Explainable AI Scores**: Understand exactly why jobs match your profile
- **Match Breakdown**: Detailed analysis across skills, experience, location, and education
- **Personalized Recommendations**: Get actionable advice to improve your match scores

### For Recruiters
- **Recruiter Dashboard**: Manage all your job postings in one place
- **Job Posting Management**: Create, edit, activate/deactivate, and delete job listings
- **Real-time Statistics**: Track active jobs and posting performance
- **Candidate Matching**: AI automatically matches candidates to your job postings

### Technical Features
- **REST API**: Complete RESTful API with authentication and authorization
- **Advanced Filtering**: Search jobs by skills, location, and employment type
- **JWT Authentication**: Secure token-based authentication
- **TypeScript**: Full type safety on both frontend and backend
- **Modern UI/UX**: Clean, responsive design with intuitive user experience

## 🏗️ Architecture

### Backend (Node.js + Express + TypeScript)
- Express.js REST API
- JWT-based authentication
- In-memory database (easily replaceable with PostgreSQL/MongoDB)
- AI matching algorithm with explainable scoring
- Comprehensive API endpoints for users, jobs, and matches

### Frontend (React + TypeScript + Vite)
- React 18 with TypeScript
- React Router for navigation
- Context API for state management
- Axios for API communication
- Responsive CSS design

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/simonw5858/ai-job-matching-platform.git
cd ai-job-matching-platform
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables**
```bash
# In backend directory, copy .env.example to .env
cd backend
cp .env.example .env
# Edit .env and set your JWT_SECRET
```

4. **Start the development servers**
```bash
# From the root directory
npm run dev

# Or start them separately:
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### User Management
- `PUT /api/user/profile` - Update user profile (protected)
- `PUT /api/user/skills` - Update user skills (protected)

### Jobs
- `GET /api/jobs` - Get all active jobs with filters (protected)
- `GET /api/jobs/:id` - Get specific job (protected)
- `POST /api/jobs` - Create new job (recruiter only)
- `GET /api/jobs/my/jobs` - Get recruiter's jobs (recruiter only)
- `PUT /api/jobs/:id` - Update job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)

### AI Matching
- `GET /api/matches` - Get job matches for current user (protected)
- `GET /api/matches/job/:jobId` - Get match score for specific job (protected)

## 🎯 AI Matching Algorithm

The platform uses a sophisticated AI matching algorithm that considers:

1. **Skills Match (40% weight)**
   - Exact skill matching
   - Identifies matched and missing skills
   - Provides percentage match

2. **Experience Match (30% weight)**
   - Compares years of experience
   - Accounts for overqualification
   - Adjusts scoring based on experience gap

3. **Location Match (20% weight)**
   - Perfect match for remote positions
   - Geographic proximity scoring
   - Relocation considerations

4. **Education Match (10% weight)**
   - Education background evaluation
   - Profile completeness factor

### Explainable AI
Each match includes:
- Overall match score (0-100%)
- Detailed breakdown by category
- Human-readable explanations
- Matched vs. missing items
- Personalized recommendations

## 🎨 Key UX Features

- **Progressive Onboarding**: Step-by-step profile completion
- **Visual Match Scores**: Color-coded badges (high/medium/low)
- **Interactive Dashboards**: Real-time statistics and insights
- **Responsive Design**: Works seamlessly on all devices
- **Intuitive Forms**: Smart validation and user feedback
- **Clear Navigation**: Role-based routing and access control

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Role-based access control (RBAC)
- Input validation and sanitization

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- TypeScript
- JWT (jsonwebtoken)
- bcryptjs

**Frontend:**
- React 18
- TypeScript
- React Router
- Axios
- Vite

## 📦 Project Structure

```
ai-job-matching-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (AI matching, auth)
│   │   ├── types/           # TypeScript types
│   │   └── server.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
└── package.json             # Root package.json
```

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack TypeScript development
- RESTful API design and implementation
- JWT authentication and authorization
- AI/ML algorithm implementation
- React best practices and hooks
- State management with Context API
- Responsive UI/UX design
- Role-based access control
- Modern build tools (Vite)

## 🚀 Production Deployment

For production deployment:

1. **Set environment variables**
   - Use strong JWT_SECRET
   - Configure production database (PostgreSQL/MongoDB)
   - Set NODE_ENV=production

2. **Build the applications**
```bash
npm run build
```

3. **Deploy**
   - Backend: Deploy to services like Heroku, Railway, or AWS
   - Frontend: Deploy to Vercel, Netlify, or AWS S3
   - Or use a single server with reverse proxy (nginx)

## 📝 Sample Data

The platform comes with pre-seeded job postings including:
- Senior Full Stack Developer
- Frontend Developer
- Backend Engineer
- UI/UX Designer
- DevOps Engineer

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 👨‍💻 Author

Built to showcase modern full-stack development skills with AI integration.

---

**Why this project gets you hired:**
- ✅ Demonstrates AI/ML thinking and implementation
- ✅ Shows strong UX design principles
- ✅ Full-stack TypeScript proficiency
- ✅ Modern architecture and best practices
- ✅ Production-ready code structure
- ✅ Highly relevant for 2025 tech hiring
