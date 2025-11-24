# 🎯 MCTQ - AI-Powered Quiz Platform

**MCTQ** is a modern, AI-powered quiz creation and learning platform built with Next.js. Create quizzes manually or let AI generate them from your course content automatically!

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 🎓 **Quiz Management**

- ✅ Create custom quizzes with multiple-choice questions
- ✅ Add explanations for correct answers
- ✅ Set quiz visibility (public/private)
- ✅ Tag quizzes for easy organization
- ✅ Take quizzes with instant feedback
- ✅ Review answers with detailed explanations

### 🤖 **AI-Powered Generation**

- ✅ Generate quizzes automatically using Google Gemini AI
- ✅ Paste course content and get relevant questions
- ✅ Choose difficulty level (easy/medium/hard)
- ✅ Select question count (1-20 questions)
- ✅ Edit AI-generated questions before saving
- ✅ Intelligent question generation from any text content

### 🔐 **Authentication**

- ✅ Email/password registration and login
- ✅ Google OAuth integration (one-click sign-in)
- ✅ Secure session management with NextAuth
- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication

### 🎨 **Modern UI/UX**

- ✅ Beautiful dark theme with gradient glows
- ✅ Glass morphism design
- ✅ Fully responsive layout
- ✅ Smooth animations with Framer Motion
- ✅ Loading states and error handling

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas/register))
- **Google Gemini API** key ([Get free API key](https://aistudio.google.com/app/apikey))
- **Google OAuth** credentials (optional, for Google sign-in)

### 1. Clone the Repository

```bash
git clone https://github.com/ErenSahbaz1/ReachMe.git
cd ReachMe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reachme

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# AI Integration (Required for AI quiz generation)
GEMINI_API_KEY=AIza...your-gemini-api-key-here

# Google OAuth (Optional - for Google sign-in)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
```

> 📖 **See detailed setup guides below for each service**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app! 🎉

---

## 🔧 Environment Variables Setup

### 📦 **Required Variables**

#### `MONGODB_URI`

**Purpose**: Database connection string for storing users, quizzes, and data.

**How to get it**:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<database>` with your database name (e.g., `reachme`)

**Example**:

```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/reachme?retryWrites=true&w=majority
```

#### `NEXTAUTH_SECRET`

**Purpose**: Secret key for encrypting session tokens.

**How to generate it**:

```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use any random 32+ character string
```

**Example**:

```env
NEXTAUTH_SECRET=your-super-secret-random-string-here-abc123xyz789
```

#### `NEXTAUTH_URL`

**Purpose**: Your application URL (important for OAuth callbacks).

**For development**:

```env
NEXTAUTH_URL=http://localhost:3000
```

**For production** (after deploying):

```env
NEXTAUTH_URL=https://yourdomain.com
```

---

### 🤖 **AI Integration (Optional but Recommended)**

#### `GEMINI_API_KEY`

**Purpose**: Enable AI-powered quiz generation from course content.

**How to get it**:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key (starts with `AIza...`)
5. Add to `.env.local`

**Example**:

```env
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Free Tier Limits**:

- 1,500 requests per day
- 1 million tokens per minute
- Perfect for educational projects!

**Features enabled**:

- ✅ Generate quizzes from text content
- ✅ Choose question count and difficulty
- ✅ Edit AI suggestions before saving
- ✅ Fast generation (10-15 seconds)


---

### 🔐 **Google OAuth (Optional)**

#### `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`

**Purpose**: Enable "Sign in with Google" functionality.

**How to get them**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Configure OAuth consent screen:
   - Choose **"External"**
   - Fill in app name and your email
4. Create credentials:
   - Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
   - Application type: **"Web application"**
   - Authorized redirect URIs:
     - Add: `http://localhost:3000/api/auth/callback/google`
     - Add: `http://localhost:3001/api/auth/callback/google` (backup port)
5. Copy **Client ID** and **Client Secret**

**Example**:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

**Features enabled**:

- ✅ One-click Google sign-in
- ✅ Automatic account creation
- ✅ No password required
- ✅ Secure OAuth 2.0 flow



---

### 📝 **Complete `.env.local` Example**

```env
# ================================
# DATABASE
# ================================
MONGODB_URI=mongodb+srv://quizuser:SecurePass123@cluster0.mongodb.net/reachme?retryWrites=true&w=majority

# ================================
# AUTHENTICATION
# ================================
NEXTAUTH_SECRET=abc123xyz789-your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# ================================
# AI FEATURES (Optional)
# ================================
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ================================
# GOOGLE OAUTH (Optional)
# ================================
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

---

## 📁 Project Structure

```
ReachMe/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   │   ├── [...nextauth]/route.ts  # NextAuth handler
│   │   │   │   └── register/route.ts       # User registration
│   │   │   └── quizzes/         # Quiz CRUD endpoints
│   │   │       ├── route.ts                # List/Create quizzes
│   │   │       ├── [id]/route.ts          # Get single quiz
│   │   │       └── generate/route.ts       # AI generation
│   │   ├── quizzes/             # Quiz pages
│   │   │   ├── create/page.tsx           # Manual quiz creation
│   │   │   ├── generate/page.tsx         # AI quiz generation
│   │   │   └── [id]/page.tsx             # Take quiz
│   │   ├── signin/page.tsx      # Sign in page
│   │   ├── register/page.tsx    # Registration page
│   │   ├── page.tsx             # Home page
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── Navigation.tsx       # Header navigation
│   │   ├── QuizCard.tsx        # Quiz preview card
│   │   ├── Providers.tsx       # NextAuth provider wrapper
│   │   └── TrueFocus.tsx       # Animated background
│   ├── lib/                     # Utilities & config
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── auth-helpers.ts     # Auth middleware
│   │   ├── db.ts               # MongoDB connection
│   │   └── utils.ts            # Helper functions
│   ├── models/                  # MongoDB schemas
│   │   ├── User.ts             # User model
│   │   └── Quiz.ts             # Quiz model
│   └── types/                   # TypeScript types
│       └── next-auth.d.ts      # NextAuth type extensions
├── public/                      # Static assets
├── .env.local                   # Environment variables (YOU CREATE THIS)
├── .env.local.example          # Environment template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── next.config.ts              # Next.js config
├── GEMINI_SETUP.md            # AI setup guide
├── GOOGLE_OAUTH_SETUP.md      # OAuth setup guide
└── README.md                   # This file
```

---

## 🎓 How It Works

### **Creating a Quiz Manually**

1. Sign in to your account
2. Click **"Create Quiz"** in navigation
3. Fill in quiz details (title, description, tags)
4. Add questions with 4 multiple-choice options
5. Mark the correct answer for each question
6. Add explanations (optional but helpful!)
7. Choose visibility (public/private)
8. Save and share!

### **Generating a Quiz with AI**

1. Sign in to your account
2. Click **"🤖 AI Generate"** in navigation
3. Paste your course content (lecture notes, textbook excerpt, etc.)
   - Minimum: 100 characters
   - Optimal: 500-2,000 characters
   - Maximum: 50,000 characters
4. Select settings:
   - Number of questions (1-20)
   - Difficulty level (easy/medium/hard)
5. Click **"Generate Quiz Questions"**
6. Wait 10-15 seconds while AI processes your content
7. Review generated questions
8. Edit any questions if needed
9. Add quiz title, description, and tags
10. Save to your account!

### **Taking a Quiz**

1. Browse quizzes on the home page
2. Click on any quiz card
3. Answer questions one at a time
4. See your progress bar
5. Submit when finished
6. View your score and review answers
7. See explanations for correct answers
8. Retry or go back home

---

## 🛠️ Tech Stack

### **Frontend**

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS


### **Backend**

- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API
- **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** - Cloud database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB ODM

### **Authentication**

- **[NextAuth.js](https://next-auth.js.org/)** - Authentication framework
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Password hashing
- **[JWT](https://jwt.io/)** - Session tokens

### **AI Integration**

- **[Google Gemini AI](https://ai.google.dev/)** - AI question generation
- **[@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)** - Official SDK

---



## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production domain)
   - `GEMINI_API_KEY` (optional)
   - `GOOGLE_CLIENT_ID` (optional)
   - `GOOGLE_CLIENT_SECRET` (optional)
5. Deploy!

**Important**: Update Google OAuth redirect URIs to include your production domain:

- `https://yourdomain.com/api/auth/callback/google`

### Other Platforms

- **Netlify**: Use Next.js plugin
- **Railway**: Direct deployment from GitHub
- **DigitalOcean App Platform**: Docker or buildpack

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Troubleshooting

### "API key not configured" error

- Make sure `GEMINI_API_KEY` is in `.env.local`
- Restart dev server after adding env variables

### "redirect_uri_mismatch" (Google OAuth)

- Check redirect URI in Google Console matches exactly
- Make sure it's `http://localhost:3000/api/auth/callback/google`

### MongoDB connection fails

- Check your IP is whitelisted in MongoDB Atlas
- Verify connection string is correct
- Ensure network access is configured

### AI generation takes too long

- Normal: 10-15 seconds
- Try shorter content if timing out
- Check your internet connection

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Eren Sahbaz**

- GitHub: [@ErenSahbaz1](https://github.com/ErenSahbaz1)
- Project: [MCTQ (ReachME)](https://github.com/ErenSahbaz1/ReachMe)



**Made with ❤️ for education and learning**

**Happy Learning! 🎓✨**
