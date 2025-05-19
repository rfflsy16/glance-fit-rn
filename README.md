# GlanceFit Mobile App ��‍♂️

GlanceFit is a comprehensive mobile fitness and wellness application designed to help users achieve their health goals through an engaging and interactive experience. Built with modern technologies and user-centric design, GlanceFit combines fitness tracking, social features, and personalized coaching in one seamless platform.

## 🎯 Main Features

### Fitness Tracking & Analytics
- Real-time activity tracking with GPS integration
- Customizable workout plans and exercise library
- Detailed progress analytics with beautiful charts
- Integration with popular fitness wearables (Apple Watch, Fitbit, etc.)
- Sleep tracking and analysis

### Health & Nutrition
- Personalized meal planning and nutrition tracking
- Water intake monitoring
- Calorie and macro tracking
- Barcode scanner for quick food logging
- Recipe suggestions based on dietary preferences

### Social & Community
- Connect with friends and fitness enthusiasts
- Share achievements and progress
- Join fitness challenges and competitions
- Community forums and discussion boards
- Live group workout sessions

### Personalization
- AI-powered workout recommendations
- Adaptive training plans based on progress
- Customizable goals and milestones
- Personalized health insights
- Smart notifications and reminders

## 🛠 Tech Stack

### Frontend
- React Native (Expo) - Latest version for cross-platform development
- TypeScript - For type safety and better development experience
- React Navigation v7 - For seamless navigation
- React Query - For efficient data fetching and caching
- React Native Maps - For location-based features
- React Native Reanimated - For smooth animations
- React Native Skia - For high-performance graphics

### State Management & Data
- React Context API - For global state management
- Async Storage - For local data persistence
- Secure Store - For sensitive data storage
- React Query - For server state management

### UI/UX
- Custom component library
- Responsive design principles
- Gesture handling
- Blur effects and gradients
- Lottie animations

### Development Tools
- Expo SDK 52
- TypeScript configuration
- ESLint and Prettier
- Git for version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or bun package manager
- iOS Simulator (for iOS development)
- Android Studio & Android SDK (for Android development)
- Expo CLI
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/rfflsy16/glance-fit-rn.git
cd glance-fit-rn
```

2. Install dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

3. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Update the environment variables as needed
```

4. Run the application
```bash
# Start the development server
npm start
# or
yarn start
# or
bun start

# Run on iOS simulator
npm run ios
# or
yarn ios
# or
bun run ios

# Run on Android emulator
npm run android
# or
yarn android
# or
bun run android
```

## 📱 Project Structure

```
app/
├── assets/        # Static assets like images, fonts, and animations
├── components/    # Reusable UI components
│   ├── common/    # Shared components
│   ├── forms/     # Form-related components
│   └── layouts/   # Layout components
├── constants/     # App constants and configurations
│   ├── theme.ts   # Theme configuration
│   └── config.ts  # App configuration
├── contexts/      # React context providers
├── hooks/         # Custom React hooks
├── navigators/    # Navigation configuration
├── screens/       # Screen components
│   ├── auth/      # Authentication screens
│   ├── home/      # Home screen and related
│   ├── profile/   # User profile screens
│   └── workout/   # Workout-related screens
└── services/      # API and third-party service integrations
```

## 🔧 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Follow the established folder structure

### Testing
- Write unit tests for critical components
- Implement integration tests for key features
- Use Jest and React Native Testing Library

### Performance
- Optimize images and assets
- Implement proper caching strategies
- Use lazy loading where appropriate
- Monitor and optimize bundle size

## 📝 Additional Notes

### Expo Workflow
- This project uses Expo managed workflow
- Development builds can be tested using Expo Go
- Production builds require EAS (Expo Application Services)
- OTA updates are supported through Expo Updates

### Security
- Implement proper authentication
- Secure storage for sensitive data
- API key management
- Regular security audits

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Pull Request Guidelines
- Update documentation for new features
- Add tests for new functionality
- Ensure all tests pass
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by various fitness apps
- Built with love for the fitness community
