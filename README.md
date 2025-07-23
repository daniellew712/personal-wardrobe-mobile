# Personal Wardrobe Mobile App

A React Native mobile application for managing your personal wardrobe and outfits.

## Features

- Browse and organize your clothing items
- Create and save outfits
- Track wearing patterns and statistics
- Add new clothing items with photos
- Categorize items by type, season, and style

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo** for development and deployment

## Getting Started

### Prerequisites

- Node.js (14 or later)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm start
```

This will open the Expo development tools in your browser. You can then:

- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Scan the QR code with Expo Go app on your phone

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android
- `npm run ios` - Start the app on iOS
- `npm run web` - Start the app in web browser

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/       # API and data services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
