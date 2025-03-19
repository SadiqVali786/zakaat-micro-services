# 🌟 Haqque Zakat - Modern Microservices Platform

## 🎯 Overview

Haqque Zakat is a comprehensive microservices-based platform that revolutionizes Zakat distribution through technology. It connects donors with verified beneficiaries while leveraging cutting-edge AI to ensure authentic and efficient charitable giving.

### Figma UI/UX Design Live Link

<https://www.figma.com/design/VO5aSBXfFWmi5T31LDIQs3/HaqqueZakat?node-id=80-18620&t=n6i2BK4lvv9QF8oc-1>

### Landing Page Sneak Peak

![Zakaat App Details](/apps/nextjs-web-app/public/images/git-display.png)

## 🏗️ System Architecture

![High Level Design Diagram](/apps/nextjs-web-app/public/images/hld-diagram.png)

Our architecture consists of:

- **Client Layer:**
  - Browser Client
  - React Native Expo Client (Android & iOS)
- **Server Components:**
  - NextJS Web App (Frontend & Backend for Web, Backend for Mobile)
  - WebSocket Server Fleet (Real-time Chat)
  - Golang WebRTC Signaling Server
  - FastAPI Face Verification Server
  - Worker Fleet (Database Operations)
- **Infrastructure:**
  - Redis (Pub/Sub & Caching)
  - Redis Message Queue
  - MongoDB (with Geospatial Capabilities)

## 🛠️ Tech Stack

### Frontend Ecosystem

- **Web Platform:** Next.js 15 with TypeScript
- **Mobile Platform:** React Native (Expo) for Android & iOS
- **State Management:** Zustand
- **UI Libraries:** Shadcn, Aceternity, MagicUI
- **Styling:** TailwindCSS

### Backend Infrastructure

- **Primary Database:** MongoDB with Geospatial Indexing
- **Caching & Message Queue:** Redis
- **API Servers:**
  - NextJS API Routes
  - FastAPI (Face Verification)
  - Golang (WebRTC Signaling)
- **Real-time Communications:**
  - WebSocket Fleet for Chat
  - WebRTC for Audio/Video Calls
- **Worker System:** Distributed Task Processing
- **Container Orchestration:** Docker & Kubernetes
- **Media Management:** Cloudinary

### AI/ML Components

- **Computer Vision:**
  - Siamese Network (98.56% accuracy)
  - Face Verification for Fraud Detection
- **NLP:** Advanced Text Summarization
- **Location Services:** MongoDB $geoNear with Geospatial Indexing

## ✨ Key Features

### Core Functionality

- 🤖 AI-Powered Fraud Detection
- 📍 Proximity-based Application Matching
- 💬 Real-time Communication Suite
- 🔒 Secure Authentication System
- 📱 Cross-Platform Compatibility

### User Experience

- ⚡ Optimistic UI Updates
- 🎯 Server Components Integration
- 📊 Dynamic State Management
- 🎨 Responsive Design System
- 🔄 Real-time Collaboration Features

### Social Impact Features

- 👥 Network-based Application Suggestions
- 🔖 Application Bookmarking System
- 🤝 Anonymous Support Options
- 📊 Impact Tracking Dashboard

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- Bun >= 1.0.0
- Docker >= 24.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/haqque-zakat.git

# Install dependencies
bun install

# Run redis container
docker run -d --name zakaat-redis -p 6379:6379 redis

# Provide mongodb database URI in .env file

# Set up environment variables
cp .env.example .env

# Start development environment
bun dev
```

## 🌐 Live Demo

- **UI/UX Design:** [Figma Prototype](https://www.figma.com/design/VO5aSBXfFWmi5T31LDIQs3/HaqqueZakat?node-id=80-18620&t=n6i2BK4lvv9QF8oc-1)
- **Production App:** [Live Demo]

## 📈 Performance Metrics

- 🔒 98.56% Fraud Detection Accuracy (Siamese Network)
- 📱 100% Cross-Platform Compatibility

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- The Open Source Community
- Our Beta Testers
- Contributing Developers

---

<p align="center">Built with ❤️ for the Community</p>
