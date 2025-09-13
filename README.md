# PENNY-ASSESSMENT (Nx Monorepo)

This is a MEAN stack web application built with **MEAN Stack**, using the **Nx monorepo** structure. The project includes features like user authentication (sign up, login, logout), session management, protected routes, and a dashboard interface.

---

## 🚀 Project Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rawankamal/auth-assessment.git
cd auth-assessment
```

### 2️⃣ Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3️⃣ Environment Variables

Create a `.env` file in the backend (`apps/api`) directory with the following:

```env
MONGO_URI=mongodb+srv://rawan:penny-db123@penny-db.rwe3jvs.mongodb.net/?retryWrites=true&w=majority&appName=penny-db
JWT_SECRET=penny-secret-key
JWT_EXPIRATION=8h
```

### 4️⃣ Run the Application Locally

#### Backend (NestJS API)

```bash
npx nx serve api
```

API will be running on:
```
http://localhost:3000/api
```

#### Frontend (Angular App)

```bash
npx nx serve auth-assessment
```

Frontend will be running on:
```
http://localhost:4200
```

---

## 🏗️ Project Structure

```
auth-assessment/
├── apps/
│   ├── api/                                    # NestJS Backend API
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── auth/                      # Authentication module
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── create-user.dto.ts
│   │   │   │   │   ├── auth.controller.ts     # Auth endpoints (signup/login/logout/forgot/reset)
│   │   │   │   │   ├── auth.module.ts         # Auth module configuration
│   │   │   │   │   ├── auth.service.ts        # Auth business logic
│   │   │   │   │   └── jwt.strategy.ts        # JWT passport strategy
│   │   │   │   ├── users/                     # Users module
│   │   │   │   │   ├── user.schema.ts         # MongoDB user schema
│   │   │   │   │   ├── users.controller.ts    # User endpoints (profile/list)
│   │   │   │   │   ├── users.module.ts        # Users module configuration
│   │   │   │   │   └── users.service.ts       # Users business logic
│   │   │   │   ├── app.controller.spec.ts
│   │   │   │   ├── app.controller.ts          # Root controller
│   │   │   │   ├── app.module.ts              # Main app module
│   │   │   │   ├── app.service.spec.ts
│   │   │   │   └── app.service.ts             # Root service
│   │   │   ├── assets/
│   │   │   │   └── .gitkeep
│   │   │   └── main.ts                        # Application entry point
│   │   ├── .env                               # Environment variables (MongoDB, JWT secrets)
│   │   ├── eslint.config.mjs
│   │   ├── jest.config.ts
│   │   ├── project.json                       # Nx project configuration
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.spec.json
│   │   └── webpack.config.js
│   │
│   └── auth-assessment/                       # Angular Frontend App
│       ├── src/
│       │   ├── app/
│       │   │   ├── dashboard/                 # Dashboard component (protected route)
│       │   │   │   ├── dashboard.css
│       │   │   │   ├── dashboard.html
│       │   │   │   └── dashboard.ts
│       │   │   ├── forgot-password/           # Forgot password component
│       │   │   │   ├── forgot-password.html
│       │   │   │   └── forgot-password.ts
│       │   │   ├── login/                     # Login component
│       │   │   │   ├── login.css
│       │   │   │   ├── login.html
│       │   │   │   └── login.ts
│       │   │   ├── reset-password/            # Reset password component
│       │   │   │   ├── reset-password.html
│       │   │   │   └── reset-password.ts
│       │   │   ├── services/                  # Angular services
│       │   │   │   ├── auth.guard.ts          # Route guard for protected routes
│       │   │   │   ├── auth.interceptor.ts    # HTTP interceptor for JWT tokens
│       │   │   │   └── auth.service.ts        # HTTP service for API calls
│       │   │   ├── signup/                    # Signup component
│       │   │   │   ├── signup.css
│       │   │   │   ├── signup.html
│       │   │   │   └── signup.ts
│       │   │   ├── store/                     # NgRx state management
│       │   │   │   ├── auth/                  # Auth feature store
│       │   │   │   │   ├── auth.actions.ts    # Auth actions (login/logout/signup/etc.)
│       │   │   │   │   ├── auth.effects.ts    # Side effects for auth actions
│       │   │   │   │   ├── auth.reducer.ts    # Auth state reducer
│       │   │   │   │   ├── auth.selectors.ts  # Auth state selectors
│       │   │   │   │   └── auth.state.ts      # Auth state interface
│       │   │   │   └── app.state.ts           # Root app state
│       │   │   ├── app.config.ts              # App configuration
│       │   │   ├── app.css
│       │   │   ├── app.html
│       │   │   ├── app.routes.ts              # Routing configuration
│       │   │   └── app.ts                     # Root app component
│       │   ├── index.html                     # HTML entry point
│       │   ├── main.ts                        # Angular bootstrap
│       │   └── styles.css                     # Global styles (Bootstrap import)
│       ├── eslint.config.mjs
│       ├── project.json                       # Nx project configuration
│       ├── tsconfig.app.json
│       └── tsconfig.json
│
├── nx.json                                    # Nx workspace configuration
├── package.json                               # Dependencies and scripts
└── tsconfig.base.json                         # Base TypeScript configuration
```

---

## ✨ Features

- **User Authentication** (Sign up, Login, Logout)
- **Dashboard Interface** with protected routes
- **Session Management** (8-hour active login)
- **Protected Routes** 
- **MongoDB Atlas Integration**
- **Nx Monorepo Architecture**
- **Angular Frontend** with routing
- **NestJS Backend** with modular structure



### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
### Example API Usage

```javascript
// Login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```



## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social media authentication
- [ ] Role-based access control
- [ ] Real-time notifications
- [ ] API rate limiting

---

**Made with Rawan Kamal using the MEAN stack and Nx**
