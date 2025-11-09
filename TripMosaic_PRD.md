# TripMosaic - Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** November 9, 2025  
**Product Type:** Web Application (MVP)  
**Project Duration:** 9-10 Weeks  

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Core Features](#core-features)
4. [User Flow & Journey](#user-flow--journey)
5. [Technical Architecture](#technical-architecture)
6. [API Integration Strategy](#api-integration-strategy)
7. [Phase-wise Development Plan](#phase-wise-development-plan)
8. [Edge Cases & Solutions](#edge-cases--solutions)
9. [Success Metrics](#success-metrics)

---

## 1. Executive Summary

### Problem Statement
Group trip planning is chaotic and inefficient. Users currently:
- Use scattered platforms (WhatsApp, Instagram, YouTube, Google Docs)
- Manually research destinations across social media
- Struggle with expense tracking and split calculations
- Lack real-time collaboration during planning
- Have no visibility into group members' locations during trips

### Solution
TripMosaic is a collaborative trip planning web application that consolidates trip planning, budget management, and real-time location sharing into a single platform. It offers two distinct planning modes:

1. **Manual Collaborative Planning** - Modern discovery tools + group collaboration
2. **AI-Powered Itinerary Generator** - Automated trip planning using Gemini Pro

### Key Differentiators
- **Dual Planning Modes** - Manual vs AI, clearly separated
- **Smart Discovery** - In-app place search + curated recommendations (replacing Instagram/YouTube research)
- **Live Location Sharing** - Safety and coordination during trips
- **Real-time Collaboration** - Firebase-powered instant sync across all members
- **Intelligent Budget Tracking** - Auto-split expenses with cross-trip balance visibility

---

## 2. Product Vision

### Mission
Eliminate trip planning chaos through intelligent collaboration and automation while maintaining user control and safety.

### Target Users
- **Primary:** Friend groups (4-8 people) planning leisure trips
- **Secondary:** Families planning vacations
- **Age Group:** 18-35 years (tech-savvy millennials/Gen Z)

### Success Criteria
- 500+ active users within 3 months of launch
- Average 4+ members per trip
- 70%+ of trips use manual planning mode
- 30%+ try AI itinerary generator
- Average 8+ activities per trip

---

## 3. Core Features

### 3.1 Dashboard

**Purpose:** Central hub showing user's travel overview

**Features:**
- **My Trips Section**
  - Upcoming trips (sorted by start date)
  - Past trips (sorted by end date, descending)
  - Trip cards showing:
    - Trip name
    - Destination
    - Dates
    - Member count
    - Budget status (X% spent)
    - Cover photo (optional)
  - Quick actions: "View Trip", "Share Link"

- **Pending Balances (Cross-Trip)**
  - Aggregate view of all outstanding balances
  - Example: "You owe Rahul ₹500 (Goa trip), ₹300 (Mumbai trip)"
  - Total amount owed/owed to you
  - "Settle Up" links to specific trip expense section
  - Notification badge when balances exist

- **Quick Stats Widget**
  - Total trips taken
  - Total destinations visited
  - Total expenses tracked
  - Countries visited count

- **Recent Activity Feed**
  - "Amit added you to 'Manali Weekend'"
  - "New expense added to Goa Trip"
  - "Priya completed 'Beach Day' activity"
  - Limit: Last 10 activities

- **AI Itinerary Generator** (Prominent Button)
  - Separate card/section on dashboard
  - "Generate AI Trip Plan" CTA
  - Leads to dedicated AI flow (not mixed with manual trips)

**Layout:** Single scrollable page with clear sections

---

### 3.2 Manual Trip Planning (Primary Mode)

#### 3.2.1 Trip Creation

**User Flow:**
```
Dashboard → "Create New Trip" → Form → Trip Workspace
```

**Form Fields:**
- Trip Name* (required)
- Destination* (Google Places Autocomplete)
- Start Date* (date picker)
- End Date* (date picker, must be > start date)
- Budget (optional, default currency based on destination)
- Trip Description (optional, 500 chars max)

**Validation:**
- End date must be after start date
- Budget must be positive number
- Destination must be valid Google Place

**Post-Creation:**
- Trip created in Firestore
- User added as creator and first member
- Redirect to Trip Workspace (empty state)
- Show onboarding tooltip: "Invite members to start planning!"

---

#### 3.2.2 Member Invitation System

**Invite Methods:**

1. **Email Invitation**
   - Enter email addresses (comma-separated)
   - System sends email with:
     - Trip details
     - Invite link with unique token
     - "Join Trip" button
   - Uses EmailJS or Firestore triggers

2. **Shareable Link**
   - Generate unique invite code (8-char alphanumeric)
   - Copy link: `tripmosaic.app/join/{tripCode}`
   - Anyone with link can join (until trip starts or creator disables)

3. **Trip Code**
   - Display 6-digit code on trip page
   - Others can enter code in "Join Trip" section of dashboard

**Join Flow:**
- User clicks invite link
- If not logged in → Redirect to signup/login with return URL
- After auth → Auto-join trip
- Redirect to Trip Workspace
- Notification to all existing members: "X joined the trip"

**Permissions:**
- All members have equal permissions (no roles for MVP)
- Everyone can: add/edit/delete activities, add expenses, invite others
- Only creator can: delete entire trip

---

#### 3.2.3 Trip Workspace (Main Interface)

**Layout Structure:**

```
┌────────────────────────────────────────────────────┐
│  HEADER                                            │
│  Trip Name | Destination | Dates | Budget Bar     │
│  Members (avatars) | [Invite] | [Settings]         │
└────────────────────────────────────────────────────┘
│                                                    │
│  NAVIGATION TABS:                                  │
│  [ 📝 Plan ] [ 🗺️ Map ] [ 💰 Expenses ]           │
│                                                    │
└────────────────────────────────────────────────────┘
│                                                    │
│  TAB CONTENT AREA                                  │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

#### 3.2.4 Plan Tab - Itinerary Builder

**Primary Features:**

**A. Destination Discovery (Solving Instagram/YouTube Research)**

Split into two sections:

**Section 1: Quick Search** (Option A)
- Google Places search bar at top
- Search by: place name, category ("restaurants in Goa"), type
- Real-time results with:
  - Place name
  - Category (Restaurant, Museum, Beach, etc.)
  - Rating (Google rating)
  - Price level (₹, ₹₹, ₹₹₹, ₹₹₹₹)
  - Distance from destination center
  - Photo thumbnail
- Quick actions per result:
  - "Add to Itinerary" → Opens form with pre-filled location
  - "Save to Wishlist" → Adds to trip's wishlist
  - "View Details" → Show Google Place details (hours, reviews, photos)

**Section 2: Explore Destination** (Option B)
- Curated categories:
  - 🏖️ Top Attractions
  - 🍽️ Restaurants & Cafes
  - 🏨 Hotels & Stays
  - 🎭 Activities & Experiences
  - 📸 Instagram-worthy Spots
  - 🌙 Nightlife
- Each category shows:
  - Grid of places with photos
  - Powered by Google Places "Nearby Search"
  - Filters: Rating (4+, 4.5+), Price Level, Open Now
  - Sort by: Rating, Popularity, Distance
- Collaborative voting:
  - Members can upvote/downvote places
  - Show vote count per place
  - Top-voted appear first
- "Add to Itinerary" from explore view

**B. Itinerary Management**

**Day-by-Day Structure:**
```
┌─ Day 1 - Nov 10, 2025 ──────────────────┐
│                                          │
│ [+ Add Activity]                         │
│                                          │
│ ⏰ 10:00 AM                              │
│ 📍 Hotel Check-in                        │
│    Taj Exotica, Goa                      │
│    💰 Estimated: ₹5,000 | Actual: —      │
│    Added by: Rahul | 2 hours ago        │
│    [ ✓ Complete ] [ ✏️ Edit ] [ 🗑️ Delete ]│
│                                          │
│ ⏰ 12:30 PM                              │
│ 🍽️ Lunch at Curlies                     │
│    Curlies Beach Shack, Anjuna          │
│    💰 Estimated: ₹800 | Actual: —        │
│    ☁️ Weather: 28°C, Sunny              │
│    [ ✓ Complete ] [ ✏️ Edit ] [ 🗑️ Delete ]│
│                                          │
└──────────────────────────────────────────┘

┌─ Day 2 - Nov 11, 2025 ──────────────────┐
│ [+ Add Activity]                         │
└──────────────────────────────────────────┘
```

**Activity Properties:**
- Time (HH:MM format, optional)
- Title* (required)
- Description (optional, 500 chars)
- Location* (Google Place via autocomplete)
- Category (auto-detected or manual: Food, Transport, Accommodation, Sightseeing, Shopping, Other)
- Estimated Cost (optional)
- Actual Cost (filled during/after trip)
- Duration (optional, in hours/minutes)
- Notes (optional, collaborative)
- Added by (auto-tracked)
- Completed status (checkbox)

**Activity Actions:**
- **Add:** Opens modal with form
- **Edit:** Any member can edit any activity
- **Delete:** Any member can delete (with confirmation)
- **Mark Complete:** During trip, check off completed activities
- **Reorder:** Drag-and-drop to change sequence within day

**Weather Integration:**
- Fetch from OpenWeatherMap API daily
- Display per day in itinerary header
- Show: Temperature, condition icon, rain probability
- Alert icon if bad weather predicted

**Real-time Collaboration:**
- Firestore `onSnapshot` listeners
- Changes sync instantly across all devices
- Show "edited by X just now" timestamp
- Optimistic UI updates (immediate feedback)

---

#### 3.2.5 Map Tab - Visualization & Navigation

**Primary View:**
- Full-screen Google Map
- All itinerary locations plotted as markers
- Marker styling:
  - 🏨 Blue = Accommodation
  - 🍽️ Red = Food
  - 🎭 Purple = Sightseeing/Activities
  - 🚗 Green = Transport
  - Custom numbered markers per day (Day 1-1, Day 1-2, etc.)

**Features:**

**A. Route Visualization**
- Connect markers in chronological order
- Use Directions API for driving/walking routes
- Show travel time & distance between consecutive points
- Different color polyline per day:
  - Day 1: Blue
  - Day 2: Red
  - Day 3: Green (etc.)

**B. Live Location Sharing**
- **Manual Enable/Disable Toggle** (per user)
- Shows real-time location of all members who enabled sharing
- Different marker style for live locations:
  - 🟢 Green pulsing marker with user avatar/initials
  - User name label
  - Last updated timestamp ("2 min ago")
- Update frequency: Every 2 minutes (balance between accuracy and battery)
- Privacy controls:
  - User can pause sharing anytime
  - Auto-disable when trip ends
  - Notification when sharing is active

**Technical Implementation:**
```javascript
// Update user location every 2 minutes
navigator.geolocation.watchPosition(
  (position) => {
    firebase.firestore()
      .collection('trips').doc(tripId)
      .collection('liveLocations').doc(userId)
      .set({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userName: currentUser.name,
        isActive: true
      }, { merge: true });
  },
  (error) => console.error(error),
  { enableHighAccuracy: false, timeout: 30000, maximumAge: 120000 }
);
```

**C. Nearby Recommendations**
- When viewing a location on map, show "Nearby Places" sidebar
- Fetch using Google Places Nearby Search
- Categories: Restaurants, Attractions, Hotels
- Filter by: Rating, Open Now, Price Level
- "Add to Itinerary" quick action

**D. Map Controls**
- Layer toggles:
  - Show/Hide route lines
  - Show/Hide live locations
  - Show/Hide day filters (only Day 1, only Day 2, etc.)
- Fit bounds: Auto-zoom to show all markers
- Click marker: Show activity details popup
- Directions: "Get directions from current location" (opens Google Maps)

---

#### 3.2.6 Expenses Tab - Budget Management

**Overview Section:**
```
┌─ Budget Overview ──────────────────────┐
│                                        │
│  Total Budget: ₹15,000                 │
│  Total Spent:  ₹8,450 (56%)            │
│  Remaining:    ₹6,550                  │
│  ████████░░░░░ Progress Bar            │
│                                        │
│  Per Person Budget: ₹3,750             │
│  Per Person Spent:  ₹2,112             │
└────────────────────────────────────────┘
```

**Balances Section:**
```
┌─ Who Owes Whom ────────────────────────┐
│                                        │
│  You (Rahul):                          │
│    ↗️ Priya owes you ₹500              │
│    ↗️ Amit owes you ₹300               │
│    ↘️ You owe Neha ₹200                │
│                                        │
│  Net: +₹600 (you're owed)              │
│  [Settle Up] button                    │
└────────────────────────────────────────┘
```

**Balance Calculation Logic:**
```javascript
// Simplified debt calculation
// For each expense:
// 1. If split equally: divide amount by num members
// 2. Track: who paid, who owes
// 3. Net balances per person pair
```

**Expense List:**
```
┌─ Expenses ─────────────────────────────┐
│                                        │
│  Filters: [All] [Food] [Transport] ... │
│  Sort: [Date ↓] [Amount] [Category]    │
│                                        │
│  [+ Add Expense]                       │
│                                        │
│  Nov 10, 2025                          │
│  ├─ Hotel Booking                      │
│  │   ₹5,000 | Paid by: Rahul           │
│  │   Split: Equal (4 people)           │
│  │   Category: Accommodation           │
│  │   [Edit] [Delete]                   │
│  │                                     │
│  ├─ Lunch at Curlies                   │
│  │   ₹800 | Paid by: Priya             │
│  │   Split: Equal (4 people)           │
│  │   Category: Food                    │
│  │   [Edit] [Delete]                   │
│                                        │
│  Nov 11, 2025                          │
│  ├─ Water Sports                       │
│      ₹2,000 | Paid by: Amit            │
│      Split: Custom                     │
│        Rahul: ₹500                     │
│        Priya: ₹500                     │
│        Amit:  ₹500                     │
│        Neha:  ₹500                     │
│      Category: Activities              │
│      [Edit] [Delete]                   │
└────────────────────────────────────────┘
```

**Add/Edit Expense Form:**
- Title* (required, e.g., "Lunch", "Hotel")
- Amount* (required, positive number)
- Paid by* (dropdown of trip members)
- Date* (defaults to today)
- Category* (Food, Transport, Accommodation, Activities, Shopping, Other)
- Split Type*:
  - **Equal:** Auto-calculate per-person amount
  - **Custom:** Manually assign amounts to each member
- Receipt Upload (optional, Firebase Storage)
- Notes (optional)

**Category-wise Breakdown:**
- Pie chart (using Recharts/Chart.js)
- Show percentage per category
- Clickable sections to filter expenses

**Budget Alerts:**
- Show warning when 80% budget used
- Show error when budget exceeded
- Notification to all members

**Currency Handling:**
- Default currency from trip destination (via Google Places country code)
- Support manual currency change
- Use Frankfurter API for conversion
- Show original + converted amounts
- Update exchange rates daily (Cloud Function cron job)

---

### 3.3 AI Itinerary Generator (Separate Mode)

**Access Point:** Dashboard → "Generate AI Trip Plan" button

**Key Principle:** Completely separate from manual trips. No mixing.

#### 3.3.1 AI Generation Flow

**Step 1: Input Form**
```
┌─ AI Trip Planner ──────────────────────┐
│                                        │
│  Tell us about your dream trip:        │
│                                        │
│  Destination*                          │
│  [Goa, India ▼] (autocomplete)         │
│                                        │
│  Duration*                             │
│  Start: [Nov 10, 2025]                 │
│  End:   [Nov 13, 2025]                 │
│  (3 days calculated)                   │
│                                        │
│  Number of People*                     │
│  [4 ▼]                                 │
│                                        │
│  Budget (Total)*                       │
│  ₹ [15000]                             │
│                                        │
│  Interests (Optional)                  │
│  ☐ Adventure ☐ Culture ☐ Food         │
│  ☐ Nightlife ☐ Relaxation ☐ Shopping  │
│                                        │
│  Additional Notes (Optional)           │
│  [Prefer vegetarian food...]           │
│  (500 chars max)                       │
│                                        │
│  [Generate Itinerary]                  │
└────────────────────────────────────────┘
```

**Validation:**
- All required fields must be filled
- Budget must be positive
- End date > Start date
- Number of people: 1-20

**Step 2: Generation Process**

**Loading State:**
```
┌─ Generating Your Trip... ──────────────┐
│                                        │
│  🤖 AI is planning your perfect trip   │
│                                        │
│  ⏳ This may take 30-60 seconds        │
│                                        │
│  [Progress Spinner Animation]          │
│                                        │
│  Status: Analyzing destination...      │
│          Creating day-by-day plan...   │
│          Finding best places...        │
│          Calculating costs...          │
└────────────────────────────────────────┘
```

**Backend Process (Firebase Cloud Function):**

```javascript
exports.generateItinerary = functions.https.onCall(async (data, context) => {
  const { destination, startDate, endDate, numPeople, budget, interests, notes } = data;
  
  const duration = calculateDays(startDate, endDate);
  
  // Step 1: Call Gemini Pro
  const geminiPrompt = `
You are an expert travel planner. Create a detailed ${duration}-day itinerary for ${destination} for ${numPeople} people with a total budget of ₹${budget}.

Interests: ${interests.join(', ') || 'General sightseeing'}
Additional notes: ${notes || 'None'}

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON (no markdown, no backticks, no explanations)
2. Include specific real places in ${destination}
3. Estimate realistic costs
4. Ensure total estimated cost ≤ ${budget}
5. Include variety: food, sightseeing, relaxation
6. Consider travel time between locations
7. Provide practical timing (e.g., breakfast at 8 AM, not 6 AM)

JSON Structure:
{
  "itinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "theme": "Arrival & Beach Exploration",
      "activities": [
        {
          "time": "10:00",
          "title": "Check-in at Hotel",
          "description": "Settle into beachfront accommodation",
          "location": {
            "name": "Taj Exotica",
            "address": "Calangute, Goa",
            "lat": 15.5167,
            "lng": 73.7667
          },
          "estimatedCost": 5000,
          "duration": "1 hour",
          "category": "accommodation"
        }
      ],
      "dailyCost": 8000
    }
  ],
  "totalEstimatedCost": 12000,
  "packingList": ["Sunscreen", "Beachwear", "Camera", "Comfortable shoes"],
  "tips": [
    "Book water sports in advance for better rates",
    "Carry cash as some beach shacks don't accept cards"
  ],
  "budgetBreakdown": {
    "accommodation": 5000,
    "food": 3000,
    "transport": 2000,
    "activities": 2000
  }
}

OUTPUT ONLY THE JSON OBJECT. NO OTHER TEXT.
`;

  const geminiResponse = await callGeminiAPI(geminiPrompt);
  
  // Step 2: Parse & Validate JSON
  let parsedData;
  try {
    // Strip markdown if present
    let cleanJson = geminiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsedData = JSON.parse(cleanJson);
  } catch (error) {
    // Retry with simplified prompt if JSON parsing fails
    return { error: 'Failed to generate itinerary. Please try again.' };
  }
  
  // Step 3: Enrich with Real Data
  const enrichedItinerary = await enrichWithAPIs(parsedData, destination);
  
  // Step 4: Return to frontend
  return { success: true, itinerary: enrichedItinerary };
});

async function enrichWithAPIs(data, destination) {
  for (let day of data.itinerary) {
    for (let activity of day.activities) {
      // Enhance location with Google Places
      if (activity.location.name) {
        const placeDetails = await searchPlace(activity.location.name, destination);
        if (placeDetails) {
          activity.location.placeId = placeDetails.place_id;
          activity.location.lat = placeDetails.geometry.location.lat;
          activity.location.lng = placeDetails.geometry.location.lng;
          activity.location.rating = placeDetails.rating;
          activity.location.photos = placeDetails.photos?.slice(0, 3);
        }
      }
    }
    
    // Add weather forecast for the day
    const weather = await getWeather(
      data.itinerary[0].activities[0].location.lat,
      data.itinerary[0].activities[0].location.lng,
      day.date
    );
    day.weather = {
      temp: weather.temp,
      condition: weather.description,
      icon: weather.icon,
      rainChance: weather.pop * 100
    };
  }
  
  return data;
}
```

**Step 3: Preview & Review**

```
┌─ Your AI-Generated Trip ───────────────┐
│                                        │
│  📍 Goa, India | 3 Days | 4 People     │
│  💰 Estimated: ₹12,000 / ₹15,000       │
│                                        │
│  ──────────────────────────────────    │
│                                        │
│  Day 1 - Arrival & Beach Exploration   │
│  ☁️ 28°C, Sunny                        │
│                                        │
│  10:00 AM - Check-in at Hotel          │
│  📍 Taj Exotica, Calangute             │
│  💰 ₹5,000 | ⏱️ 1 hour                 │
│                                        │
│  12:00 PM - Lunch at Curlies           │
│  📍 Curlies Beach Shack, Anjuna        │
│  💰 ₹800 | ⏱️ 1.5 hours                │
│  ⭐ 4.5/5 rating                       │
│  [View on Map]                         │
│                                        │
│  ... (more activities) ...             │
│                                        │
│  ──────────────────────────────────    │
│                                        │
│  📦 Packing List:                      │
│  • Sunscreen • Beachwear • Camera      │
│                                        │
│  💡 Travel Tips:                       │
│  • Book water sports in advance        │
│  • Carry cash for beach shacks         │
│                                        │
│  ──────────────────────────────────    │
│                                        │
│  Budget Breakdown (Pie Chart):         │
│  🏨 Accommodation: ₹5,000 (42%)        │
│  🍽️ Food: ₹3,000 (25%)                │
│  🚗 Transport: ₹2,000 (17%)            │
│  🎭 Activities: ₹2,000 (17%)           │
│                                        │
│  ──────────────────────────────────    │
│                                        │
│  [🔄 Regenerate] [✏️ Edit] [✅ Accept] │
└────────────────────────────────────────┘
```

**Actions:**

1. **Regenerate:**
   - Optionally add refinement notes: "Add more food places", "Reduce hotel cost"
   - Call Gemini again with context + refinement
   - Show new preview

2. **Edit:**
   - Opens itinerary in edit mode (similar to manual planning)
   - User can modify any activity before accepting
   - Still in "preview" state (not saved as trip yet)

3. **Accept:**
   - Create new trip in Firestore with AI-generated itinerary
   - Trip status: `aiGenerated: true`
   - User becomes creator/first member
   - Redirect to Trip Workspace (now fully editable as manual trip)
   - After acceptance, it's a normal manual trip (can edit, add members, etc.)

**Error Handling:**
- Gemini timeout (>60s): "Generation taking too long, please try again"
- Invalid JSON: Retry automatically (max 3 attempts), then show error
- API quota exceeded: "AI service temporarily unavailable, try manual planning"
- Budget impossible: AI suggests increasing budget or reducing days

---

### 3.4 Post-Trip Features

**Trip Status Management:**
- After end date passes, trip status changes to "Completed"
- Dashboard moves trip to "Past Trips" section

**Memories Feature:**
```
┌─ Add Trip Memories ────────────────────┐
│                                        │
│  Upload Photos & Stories               │
│                                        │
│  [📸 Upload Photos]                    │
│  [Drag & Drop Area]                    │
│                                        │
│  Organize by Day:                      │
│  Day 1 - Nov 10                        │
│  [3 photos] [+ Add more]               │
│                                        │
│  Day 2 - Nov 11                        │
│  [5 photos] [+ Add more]               │
│                                        │
│  Trip Notes:                           │
│  [Text area for sharing experiences]   │
│                                        │
│  [Save Memories]                       │
└────────────────────────────────────────┘
```

**Features:**
- Upload photos to Firebase Storage
- Organize photos by day
- Add captions to photos
- Collaborative: all members can add memories
- View mode: Photo gallery with slideshow
- Optional: Generate trip summary PDF

**Use Cases:**
- Nostalgia/reminiscing
- Share with others who couldn't join
- Template for future trips

---

## 4. User Flow & Journey

### 4.1 Complete User Journey

```
┌─────────────────────────────────────────────────────────┐
│                    LANDING PAGE                         │
│                                                         │
│  Hero: "Plan Trips Together, Effortlessly"             │
│  [Get Started] → Redirects to Login                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   LOGIN / SIGNUP                        │
│                                                         │
│  Option 1: Google OAuth (Recommended)                   │
│  Option 2: Email + Password                            │
│                                                         │
│  → Create user profile in Firestore                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      DASHBOARD                          │
│                                                         │
│  ┌────────────────┐  ┌────────────────┐                │
│  │  My Trips      │  │ Pending        │                │
│  │  • Goa Weekend │  │ Balances       │                │
│  │  • Manali Trek │  │ ₹800 Total     │                │
│  └────────────────┘  └────────────────┘                │
│                                                         │
│  ┌─────────────────────────────────────┐               │
│  │   [+ Create Manual Trip]            │               │
│  │   [🤖 Generate AI Trip Plan]        │               │
│  └─────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────┘
         ↓                           ↓
    Manual Flow                 AI Flow
         ↓                           ↓
┌──────────────────┐      ┌────────────────────┐
│ Create Trip Form │      │ AI Input Form      │
│ • Name           │      │ • Destination      │
│ • Destination    │      │ • Dates            │
│ • Dates          │      │ • Budget           │
│ • Budget         │      │ • People           │
└──────────────────┘      │ • Interests        │
         ↓                └────────────────────┘
         │                         ↓
         │                ┌────────────────────┐
         │                │ AI Processing...   │
         │                │ (30-60s)           │
         │                └────────────────────┘
         │                         ↓
         │                ┌────────────────────┐
         │                │ Preview Itinerary  │
         │                │ [Regenerate/Edit/  │
         │                │  Accept]           │
         │                └────────────────────┘
         │                         ↓ Accept
         └─────────┬───────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│                   TRIP WORKSPACE                        │
│                                                         │
│  Header: Trip Info | Members | [Invite]                │
│  Tabs: [Plan] [Map] [Expenses]                         │
└─────────────────────────────────────────────────────────┘
         ↓                ↓               ↓
    ┌────────┐      ┌─────────┐    ┌──────────┐
    │  PLAN  │      │   MAP   │    │ EXPENSES │
    │  TAB   │      │   TAB   │    │   TAB    │
    └────────┘      └─────────┘    └──────────┘
         │               │               │
         ↓               ↓               ↓
    Discover       Visualize        Track Budget
    & Add          Routes &         Split Costs
    Activities     Locations        See Balances
         │               │               │
         └───────────────┴───────────────┘
                         ↓
              During Trip: Enable Location
                         ↓
              After Trip: Add Memories
```

### 4.2 Key Interaction Flows

**Flow 1: Create & Invite**
1. User clicks "Create Manual Trip"
2. Fills form, submits
3. Lands in empty Trip Workspace
4. Sees tooltip: "Invite members to start!"
5. Clicks "Invite" → Enters emails
6. Invited users get email → Click link → Join
7. All members see notification: "X joined"

**Flow 2: Collaborative Planning**
1. Member A opens "Plan" tab
2. Uses "Explore Destination" to browse restaurants
3. Upvotes "Curlies Beach Shack"
4. Clicks "Add to Itinerary" → Fills form → Saves
5. Member B (on different device) sees activity appear immediately
6. Member B edits timing from 12:00 to 12:30
7. Member A sees update in real-time

**Flow 3: Live Location During Trip**
1. Trip start date arrives (Nov 10)
2. Members open trip → See prompt: "Enable location sharing?"
3. Member A enables → Green marker appears on map for others
4. Member B arrives at beach early → Others see their location
5. Member C uses map to navigate to same spot
6. After trip ends, location sharing auto-disables

**Flow 4: Expense Tracking**
1. During trip, Member A pays for lunch (₹800)
2. Opens "Expenses" tab → Clicks "+ Add Expense"
3. Fills: "Lunch", ₹800, Paid by Me, Split Equally
4. Submits → All members see new expense
5. Balance updates: "You owe Member A ₹200"
6. Expense appears on Member A's Dashboard in "Pending Balances"

**Flow 5: AI Generation**
1. User clicks "Generate AI Trip Plan" on dashboard
2. Fills AI form (destination, dates, budget, interests)
3. Clicks "Generate" → Loading screen (30-60s)
4. Preview appears with full itinerary
5. User reviews → Clicks "Edit" → Modifies Day 2 lunch spot
6. Clicks "Accept" → Trip created with edited itinerary
7. Can now invite members and use as manual trip

---

## 5. Technical Architecture

### 5.1 Technology Stack

**Frontend:**
- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS + Shadcn UI components
- **State Management:** React Context + Hooks (useState, useReducer)
- **Maps:** Google Maps JavaScript API (@react-google-maps/api)
- **Charts:** Recharts or Chart.js
- **Date Handling:** date-fns
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Fetch API (native)

**Backend:**
- **BaaS:** Firebase (Google)
  - Firestore (NoSQL database)
  - Authentication (Email/Password + Google OAuth)
  - Cloud Functions (Node.js for serverless logic)
  - Cloud Storage (photos, receipts, documents)
  - Hosting (static site deployment)

**APIs:**
- **Maps & Places:** Google Maps Platform
- **AI:** Google Gemini Pro 1.5 (via Google AI Studio)
- **Weather:** OpenWeatherMap One Call API 3.0
- **Currency:** Frankfurter API (free, no key needed)
- **Notifications:** EmailJS (or Firestore Email Extension)

**Development Tools:**
- **Version Control:** Git + GitHub
- **Code Editor:** VS Code
- **Package Manager:** npm
- **Deployment:** Firebase Hosting + Vercel (optional for frontend)

---

### 5.2 Database Schema (Firestore)

**Collection: `users`**
```javascript
{
  uid: "firebase_auth_uid",
  email: "user@example.com",
  displayName: "Rahul Kumar",
  photoURL: "https://...",
  createdAt: Timestamp,
  lastLogin: Timestamp
}
```

**Collection: `trips`**
```javascript
{
  tripId: "auto_generated_id",
  tripName: "Goa Weekend",
  destination: {
    name: "Goa, India",
    placeId: "google_place_id",
    country: "IN",
    lat: 15.2993,
    lng: 74.1240
  },
  startDate: Timestamp,
  endDate: Timestamp,
  budget: {
    total: 15000,
    currency: "INR"
  },
  createdBy: "user_uid",
  members: ["uid1", "uid2", "uid3"], // Array of user UIDs
  inviteCode: "ABC123", // Shareable code
  status: "active" | "completed", // Auto-set based on dates
  aiGenerated: false, // True if created via AI
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Nested data
  itinerary: [
    {
      day: 1,
      date: "2025-11-10",
      activities: [
        {
          activityId: "auto_id",
          time: "10:00",
          title: "Hotel Check-in",
          description: "Settle in",
          location: {
            name: "Taj Exotica",
            placeId: "google_place_id",
            address: "Calangute, Goa",
            lat: 15.5167,
            lng: 73.7667
          },
          category: "accommodation",
          estimatedCost: 5000,
          actualCost: 5200,
          duration: "1 hour",
          completed: false,
          addedBy: "user_uid",
          addedAt: Timestamp,
          notes: "Early check-in requested"
        }
      ]
    }
  ],
  
  expenses: [
    {
      expenseId: "auto_id",
      title: "Lunch at Curlies",
      amount: 800,
      paidBy: "user_uid",
      category: "food",
      date: Timestamp,
      splitType: "equal" | "custom",
      splitAmong: ["uid1", "uid2", "uid3"], // All members
      customSplits: {
        // Only if splitType === 'custom'
        "uid1": 200,
        "uid2": 200,
        "uid3": 400
      },
      receiptUrl: "firebase_storage_url",
      notes: "Seafood lunch",
      addedBy: "user_uid",
      addedAt: Timestamp
    }
  ],
  
  packingList: [
    {
      item: "Sunscreen",
      assignedTo: "uid1",
      packed: false
    }
  ],
  
  memories: [
    {
      memoryId: "auto_id",
      day: 1,
      photos: ["storage_url_1", "storage_url_2"],
      caption: "Amazing beach day!",
      addedBy: "user_uid",
      addedAt: Timestamp
    }
  ]
}
```

**Subcollection: `trips/{tripId}/liveLocations`**
```javascript
{
  userId: "user_uid",
  lat: 15.5167,
  lng: 73.7667,
  timestamp: Timestamp,
  userName: "Rahul",
  isActive: true
}
```

**Subcollection: `trips/{tripId}/wishlist`**
```javascript
{
  placeId: "google_place_id",
  placeName: "Curlies Beach Shack",
  category: "restaurant",
  rating: 4.5,
  priceLevel: 2,
  votes: {
    "uid1": 1, // upvote
    "uid2": -1, // downvote
    "uid3": 1
  },
  totalVotes: 1,
  addedBy: "user_uid",
  addedAt: Timestamp
}
```

---

### 5.3 Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Trips collection
    match /trips/{tripId} {
      // Allow read if user is a member
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.members;
      
      // Allow create if authenticated
      allow create: if request.auth != null &&
                       request.auth.uid == request.resource.data.createdBy;
      
      // Allow update if user is a member
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.members;
      
      // Allow delete only if user is creator
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.createdBy;
      
      // Live locations subcollection
      match /liveLocations/{userId} {
        allow read: if request.auth != null && 
                       request.auth.uid in get(/databases/$(database)/documents/trips/$(tripId)).data.members;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

### 5.4 Cloud Functions

**Function 1: generateItinerary**
```javascript
// Triggered via HTTPS callable
exports.generateItinerary = functions.https.onCall(async (data, context) => {
  // See detailed implementation in Section 3.3.1
});
```

**Function 2: sendInviteEmail**
```javascript
exports.sendInviteEmail = functions.firestore
  .document('trips/{tripId}')
  .onUpdate(async (change, context) => {
    const newMembers = change.after.data().members;
    const oldMembers = change.before.data().members;
    const addedMembers = newMembers.filter(m => !oldMembers.includes(m));
    
    if (addedMembers.length > 0) {
      // Send email to new members
      // Using EmailJS or Firestore Email Extension
    }
  });
```

**Function 3: updateTripStatus**
```javascript
// Scheduled function (runs daily at midnight)
exports.updateTripStatus = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    const today = new Date();
    
    // Find trips where endDate < today and status === 'active'
    const tripsToUpdate = await db.collection('trips')
      .where('endDate', '<', today)
      .where('status', '==', 'active')
      .get();
    
    const batch = db.batch();
    tripsToUpdate.forEach(doc => {
      batch.update(doc.ref, { status: 'completed' });
    });
    
    await batch.commit();
  });
```

**Function 4: updateCurrencyRates**
```javascript
// Scheduled function (runs daily)
exports.updateCurrencyRates = functions.pubsub
  .schedule('0 2 * * *') // 2 AM daily
  .onRun(async (context) => {
    const rates = await fetch('https://api.frankfurter.app/latest?from=USD')
      .then(res => res.json());
    
    await db.collection('settings').doc('currencyRates').set({
      rates: rates.rates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
```

---

## 6. API Integration Strategy

### 6.1 Google Maps Platform

**APIs Used:**
1. Maps JavaScript API
2. Places API (Autocomplete, Details, Nearby Search)
3. Directions API
4. Geocoding API

**Free Tier Limits (After March 1, 2025):**
- Maps JavaScript API: 10,000 loads/month
- Places API: 10,000 calls/month
- Directions API: 10,000 calls/month

**Cost Management:**
- Implement client-side caching (store place details in Firestore after first fetch)
- Batch requests where possible
- Set billing alerts at $50, $100, $150
- Use session tokens for Autocomplete + Place Details combo (cheaper)

**Implementation:**
```javascript
// Example: Place Autocomplete with session token
const [autocompleteService] = useState(new google.maps.places.AutocompleteService());
const sessionToken = useMemo(() => new google.maps.places.AutocompleteSessionToken(), []);

const searchPlaces = (input) => {
  autocompleteService.getPlacePredictions(
    {
      input: input,
      sessionToken: sessionToken, // Reuse token for session
      types: ['establishment', 'geocode']
    },
    (predictions) => {
      // Process predictions
    }
  );
};
```

---

### 6.2 Google Gemini Pro

**API:** Google AI Studio (Gemini API)
**Model:** gemini-1.5-pro

**Free Tier:**
- 15 requests/minute
- 1 million tokens/minute
- 1,500 requests/day

**Rate Limiting Strategy:**
- Implement queue system in Cloud Function
- Max 1 itinerary generation per user per 5 minutes
- Show "Please wait 5 minutes" if rate limit hit

**Prompt Engineering Best Practices:**
```javascript
const createPrompt = (destination, duration, budget, numPeople, interests) => {
  return `
You are a professional travel planner with 10+ years of experience.

TASK: Create a ${duration}-day itinerary for ${destination}.

CONSTRAINTS:
- Total budget: ₹${budget} for ${numPeople} people
- Interests: ${interests.join(', ')}
- Must include: accommodation, food, sightseeing, transport
- Realistic timings (e.g., breakfast 8-9 AM, not 6 AM)
- Real places that exist in ${destination}
- Stay within budget

OUTPUT FORMAT: Valid JSON only (no markdown, no backticks).

CRITICAL: Your response must be ONLY the JSON object below. No explanations before or after.

{
  "itinerary": [...],
  "totalEstimatedCost": number,
  "packingList": [...],
  "tips": [...],
  "budgetBreakdown": {...}
}
`.trim();
};
```

---

### 6.3 OpenWeatherMap

**API:** One Call API 3.0
**Free Tier:** 1,000 calls/day

**Usage Pattern:**
- Fetch weather when itinerary day is added
- Cache weather data for 12 hours
- Update forecasts daily for upcoming trips

**Implementation:**
```javascript
const getWeatherForecast = async (lat, lng, date) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  // Find forecast for specific date
  const targetDate = new Date(date).setHours(0, 0, 0, 0);
  const forecast = data.daily.find(day => {
    const forecastDate = new Date(day.dt * 1000).setHours(0, 0, 0, 0);
    return forecastDate === targetDate;
  });
  
  return {
    temp: forecast.temp.day,
    feelsLike: forecast.feels_like.day,
    condition: forecast.weather[0].description,
    icon: forecast.weather[0].icon,
    rainProbability: forecast.pop * 100,
    humidity: forecast.humidity
  };
};
```

---

### 6.4 Frankfurter (Currency Exchange)

**API:** https://api.frankfurter.app
**Free:** Unlimited, no API key required

**Implementation:**
```javascript
const convertCurrency = async (amount, from, to) => {
  if (from === to) return amount;
  
  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
  const response = await fetch(url);
  const data = await response.json();
  
  return data.rates[to];
};

// Example usage
const inrToUsd = await convertCurrency(15000, 'INR', 'USD'); // Returns ~180
```

---

### 6.5 API Error Handling

**Strategy:**
```javascript
// Generic API wrapper with retry logic
const apiCall = async (fetchFn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchFn();
      if (response.ok) return await response.json();
      
      if (response.status === 429) {
        // Rate limit - wait and retry
        await sleep(2000 * (i + 1)); // Exponential backoff
        continue;
      }
      
      throw new Error(`API Error: ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(1000 * (i + 1));
    }
  }
};

// Usage
try {
  const weather = await apiCall(() => fetch(weatherUrl));
} catch (error) {
  console.error('Weather API failed:', error);
  // Fallback: Show generic weather or skip
}
```

---

## 7. Phase-wise Development Plan

### Development Timeline: 10 Weeks

---

### **PHASE 1: Foundation & Setup** (Week 1-2)

**Goal:** Project infrastructure, authentication, basic navigation

#### Sprint 1.1: Project Setup
**Story Points: 8**

**TASK 1.1.1: Initialize Project** (2 SP)
- Create React app with Vite
- Install dependencies:
  - `firebase`, `@react-google-maps/api`
  - `tailwindcss`, `shadcn-ui`
  - `react-hook-form`, `zod`, `date-fns`
  - `recharts`
- Set up folder structure:
  ```
  src/
    components/
    pages/
    hooks/
    utils/
    contexts/
    config/
  ```
- Configure Tailwind + Shadcn
- Set up ESLint + Prettier

**TASK 1.1.2: Firebase Setup** (3 SP)
- Create Firebase project
- Enable services:
  - Firestore
  - Authentication (Email/Password + Google)
  - Cloud Storage
  - Hosting
  - Cloud Functions
- Configure Firebase config in `src/config/firebase.js`
- Set up Firestore security rules (basic)
- Initialize local Firebase emulators for development

**TASK 1.1.3: Authentication System** (3 SP)
- Create AuthContext with Firebase Auth
- Implement:
  - Email/Password signup
  - Email/Password login
  - Google OAuth login
  - Logout
  - Password reset
- Protected route wrapper component
- Persist auth state
- Error handling (invalid credentials, email already exists)
- Create user profile in Firestore on first login

**Acceptance Criteria:**
- Users can sign up with email/password
- Users can log in with Google
- Auth state persists on refresh
- Protected routes redirect to login

---

#### Sprint 1.2: Landing Page & Dashboard Structure
**Story Points: 7**

**TASK 1.2.1: Landing Page** (2 SP)
- Hero section with CTA
- Features overview (3 cards: Collaborative Planning, AI Generator, Budget Tracking)
- "Get Started" button → Login page
- Responsive design
- Simple, clean UI (no fancy animations for MVP)

**TASK 1.2.2: Dashboard Layout** (3 SP)
- Create Dashboard page (route: `/dashboard`)
- Header with:
  - Logo
  - User avatar + name
  - Logout button
- Section placeholders:
  - My Trips (empty state: "No trips yet")
  - Pending Balances (empty state)
  - Quick Stats (0/0/0)
  - AI Generator button (prominent)

**TASK 1.2.3: Basic Routing** (2 SP)
- Set up React Router:
  - `/` → Landing
  - `/login` → Login/Signup
  - `/dashboard` → Dashboard (protected)
  - `/trip/:tripId` → Trip Workspace (protected)
  - `/ai-planner` → AI Generator (protected)
- 404 page
- Navigation guards

**Acceptance Criteria:**
- Landing page is accessible at `/`
- Users can navigate to login
- After login, users land on dashboard
- Dashboard shows empty state properly

---

### **PHASE 2: Manual Trip Creation & Collaboration** (Week 3-4)

**Goal:** Core trip planning features with real-time sync

#### Sprint 2.1: Trip Creation & Invitation
**Story Points: 13**

**TASK 2.1.1: Create Trip Flow** (5 SP)
- "Create New Trip" button on dashboard
- Create Trip form modal:
  - Trip Name (text input, required)
  - Destination (Google Places Autocomplete)
  - Start Date (date picker, required)
  - End Date (date picker, required, validation: > start date)
  - Budget (number input, optional)
  - Description (textarea, optional)
- Form validation using React Hook Form + Zod
- Submit → Create trip in Firestore
- Auto-add creator to `members` array
- Redirect to Trip Workspace

**TASK 2.1.2: Google Places Autocomplete Integration** (3 SP)
- Set up Google Maps API key
- Implement Places Autocomplete for destination field
- Extract: place name, place_id, country, lat/lng
- Store in trip document
- Handle API errors gracefully

**TASK 2.1.3: Invitation System** (5 SP)
- "Invite Members" button in Trip header
- Invite modal with options:
  - Email input (multi-email with comma separation)
  - Copy invite link
  - Display trip code
- Generate unique 6-char trip code on creation
- Cloud Function: `sendInviteEmail`
  - Triggered on new member added
  - Send email with trip details + join link
  - Use EmailJS or Firestore Email Extension
- Join flow:
  - `/join/:tripCode` route
  - If not logged in → Login → Auto-join → Redirect to trip
  - If logged in → Add to members array → Redirect to trip
- Notification to all members when someone joins

**Acceptance Criteria:**
- Users can create trips successfully
- Destination autocomplete works
- Invite emails are sent
- Invited users can join via link/code
- All members are notified of new joins

---

#### Sprint 2.2: Itinerary Builder (Manual)
**Story Points: 13**

**TASK 2.2.1: Trip Workspace Structure** (3 SP)
- Create Trip Workspace page (`/trip/:tripId`)
- Header with:
  - Trip name, destination, dates
  - Member avatars (max 5 visible, "+X more")
  - Budget progress bar
  - Invite button
  - Settings dropdown (future: edit trip, leave trip, delete trip)
- Tab navigation:
  - Plan (default)
  - Map
  - Expenses
- Load trip data from Firestore
- 404 if trip doesn't exist or user not a member

**TASK 2.2.2: Day-by-Day Itinerary UI** (5 SP)
- Plan Tab renders days based on trip duration
- Calculate days: `(endDate - startDate) + 1`
- For each day:
  - Day header (Day X - Date)
  - "+ Add Activity" button
  - List of activities (empty initially)
- Activity Card component:
  - Time (optional icon if present)
  - Title (bold)
  - Location (with map pin icon)
  - Category icon (auto-detect from category field)
  - Estimated/Actual cost
  - "Added by X" footer
  - Action buttons: Complete checkbox, Edit, Delete
- Empty state per day: "No activities planned for this day"

**TASK 2.2.3: Add/Edit Activity** (5 SP)
- "Add Activity" opens modal with form:
  - Day selection (dropdown if multiple days)
  - Time (time picker, optional)
  - Title (text, required)
  - Location (Google Places Autocomplete, required)
  - Description (textarea, optional)
  - Category (dropdown: Food, Transport, Accommodation, Sightseeing, Shopping, Other)
  - Estimated Cost (number, optional)
  - Duration (number + unit dropdown: hours/minutes, optional)
- Edit activity: Pre-fill form with existing data
- Save → Update Firestore `itinerary` array
- Delete: Confirmation dialog → Remove from Firestore
- Real-time sync: Use `onSnapshot` listener
- Handle concurrent edits: Last write wins (Firestore default)

**Acceptance Criteria:**
- Users can add activities to specific days
- Activities display in chronological order
- Editing works correctly
- Real-time sync: changes appear immediately for all members
- Delete requires confirmation

---

#### Sprint 2.3: Discovery Features
**Story Points: 8**

**TASK 2.3.1: Quick Place Search** (3 SP)
- Search bar in Plan tab (above days)
- Google Places Text Search integration
- Search input with debounce (500ms)
- Display results:
  - Place name
  - Category/type
  - Rating (stars)
  - Price level (₹ symbols)
  - Thumbnail photo
- Actions per result:
  - "Add to Itinerary" → Opens Add Activity form with pre-filled location
  - "Save to Wishlist" → Adds to trip's wishlist subcollection

**TASK 2.3.2: Explore Destination Section** (5 SP)
- Collapsible section in Plan tab: "Explore [Destination]"
- Category tabs:
  - Top Attractions
  - Restaurants
  - Hotels
  - Activities
- For each category, use Google Places Nearby Search
- Display grid of places (4-6 per category)
- Each place card:
  - Photo
  - Name
  - Rating
  - Price level
  - Upvote/Downvote buttons (store in wishlist with votes)
  - "Add to Itinerary" button
- Voting:
  - Track votes per user in Firestore
  - Show total vote count
  - Sort by votes (highest first)

**Acceptance Criteria:**
- Search returns relevant places
- Explore section shows curated places
- Voting works and updates in real-time
- Adding to itinerary pre-fills location correctly

---

### **PHASE 3: Map & Route Visualization** (Week 5)

**Goal:** Interactive map with routes and live locations

#### Sprint 3.1: Map Implementation
**Story Points: 13**

**TASK 3.1.1: Basic Map Setup** (3 SP)
- Map Tab in Trip Workspace
- Integrate Google Maps JavaScript API
- Display map centered on trip destination
- Plot markers for all itinerary locations
- Use custom marker icons per category:
  - Food: Red
  - Accommodation: Blue
  - Sightseeing: Purple
  - Transport: Green
  - Other: Gray
- Marker labels: Day number + activity sequence (e.g., "1-1", "1-2")
- Click marker → Show info window with activity details

**TASK 3.1.2: Route Visualization** (5 SP)
- Use Directions API to draw routes between consecutive activities
- Group by day: Each day has its own route
- Polyline colors per day:
  - Day 1: Blue
  - Day 2: Red
  - Day 3: Green
  - etc. (cycle through 5 colors)
- Display route info:
  - Total distance per day
  - Total travel time per day
- Handle edge cases:
  - No activities → No routes
  - Single activity → Just marker, no route
  - API errors → Show message, skip route

**TASK 3.1.3: Live Location Sharing** (5 SP)
- "Enable Location Sharing" toggle in Map tab header
- When enabled:
  - Request browser geolocation permission
  - Update user's location in `trips/{tripId}/liveLocations/{userId}` every 2 minutes
  - Use `navigator.geolocation.watchPosition`
- Display live locations:
  - Green pulsing marker
  - User avatar/initials
  - Name label
  - "Last updated X min ago"
- Listen to live location updates from all members
- Privacy:
  - Toggle off → Delete from liveLocations subcollection
  - Auto-disable after trip end date
  - Notification: "Location sharing is active" when enabled
- Battery optimization:
  - Use `enableHighAccuracy: false`
  - `maximumAge: 120000` (2 min cache)

**Acceptance Criteria:**
- Map displays all activity locations
- Routes are drawn correctly per day
- Live location sharing works
- Users can enable/disable location anytime
- Location updates are visible to all members in real-time

---

### **PHASE 4: Expense Tracking** (Week 6)

**Goal:** Comprehensive budget management

#### Sprint 4.1: Expense Management
**Story Points: 13**

**TASK 4.1.1: Expense Overview UI** (3 SP)
- Expenses Tab in Trip Workspace
- Header section:
  - Total Budget (from trip)
  - Total Spent (sum of all expenses)
  - Remaining (budget - spent)
  - Progress bar (spent/budget %)
  - Alert if budget exceeded (red bar)
- Per-person breakdown:
  - Per Person Budget (total budget / num members)
  - Per Person Spent (total spent / num members for equal splits)

**TASK 4.1.2: Add/Edit Expense** (5 SP)
- "+ Add Expense" button
- Expense form modal:
  - Title (text, required)
  - Amount (number, required, positive)
  - Paid by (dropdown of members, required)
  - Date (date picker, defaults to today)
  - Category (dropdown: Food, Transport, Accommodation, Activities, Shopping, Other)
  - Split Type (radio: Equal / Custom)
    - Equal: Auto-calculate per-person amount
    - Custom: Show input for each member, validate sum === amount
  - Receipt Upload (optional, Firebase Storage)
  - Notes (textarea, optional)
- Edit expense: Pre-fill form
- Delete expense: Confirmation → Remove from Firestore
- Save → Add to `expenses` array in trip document

**TASK 4.1.3: Balance Calculation** (5 SP)
- Calculate balances after each expense update
- Logic:
  ```javascript
  // Simplified algorithm
  for each expense:
    if splitType === 'equal':
      perPersonAmount = amount / numMembers
      for each member:
        if member !== paidBy:
          balances[member][paidBy] += perPersonAmount
    else if splitType === 'custom':
      for each (member, splitAmount) in customSplits:
        if member !== paidBy:
          balances[member][paidBy] += splitAmount
  
  // Simplify debts (optional: minimize transactions)
  ```
- Display balances:
  - "You owe X ₹500"
  - "X owes you ₹300"
  - Net balance (total owed - total owing)
- Color code:
  - Green if net positive (owed money)
  - Red if net negative (owe money)

**Acceptance Criteria:**
- Users can add expenses with equal/custom splits
- Balances are calculated correctly
- Expense list shows all expenses chronologically
- Edit and delete work properly
- Budget progress bar updates in real-time

---

#### Sprint 4.2: Budget Visualization & Cross-Trip Balances
**Story Points: 5**

**TASK 4.2.1: Category Breakdown Chart** (2 SP)
- Pie chart showing expense distribution by category
- Use Recharts library
- Show:
  - Category name
  - Amount
  - Percentage
- Clickable sections to filter expense list

**TASK 4.2.2: Dashboard Pending Balances** (3 SP)
- Query all trips where user is a member
- Calculate balances across all trips
- Display on dashboard:
  - Grouped by person
  - "Rahul owes you ₹500 (Goa Trip), ₹300 (Mumbai Trip)"
  - Total owed to user
  - Total user owes
  - Net balance
- "Settle Up" link → Opens specific trip's Expenses tab
- Mark expense as "Settled" (optional: add `settled: true` flag)

**Acceptance Criteria:**
- Pie chart displays correctly
- Dashboard shows accurate cross-trip balances
- Balances update when new expenses added

---

### **PHASE 5: AI Itinerary Generator** (Week 7-8)

**Goal:** Gemini-powered automatic trip planning

#### Sprint 5.1: AI Input & Processing
**Story Points: 13**

**TASK 5.1.1: AI Input Form** (3 SP)
- Create `/ai-planner` page
- Form fields:
  - Destination (Google Places Autocomplete, required)
  - Start Date (date picker, required)
  - End Date (date picker, required)
  - Number of People (number input, 1-20, required)
  - Budget (number input, required)
  - Currency (auto-detect from destination, allow manual change)
  - Interests (checkboxes: Adventure, Culture, Food, Nightlife, Relaxation, Shopping)
  - Additional Notes (textarea, 500 chars max, optional)
- Validation: All required fields, dates valid, budget positive
- "Generate Itinerary" button

**TASK 5.1.2: Cloud Function - Gemini Integration** (8 SP)
- Create Firebase Cloud Function: `generateItinerary`
- Set up Google AI Studio API key (environment variable)
- Implement Gemini API call:
  - Model: `gemini-1.5-pro`
  - Prompt engineering (see Section 3.3.1 for detailed prompt)
  - Response parsing:
    - Extract JSON from response
    - Handle markdown wrapping (strip backticks)
    - Validate JSON structure
- Error handling:
  - Invalid JSON → Retry with simplified prompt (max 3 attempts)
  - Gemini timeout (>60s) → Return error
  - API quota exceeded → Return error with message
- Rate limiting:
  - Max 1 request per user per 5 minutes
  - Track in Firestore: `users/{uid}/aiRequests/{timestamp}`

**TASK 5.1.3: Data Enrichment Pipeline** (2 SP)
- After Gemini returns itinerary:
  - For each activity location:
    - Call Google Places Text Search to get place_id, lat/lng, rating
    - If place not found, use Geocoding API as fallback
  - Fetch weather forecast for each day (OpenWeatherMap)
  - Add to enriched itinerary object
- Cache enriched data to avoid redundant API calls
- Return enriched itinerary to frontend

**Acceptance Criteria:**
- Form validates inputs correctly
- Cloud Function successfully calls Gemini
- JSON parsing handles edge cases
- API errors are handled gracefully
- Enrichment adds real place data and weather

---

#### Sprint 5.2: AI Preview & Acceptance
**Story Points: 8**

**TASK 5.2.1: Loading State** (2 SP)
- After "Generate" button clicked:
  - Show loading modal with:
    - Progress spinner
    - Status messages: "Analyzing destination...", "Creating itinerary...", "Finding best places...", "Calculating costs..."
  - Estimated time: 30-60 seconds
  - Allow cancel (abort Cloud Function call)

**TASK 5.2.2: AI Preview Interface** (4 SP)
- Display generated itinerary in preview mode:
  - Trip header: Destination, dates, people, estimated cost vs budget
  - Day-by-day breakdown (same UI as manual itinerary)
  - Packing list section
  - Travel tips section
  - Budget breakdown pie chart
- Make itinerary read-only in preview mode
- Action buttons:
  - **Regenerate:** Reopen input form with pre-filled data, allow modifications, generate again
  - **Edit:** Enable inline editing of any activity (similar to manual planning)
  - **Accept:** Create trip with current itinerary

**TASK 5.2.3: Accept Flow** (2 SP)
- "Accept" button:
  - Create new trip in Firestore
  - Copy itinerary from preview to trip document
  - Set `aiGenerated: true` flag
  - User becomes creator and first member
  - Redirect to Trip Workspace
- After acceptance:
  - Trip behaves like normal manual trip
  - User can edit, add members, add expenses, etc.
  - No distinction in UI (AI flag is just metadata)

**Acceptance Criteria:**
- Loading state displays status updates
- Preview shows complete itinerary
- Regenerate creates new itinerary
- Edit mode allows modifications before accepting
- Accept creates trip successfully and redirects

---

### **PHASE 6: Polish & Additional Features** (Week 9)

**Goal:** Weather, packing list, memories, notifications

#### Sprint 6.1: Weather & Packing
**Story Points: 8**

**TASK 6.1.1: Weather Integration** (3 SP)
- Fetch weather forecast when itinerary day is created
- Display in Plan tab:
  - Weather icon, temperature, condition in day header
  - Expand to show: feels like, humidity, rain probability
- Alert if bad weather:
  - Show warning icon if rain chance >70%
  - Notification: "Heavy rain expected on Day 2"
- Cache weather data for 12 hours
- Refresh daily for upcoming trips (Cloud Function cron job)

**TASK 6.1.2: Collaborative Packing List** (5 SP)
- Add "Packing List" section in Plan tab (collapsible)
- "+ Add Item" button
- Item properties:
  - Name (text, required)
  - Assigned to (dropdown of members, optional)
  - Packed status (checkbox)
- Display:
  - Group by assigned member
  - Show progress: "5/10 items packed"
- Real-time sync
- For AI-generated trips: Pre-populate from AI's packing list

**Acceptance Criteria:**
- Weather displays correctly per day
- Alerts show for bad weather
- Packing list is collaborative
- Items can be assigned and checked off

---

#### Sprint 6.2: Post-Trip Memories
**Story Points: 5**

**TASK 6.2.1: Trip Status Management** (2 SP)
- Cloud Function: `updateTripStatus` (scheduled daily)
- Check trips where `endDate < today` and `status === 'active'`
- Update status to 'completed'
- Dashboard separates: Upcoming Trips, Past Trips

**TASK 6.2.2: Memories Feature** (3 SP)
- After trip ends, show "Add Memories" button in trip workspace
- Memories modal:
  - Upload photos (multi-select, Firebase Storage)
  - Assign photos to specific days
  - Add captions
  - Trip notes (overall experience)
- Display:
  - Photo gallery per day
  - Slideshow mode
  - Collaborative: all members can add
- Optional: "Download Trip Summary" → Generate PDF with itinerary + photos

**Acceptance Criteria:**
- Trip status updates automatically
- Past trips show in separate section
- Users can upload and view memories

---

### **PHASE 7: Testing & Deployment** (Week 10)

**Goal:** Bug fixes, optimization, launch

#### Sprint 7.1: Testing & Bug Fixes
**Story Points: 8**

**TASK 7.1.1: End-to-End Testing** (3 SP)
- Test complete user flows:
  - Signup → Create trip → Invite → Plan → Track expenses → View map
  - AI generation → Preview → Edit → Accept
- Test edge cases (see Section 8)
- Fix critical bugs
- Test on different browsers (Chrome, Firefox, Safari)
- Mobile responsive testing

**TASK 7.1.2: Performance Optimization** (3 SP)
- Implement lazy loading for routes
- Optimize Firestore queries (add indexes)
- Minimize API calls (caching)
- Image optimization (compress uploads)
- Lighthouse audit: Aim for >90 score

**TASK 7.1.3: Security Audit** (2 SP)
- Review Firestore security rules
- Test unauthorized access scenarios
- Ensure API keys are not exposed in frontend
- Environment variables properly configured
- XSS/CSRF protection

---

#### Sprint 7.2: Deployment & Launch
**Story Points: 5**

**TASK 7.2.1: Production Setup** (2 SP)
- Set up production Firebase project
- Configure domain (tripmosaic.app or similar)
- Set up Firebase Hosting
- Deploy Cloud Functions to production
- Configure production API keys (Google Maps, Gemini, OpenWeather)
- Set up monitoring (Firebase Analytics, Cloud Logging)

**TASK 7.2.2: Documentation** (2 SP)
- User guide: How to create trip, invite members, use AI, etc.
- Developer docs: Setup instructions, architecture, API reference
- README for GitHub

**TASK 7.2.3: Launch** (1 SP)
- Deploy to production
- Monitor errors and usage
- Gather user feedback
- Prepare for post-launch iterations

**Acceptance Criteria:**
- All critical bugs fixed
- App is deployed and accessible
- Documentation is complete
- Monitoring is set up

---

## 8. Edge Cases & Solutions

### 8.1 User & Authentication

| Edge Case | Solution |
|-----------|----------|
| User tries to join trip but not logged in | Redirect to login with return URL, auto-join after auth |
| User receives invite email but already a member | Show message: "You're already a member of this trip" |
| Invite code doesn't exist | Show error: "Invalid invite code" |
| User tries to access trip they're not a member of | Show 403 Forbidden page or redirect to dashboard |
| Creator deletes their account | Transfer ownership to next oldest member or orphan trip (mark as deleted) |

### 8.2 Trip Planning

| Edge Case | Solution |
|-----------|----------|
| Two users add activity to same day at same time | Firestore handles concurrency, last write wins, both activities exist |
| User deletes activity that has linked expense | Keep expense, show warning: "Activity deleted but expense remains" |
| Activity location no longer exists (closed business) | Show warning icon, allow user to update location |
| Start date is in the past | Validation: Show error "Start date must be in future" |
| Trip duration is >365 days | Show warning: "Are you sure? This is a very long trip" (allow but confirm) |
| User tries to add activity outside trip dates | Validation: Activity date must be within trip dates |

### 8.3 Map & Location

| Edge Case | Solution |
|-----------|----------|
| User denies geolocation permission | Show message: "Enable location to use live sharing", disable toggle |
| User's device doesn't support geolocation | Hide live location toggle, show info message |
| Network connection lost during location update | Buffer location updates, send when connection restored |
| User enables location sharing after trip ends | Auto-disable, show message: "Trip has ended, location sharing disabled" |
| Google Maps API quota exceeded | Show basic map without routes, display message: "Advanced map features temporarily unavailable" |
| Route calculation fails (no route exists) | Show straight line between points, display distance only |

### 8.4 Expenses

| Edge Case | Solution |
|-----------|----------|
| User adds expense after member leaves trip | Expense is still valid, calculate split with remaining members, show note: "X was part of trip at time of expense" |
| Expense amount exceeds total budget by 10x | Show confirmation: "This expense is unusually high, are you sure?" |
| Custom split amounts don't add up to total | Validation error: "Split amounts must equal total expense" |
| User tries to delete expense created by someone else | Allow (all members have equal permissions), show confirmation |
| Two currencies in same trip (international travel) | Allow, convert all to trip's base currency for totals, show original + converted |
| Expense paid by user who left trip | Keep expense, show in balance as "(Former member)" |

### 8.5 AI Generation

| Edge Case | Solution |
|-----------|----------|
| Gemini returns invalid JSON | Retry up to 3 times with simplified prompt, then show error: "AI generation failed, please try manual planning" |
| AI suggests places that don't exist | Enrichment step will fail to find place, replace with generic coordinates, flag as "Suggested location" |
| Generated itinerary exceeds budget | AI should prevent this in prompt, but if happens: Show warning, allow user to edit before accepting |
| User spams generate button (DoS) | Rate limit: 1 request per 5 minutes per user, show cooldown timer |
| Gemini API is down | Catch error, show message: "AI service temporarily unavailable, please try again later or use manual planning" |
| User closes tab during generation | Cloud Function completes in background, result lost, user can regenerate |
| API quota exceeded (1,500/day limit) | Show error: "Daily AI limit reached, please try tomorrow or use manual planning" |

### 8.6 Real-time Sync

| Edge Case | Solution |
|-----------|----------|
| User edits activity while offline | Changes queued, sync when online, potential conflict if others edited (last write wins) |
| Firestore listener disconnects | Automatic reconnection by Firebase SDK, show "Reconnecting..." notification |
| User has slow internet connection | Show loading spinner longer, timeout after 10s, show error: "Check your internet connection" |
| Two users delete same activity simultaneously | Firestore handles atomic delete, both succeed, activity deleted |

### 8.7 File Uploads

| Edge Case | Solution |
|-----------|----------|
| User uploads very large photo (>10MB) | Validate file size before upload, show error: "File too large, max 10MB", optionally compress on client |
| User uploads non-image file as receipt | Validate file type (image/jpeg, image/png, application/pdf), reject others |
| Firebase Storage quota exceeded | Show error: "Storage limit reached, please contact support", prevent new uploads |
| Duplicate photo uploads | Check file hash, skip upload if already exists, or allow (storage is cheap) |

---

## 9. Success Metrics

### 9.1 Key Performance Indicators (KPIs)

**User Acquisition:**
- Total signups in first 3 months: Target 500+
- Daily Active Users (DAU): Target 100+ by Month 3
- Monthly Active Users (MAU): Target 400+ by Month 3

**Engagement:**
- Average trips created per user: Target 2+
- Average trip members: Target 4-6
- Average activities per trip: Target 8+
- Trips using AI generator: Target 30%
- Trips using manual planner: Target 70%

**Technical:**
- Page load time: <3 seconds
- API error rate: <1%
- Firestore read/write ratio: Optimize for <10:1
- Uptime: >99.5%

**Retention:**
- 7-day retention: >40%
- 30-day retention: >25%
- Users who create 2+ trips: >30%

### 9.2 Analytics Events to Track

**Firebase Analytics Events:**
```javascript
// User actions
analytics.logEvent('signup_completed', { method: 'google' | 'email' });
analytics.logEvent('trip_created', { type: 'manual' | 'ai' });
analytics.logEvent('trip_joined', { via: 'email' | 'link' | 'code' });
analytics.logEvent('activity_added', { category: 'food' | 'transport' | ... });
analytics.logEvent('expense_added', { split_type: 'equal' | 'custom' });
analytics.logEvent('location_shared', { duration_minutes: number });
analytics.logEvent('ai_generated', { success: boolean, duration_seconds: number });
analytics.logEvent('ai_accepted', { edited: boolean });

// Feature usage
analytics.logEvent('feature_used', { 
  feature: 'explore_destination' | 'place_search' | 'map_route' | 'weather_check' | 'packing_list' 
});

// Errors
analytics.logEvent('api_error', { api: 'gemini' | 'maps' | 'weather', error_code: string });
```

### 9.3 Success Criteria for MVP Launch

**Must Have:**
- ✅ Users can create manual trips
- ✅ Real-time collaboration works
- ✅ Expense tracking calculates balances correctly
- ✅ Map shows routes and locations
- ✅ AI generator creates valid itineraries
- ✅ Live location sharing works during trips
- ✅ Mobile responsive

**Launch Readiness Checklist:**
- [ ] All P0 bugs fixed
- [ ] Security rules tested
- [ ] API keys secured
- [ ] Error handling implemented
- [ ] Loading states for all async operations
- [ ] Documentation complete
- [ ] Analytics configured
- [ ] Monitoring dashboard set up

---

## 10. Future Enhancements (Post-MVP)

**Version 2.0 Features:**
- Multi-destination trips (city hopping)
- Integration with booking platforms (flights, hotels)
- Advanced AI features (budget optimization, alternative suggestions)
- Social features (public trip sharing, trip templates marketplace)
- Mobile app (React Native)
- Offline mode (PWA with service workers)
- Advanced expense features (receipt OCR, settle up via UPI)
- Trip comparison (compare costs across similar destinations)
- Travel insurance integration
- Loyalty program integration (frequent flyer miles, hotel points)

**Long-term Vision:**
- Become the go-to platform for group trip planning
- Partner with travel agencies for curated trips
- B2B offerings for corporate travel management
- Monetization: Premium features, affiliate commissions, partnerships

---

## Appendix

### A. Technology References

- **Firebase Documentation:** https://firebase.google.com/docs
- **Google Maps Platform:** https://developers.google.com/maps
- **Google Gemini API:** https://ai.google.dev/gemini-api/docs
- **OpenWeatherMap API:** https://openweathermap.org/api
- **Frankfurter API:** https://frankfurter.dev/
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Shadcn UI:** https://ui.shadcn.com

### B. Glossary

- **MVP:** Minimum Viable Product
- **SP:** Story Points (Agile estimation unit)
- **API:** Application Programming Interface
- **BaaS:** Backend as a Service
- **PWA:** Progressive Web App
- **UPI:** Unified Payments Interface (India)
- **OCR:** Optical Character Recognition
- **PoC:** Proof of Concept

---

**END OF PRD**

---

**Notes:**
- This PRD is subject to change based on user feedback and technical constraints
- All timelines are estimates and may vary based on team size and velocity
- API costs are estimated based on free tiers; may need budget for scaling
- Security and privacy compliance (GDPR, etc.) should be reviewed before public launch

---

**Prepared by:** Claude AI  
**For:** TripMosaic Development Team  
**Date:** November 9, 2025
