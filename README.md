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
npm install
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
penny-assessment/
├── apps/
│   ├── api/                     # NestJS backend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── auth/        # Authentication module
│   │   │   │   │   ├── dto/     # Data transfer objects
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   └── jwt.strategy.ts
│   │   │   │   ├── users/       # Users module
│   │   │   │   │   ├── user.schema.ts
│   │   │   │   │   ├── users.controller.ts
│   │   │   │   │   ├── users.module.ts
│   │   │   │   │   └── users.service.ts
│   │   │   │   ├── app.controller.ts
│   │   │   │   ├── app.controller.spec.ts
│   │   │   │   ├── app.module.ts
│   │   │   │   ├── app.service.ts
│   │   │   │   └── app.service.spec.ts
│   │   │   ├── assets/
│   │   │   └── main.ts          # Entry point
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.spec.json
│   │   ├── project.json
│   │   ├── jest.config.ts
│   │   └── eslint.config.mjs
│   └── auth-assessment/         # Angular frontend
│       ├── public/
│       ├── src/
│       │   ├── app/
│       │   │   ├── dashboard/   # Dashboard component
│       │   │   │   ├── dashboard.css
│       │   │   │   ├── dashboard.html
│       │   │   │   └── dashboard.ts
│       │   │   ├── login/       # Login component
│       │   │   ├── services/    # Angular services
│       │   │   ├── signup/      # Signup component
│       │   │   ├── app.component.ts
│       │   │   ├── app.config.ts
│       │   │   ├── app.css
│       │   │   ├── app.html
│       │   │   ├── app.routes.ts
│       │   │   └── nx-welcome.ts
│       │   ├── index.html
│       │   ├── main.ts
│       │   └── styles.css
│       ├── tsconfig.app.json
│       ├── tsconfig.spec.json
│       ├── project.json
│       ├── jest.config.ts
│       └── eslint.config.mjs
├── nx.json                      # Nx configuration
├── package.json
├── tsconfig.base.json
└── README.md
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
