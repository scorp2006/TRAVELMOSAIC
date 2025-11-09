import { Link } from 'react-router-dom';
import { Sparkles, Users, Map, DollarSign, MapPin, Smartphone, LogIn } from 'lucide-react';
import SphereImageGrid, { ImageData } from '../components/ui/img-sphere';
import './Landing.css';

// Travel destination images - curated famous landmarks
const BASE_IMAGES: Omit<ImageData, 'id'>[] = [
  {
    src: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&photo-id=lCdayu-e9rY",
    alt: "Charminar",
    title: "Charminar, India",
    description: "Historic monument in Hyderabad"
  },
  {
    src: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&photo-id=5EI5JYMSvj8",
    alt: "India Gate",
    title: "India Gate, Delhi",
    description: "Iconic war memorial arch"
  },
  {
    src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&photo-id=XjKaPInYVCM",
    alt: "Gateway of India",
    title: "Gateway of India, Mumbai",
    description: "Historic arch monument"
  },
  {
    src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&photo-id=QXIBCvvA_jc",
    alt: "Taj Mahal",
    title: "Taj Mahal, India",
    description: "Wonder of the world"
  },
  {
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&photo-id=xWFL4KNd_2A",
    alt: "Goa Beach",
    title: "Goa, India",
    description: "Tropical paradise beaches"
  },
  {
    src: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&photo-id=4UeDRhp2CWk",
    alt: "Kerala Backwaters",
    title: "Kerala, India",
    description: "Serene backwaters and greenery"
  },
  {
    src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    alt: "Burj Khalifa",
    title: "Dubai, UAE",
    description: "World's tallest building"
  },
  {
    src: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&photo-id=Q0-fOL2nqZc",
    alt: "Eiffel Tower",
    title: "Paris, France",
    description: "The City of Light"
  },
  {
    src: "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800&photo-id=ZXlfq5mExMs",
    alt: "Sydney Opera House",
    title: "Sydney, Australia",
    description: "Iconic architectural masterpiece"
  },
  {
    src: "https://images.unsplash.com/photo-1540202404-d0c7fe46a087?w=800&photo-id=exFdOWkYBQw",
    alt: "Maldives",
    title: "Maldives",
    description: "Island paradise"
  },
  {
    src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&photo-id=VFRTXGw1VjU",
    alt: "Colosseum",
    title: "Rome, Italy",
    description: "Ancient Roman amphitheater"
  },
  {
    src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&photo-id=MdJq0zFUwrw",
    alt: "Big Ben",
    title: "London, UK",
    description: "Historic clock tower"
  },
  {
    src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&photo-id=4HG5hlhmZg8",
    alt: "Shibuya Crossing",
    title: "Tokyo, Japan",
    description: "Busiest intersection in the world"
  }
];

// Use only 20 images for a cleaner look (repeat the 13 base images)
const TRAVEL_IMAGES: ImageData[] = [];
for (let i = 0; i < 20; i++) {
  const baseIndex = i % BASE_IMAGES.length;
  const baseImage = BASE_IMAGES[baseIndex];
  TRAVEL_IMAGES.push({
    id: `destination-${i + 1}`,
    ...baseImage
  });
}

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Glass Navigation */}
      <nav className="glass-nav">
        <div className="nav-logo">
          <span className="logo-text">TRIPMOSAIC</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <Link to="/login" className="btn btn-primary">Get Started</Link>
      </nav>

      {/* Hero Section */}
      <section className="section hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title fade-in">
                <span className="title-line">PLAN TRIPS</span>
                <span className="title-line">TOGETHER,</span>
                <span className="title-line">EFFORTLESSLY</span>
              </h1>
              <p className="hero-subtitle fade-in">
                Collaborative trip planning powered by AI. Real-time collaboration,
                smart budgeting, and seamless coordination - all in one place.
              </p>
              <div className="hero-cta fade-in">
                <Link to="/login" className="btn btn-primary btn-large">
                  Start Planning Free
                </Link>
                <button className="btn btn-secondary btn-large">
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="stats-grid fade-in">
                <div className="stat-card glass-card">
                  <div className="stat-value">10K+</div>
                  <div className="stat-label">Trips Planned</div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-value">50+</div>
                  <div className="stat-label">Countries</div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-value">98%</div>
                  <div className="stat-label">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <SphereImageGrid
                images={TRAVEL_IMAGES}
                containerSize={500}
                sphereRadius={200}
                dragSensitivity={0.8}
                momentumDecay={0.96}
                maxRotationSpeed={6}
                baseImageScale={0.15}
                hoverScale={1.3}
                perspective={1000}
                autoRotate={true}
                autoRotateSpeed={0.2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section features-section">
        <div className="container">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">Powerful features for modern travelers</p>

          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon">
                <Sparkles size={48} strokeWidth={1.5} />
              </div>
              <h3 className="feature-title">AI-Powered Planning</h3>
              <p className="feature-desc">
                Let Gemini AI create personalized itineraries based on your preferences and budget
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">
                <Users size={48} strokeWidth={1.5} />
              </div>
              <h3 className="feature-title">Real-Time Collaboration</h3>
              <p className="feature-desc">
                Plan together with friends. See live updates and sync instantly across all devices
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">
                <Map size={48} strokeWidth={1.5} />
              </div>
              <h3 className="feature-title">Interactive Maps</h3>
              <p className="feature-desc">
                Visualize routes, discover places, and navigate with integrated Google Maps
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">
                <DollarSign size={48} strokeWidth={1.5} />
              </div>
              <h3 className="feature-title">Smart Budget Tracking</h3>
              <p className="feature-desc">
                Track expenses, split costs automatically, and stay within budget effortlessly
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">
                <MapPin size={48} strokeWidth={1.5} />
              </div>
              <h3 className="feature-title">Live Location Sharing</h3>
              <p className="feature-desc">
                Share your location during trips for safety and easy meetups with your group
              </p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-icon">
                <Smartphone size={48} strokeWidth={1.5} />
              </div>
              <h3 className="feature-title">Works Everywhere</h3>
              <p className="feature-desc">
                Access your plans on any device, anytime, with automatic cloud sync
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section how-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>

          <div className="steps">
            <div className="step glass-card">
              <div className="step-number">01</div>
              <h3>Create or Generate</h3>
              <p>Start from scratch or let AI create your perfect itinerary</p>
            </div>

            <div className="step glass-card">
              <div className="step-number">02</div>
              <h3>Collaborate & Refine</h3>
              <p>Invite friends, discuss plans, and vote on activities together</p>
            </div>

            <div className="step glass-card">
              <div className="step-number">03</div>
              <h3>Go & Enjoy</h3>
              <p>Access everything offline, track expenses, and create memories</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Planning?</h2>
            <p>Join thousands of travelers creating unforgettable journeys</p>
            <Link to="/login" className="btn btn-primary btn-large">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">TRIPMOSAIC</div>
              <p className="footer-tagline">Plan Beyond Boundaries</p>
            </div>
            <div className="footer-right">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
