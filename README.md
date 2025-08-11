# Personal Wardrobe Mobile

A React Native mobile app built with Expo for managing your online personal wardrobe.

## Features

- **Authentication**: User login and signup with Firebase
- **Wardrobe Management**: Add, edit, and delete clothing items
- **Filtering and Sorting**: Filter clothes by category, color, brand, and tags; Sort by name, purchase date, or size
- **Statistics Dashboard**: View wardrobe analytics
- **Favorites**: favorite or unfavorite clothing items
- **Profile Management**: Update user profile
- **AI chatBot for suggestions/advices**: Leverage Gemini AI API to provide advices based on user questions

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Authentication**: Firebase Auth
- **Testing**: Jest

## Available Scripts

- `npm start` - Start the Expo development server. Choose 's' to use expo and then 'i' to start simulator.
- `npm test` - Run the tests
- `npm run build` - Build the app for production

## Project Structure

```
app/
├── auth/           # Authentication screens (login, signup)
├── _layout.tsx     # Root layout
├── home.tsx        # Home screen with favorites
├── wardrobe.tsx    # Main wardrobe management
├── addCloth.tsx    # Add new clothing items
├── editItem.tsx    # Edit existing items
├── statistics.tsx  # Analytics dashboard
└── profile.tsx     # User profile

src/
├── contexts/       # React Context providers
├── lib/           # Configuration files (Firebase, constants)
├── services/      # API services

__tests__/         # Test files
assets/           # Images and app icons
```
