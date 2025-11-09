# 🌍 TripMosaic

**TripMosaic** is an intelligent, collaborative trip planning platform that helps you plan, organize, and manage your travels with ease. Powered by AI, it generates personalized itineraries, provides real-time weather forecasts, and offers seamless collaboration features for group travel planning.

---

## ✨ Features

### 🤖 AI-Powered Trip Planning
- **Gemini AI Integration**: Generate complete trip itineraries with day-by-day activities, hotel recommendations, and transportation options
- **Smart Budgeting**: Get realistic cost estimates for flights, accommodations, and activities
- **Personalized Recommendations**: Tailored suggestions based on your interests and travel style

### 🗺️ Manual Trip Planning
- Create custom trips with detailed itineraries
- Interactive Google Maps integration for location visualization
- Drag-and-drop activity organization
- Budget tracking and expense management

### 👥 Collaborative Features
- Invite friends via email to collaborate on trips
- Real-time updates for shared trips
- Role-based permissions (Creator, Collaborator, Viewer)
- Comment and discuss trip details with your travel group

### 🌤️ Weather & Packing Assistant
- 5-day weather forecasts for trip destinations
- Automatic date-aligned weather for your travel dates
- Smart packing suggestions based on weather conditions
- Temperature, humidity, and precipitation forecasts

### 📊 Dashboard & Analytics
- Visual trip timeline with upcoming and past trips
- Budget overview and spending tracking
- Activity management and organization
- Trip statistics and insights

### 🔐 Secure Authentication
- Firebase Authentication with email/password
- Secure user data management
- Protected routes and authorization

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### Backend & Services
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Authentication** - User management
- **Google Gemini AI** - AI trip generation
- **OpenWeatherMap API** - Weather forecasting
- **Amadeus API** - Flight and hotel data
- **Google Maps API** - Interactive maps
- **EmailJS** - Email invitations

### UI Libraries
- **Recharts** - Data visualization
- **@dnd-kit** - Drag-and-drop functionality
- **React Hook Form + Zod** - Form validation

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**

You'll also need API keys for the following services:
- Firebase (Authentication + Firestore)
- Google Gemini AI
- OpenWeatherMap
- Amadeus Travel API
- Google Maps API
- EmailJS

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TRIPMOSAIC
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create configuration files for your API keys:

#### Firebase Configuration
Create `src/config/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

#### Google Gemini AI Configuration
Create `src/config/gemini.ts`:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'YOUR_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp'
});
```

#### Other API Keys
Update the following files with your API keys:
- `src/services/weatherService.ts` - OpenWeatherMap API key
- `src/services/amadeusService.ts` - Amadeus API credentials
- `src/components/MapComponent.tsx` - Google Maps API key
- `src/components/CollaboratorManager.tsx` - EmailJS credentials

---

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

---

## 📁 Project Structure

```
TRIPMOSAIC/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AITripPlannerModal.tsx
│   │   ├── CollaboratorManager.tsx
│   │   ├── MapComponent.tsx
│   │   ├── WeatherPackingPanel.tsx
│   │   └── ...
│   ├── config/              # API configurations
│   │   ├── firebase.ts
│   │   ├── gemini.ts
│   │   └── googleMaps.ts
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/               # Page components
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TripDetail.tsx
│   │   ├── AIGeneratedTrip.tsx
│   │   └── ...
│   ├── services/            # API service layers
│   │   ├── tripService.ts
│   │   ├── weatherService.ts
│   │   ├── amadeusService.ts
│   │   └── ...
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔑 Required API Keys

### 1. Firebase
- **Where to get**: [Firebase Console](https://console.firebase.google.com/)
- **Setup**: Create a new project, enable Authentication and Firestore
- **Cost**: Free tier available

### 2. Google Gemini AI
- **Where to get**: [Google AI Studio](https://ai.google.dev/)
- **Model used**: `gemini-2.0-flash-exp`
- **Cost**: Free tier with generous limits

### 3. OpenWeatherMap
- **Where to get**: [OpenWeatherMap](https://openweathermap.org/api)
- **API used**: Forecast API
- **Cost**: Free tier (60 calls/minute)

### 4. Amadeus Travel API
- **Where to get**: [Amadeus for Developers](https://developers.amadeus.com/)
- **APIs used**: Flight Search, Hotel Search
- **Cost**: Free test environment

### 5. Google Maps API
- **Where to get**: [Google Cloud Console](https://console.cloud.google.com/)
- **APIs needed**: Maps JavaScript API
- **Cost**: Free tier with $200 monthly credit

### 6. EmailJS
- **Where to get**: [EmailJS](https://www.emailjs.com/)
- **Used for**: Sending collaboration invitations
- **Cost**: Free tier (200 emails/month)

---

## 🎯 Key Features Breakdown

### AI Trip Generator
1. Enter destination, dates, travelers, and budget
2. Select your interests (culture, food, adventure, etc.)
3. Get a complete itinerary with:
   - Day-by-day activities with descriptions and costs
   - Hotel recommendations (budget, mid-range, luxury)
   - Transportation options
   - Travel tips and recommendations
4. Save to dashboard with one click

### Manual Trip Planner
1. Create a new trip with basic details
2. Add custom activities with dates and locations
3. Organize activities with drag-and-drop
4. Track budget and expenses
5. View trip on interactive map

### Collaboration System
1. Invite collaborators via email
2. Assign roles (Creator, Collaborator, Viewer)
3. Real-time updates across all users
4. Manage permissions and remove collaborators

### Weather Integration
- Automatically fetches weather for trip dates
- Shows 5-day forecast if trip is within 5 days
- Provides estimated weather for trips further out
- Smart packing suggestions based on conditions

---

## 🐛 Known Limitations

1. **Weather Forecasts**: OpenWeatherMap free tier only provides 5-day forecasts. For trips more than 5 days away, estimated weather data is shown.

2. **Amadeus API**: Test environment has limited data. Some destinations may not return results.

3. **AI Token Limits**: Gemini AI free tier has daily request limits. Complex itineraries may occasionally fail.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

Built with ❤️ by Saradha

---

## 🙏 Acknowledgments

- Google Gemini AI for intelligent trip planning
- Firebase for backend infrastructure
- OpenWeatherMap for weather data
- Amadeus for travel APIs
- All the amazing open-source libraries used in this project

---

## 📞 Support

For issues and questions, please open an issue in the GitHub repository.

---

**Happy Traveling! ✈️🌴**
