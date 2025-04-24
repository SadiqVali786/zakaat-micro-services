# Zakaat Distribution Platform - A Full-Stack Microservices Architecture

## 🚀 Project Overview

A sophisticated Zakaat distribution platform that leverages cutting-edge technology to connect donors with verified beneficiaries. Built with a microservices architecture, this platform ensures secure, efficient, and transparent Zakaat distribution while maintaining the highest standards of privacy and security.

### 🎨 UI/UX Design

- **Figma Design:** [View Design](https://www.figma.com/design/VO5aSBXfFWmi5T31LDIQs3/HaqqueZakat?node-id=80-18620&t=n6i2BK4lvv9QF8oc-1)
- **Design Philosophy:** Created with a focus on accessibility, user experience, and modern design principles
- **Responsive Design:** Seamless experience across web and mobile platforms

### 📱 Platform Preview

![Zakaat App Details](apps/nextjs-web-app/public/images/git-display.png)

## 🛠️ Technical Architecture

### Frontend Stack

- **Web Application:** Next.js 15 with TypeScript
- **Mobile Application:** React Native Expo
- **Styling:** Tailwind CSS + Shadcn UI Components
- **State Management:** Zustand for efficient client-side state management
- **Form Handling:** Multi-step forms with Zod validation
- **Real-time Features:** WebSocket integration for instant messaging

### Backend Services

- **Face Verification:** FastAPI backend with Siamese Network (98.56% accuracy)
- **WebRTC Signaling:** Custom signaling server for video calls
- **WebSocket Server:** Real-time communication hub
- **Payment Processing:** Razorpay integration with webhook support
- **Worker Service:** Background job processing
- **Authentication:** NextAuth with OAuth providers

### Data Layer

- **Database:** MongoDB Atlas
- **ORM:** Prisma
- **Caching:** Redis for pub/sub and caching
- **Proximity Search:** Native MongoDB Atlas proximity search
- **Vector Search:** Face embedding similarity search

### DevOps & Infrastructure

- **Containerization:** Docker
- **Orchestration:** Kubernetes
- **Package Management:** Bun
- **Development:** Turbo Repo monorepo
- **CI/CD:** Automated deployment pipelines

## 🌟 Key Features

### Security & Verification

- 🔒 Face Verification System (98.56% accuracy)
- 🔍 Fraud Detection with AI
- 🔐 Secure Authentication
- 🛡️ End-to-end encryption for sensitive data

### Communication

- 💬 Real-time chat (WhatsApp-like interface)
- 📹 Video calls (Omegle-like experience)
- 🔔 Push notifications
- 📧 Email notifications with React Email

### Payment & Transactions

- 💳 UPI instant payments
- 🔄 Automated payment processing
- 📊 Transaction tracking
- 🏦 International payment support (coming soon)

### User Experience

- 📱 Responsive design
- 🔄 Optimistic UI updates
- 📜 Infinite scrolling with pagination
- 🗺️ Proximity-based search
- 📝 Twitter-like text tweeting
- 🔖 Application bookmarking

## 🚀 Future Roadmap

### Phase 1: Global Expansion

- 🌍 International payment integration
- 💱 Multi-currency support
- 🌐 Global beneficiary network

### Phase 2: Mobile Enhancement

- 📱 React Native Expo app
- 🔄 Offline support
- 📱 Native features integration

### Phase 3: AI & ML Enhancement

- 🎯 Voice analysis for fraud detection
- 📹 Video analysis for fraud detection
- 🗣️ Voice-to-text integration
- 🤖 AI-powered matching system

### Phase 4: Backend Evolution

- ⚡ tRPC implementation
- 🦫 Go Lang microservices
- 🔄 Real-time analytics
- 📊 Advanced reporting

## 🛠️ Development Setup

```bash
# Install dependencies
bun install

# Start development servers
bun run dev

# Build for production
bun run build

# Run tests
bun run test
```

## 📚 Documentation

Detailed documentation for each service is available in their respective directories:

- `/apps/nextjs-web-app/README.md`
- `/apps/fastapi-face-verification-be/README.md`
- `/apps/webrtc-signalling-be/README.md`
- `/apps/web-sockets-be/README.md`
- `/apps/worker-be/README.md`
- `/apps/razorpay-payments-be/README.md`
- `/apps/react-native-expo-app/README.md`

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
