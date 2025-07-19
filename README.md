# Pokédex Mobile App 📱

A beautiful and functional Pokédx mobile application built with React Native and Expo, featuring all 1010 Pokémon from the PokéAPI. This app provides an intuitive interface to browse, search, and share your favorite Pokémon!

## ✨ Features

- **Complete Pokédx**: Browse all 1010 Pokémon with beautiful cards
- **Smart Search**: Search by Pokémon name or ID number
- **Detailed Views**: Comprehensive Pokémon information including stats, types, height, and weight
- **Cross-Platform Sharing**: Share Pokémon cards as images or links (works on both iOS and Android!)
- **Responsive Design**: Optimized for both iPhone and Android devices
- **Smooth Navigation**: Intuitive navigation between list and detail screens

## 🛠 Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and build tools
- **Styled Components** - CSS-in-JS styling solution
- **React Navigation** - Navigation library for screen transitions
- **PokéAPI** - RESTful API for Pokémon data
- **Expo Media Library** - Device photo library access
- **React Native View Shot** - Screenshot capture functionality

## 📱 Project Structure

```
pokedex/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── babel.config.js             # Babel configuration
├── package.json                # Dependencies and scripts
├── images/
│   └── pokeball.png           # App assets
└── src/
    ├── theme.js               # Centralized theming with cross-platform adjustments
    ├── components/
    │   └── PokemonCard.js     # Reusable Pokemon card component
    ├── navigation/
    │   └── AppNavigator.js    # Navigation configuration
    ├── screens/
    │   ├── ListScreen.js      # Main Pokemon list with search
    │   └── DetailsScreen.js   # Individual Pokemon details
    └── services/
        └── PokemonService.js  # API service and data formatting
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/joaoistfrei/Pokedex_Mobile.git
   cd Pokedex_Mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## 🔧 Development Process

This project was developed incrementally with several interesting challenges and solutions:

### Initial Setup
Started with the basic React Native + Expo setup, implementing the core navigation structure and basic Pokemon list functionality using the PokéAPI.

### API Integration
Implemented a comprehensive Pokemon service that handles:
- Fetching the complete list of 1010 Pokémon
- Individual Pokemon details with proper error handling
- Data formatting for consistent display
- Portuguese comments throughout the codebase for better maintainability

### Cross-Platform Consistency
One of the biggest challenges was ensuring the app looked and felt consistent across iOS and Android. We implemented:
- Platform-specific theming using `Platform.OS` conditionals
- Different font sizes and spacing for iOS vs Android
- Responsive design patterns that work on various screen sizes

### Search Functionality
Added a robust search system that allows users to find Pokémon by:
- Name (case-insensitive)
- Pokédx number
- Real-time filtering as you type

### Sharing Feature Challenge
Initially ran into a major issue where sharing Pokémon cards worked perfectly on iOS but only shared text on Android. After investigation, we discovered that:

- **iOS**: Native `Share.share()` API properly handles image URLs
- **Android**: Native sharing API has limitations with image files

**Solution**: Implemented platform-specific sharing logic:
```javascript
if (Platform.OS === 'ios') {
  // Use native Share API for iOS
  await Share.share({
    message: `Check out ${pokemonName}!`,
    url: imageUri,
    title: 'Pokemon Card',
  });
} else {
  // Use expo-sharing for Android
  await Sharing.shareAsync(imageUri, {
    mimeType: 'image/png',
    dialogTitle: 'Pokemon Card',
  });
}
```

This fix required adding the `expo-sharing` dependency specifically for Android image sharing capabilities.

## 🎨 Design Decisions

### Theme System
Created a centralized theme system that handles:
- Colors (primary, secondary, background, text)
- Typography (sizes, weights)
- Spacing (consistent margins and padding)
- Platform-specific adjustments

### Component Architecture
- **PokemonCard**: Reusable component with type-based coloring
- **Screens**: Separation of concerns between list and detail views
- **Services**: Centralized API logic with proper error handling

### User Experience
- Loading states for better perceived performance
- Error handling with retry mechanisms
- Smooth transitions between screens
- Visual feedback for user interactions

## 🐛 Known Issues & Solutions

1. **Font Integration**: Initially attempted to use custom Pokemon fonts but ran into compatibility issues. Solved by using system fonts with proper styling.

2. **Image Sharing**: Cross-platform sharing required platform-specific implementations as described above.

3. **Memory Management**: With 1010 Pokémon, implemented efficient data loading and caching strategies.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests. This project is open for improvements and new features!

## 📄 License

This project is for educational purposes. Pokémon and related characters are trademarks of Nintendo, Game Freak, and Creatures Inc.

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the comprehensive Pokémon database
- The React Native and Expo communities for excellent documentation and support
- Nintendo, Game Freak, and Creatures Inc. for creating the amazing Pokémon universe

---

Built with ❤️ and lots of ☕ by a passionate developer who grew up playing Pokémon games!