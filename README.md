# Memory Match App

## Description
This Memory Match Game is a fun and interactive way to test memory skills. Players are presented with a grid of cards, 
each with an image on one side. The goal is to find and match pairs of cards with the same image. The game includes
different difficulty levels and provides visual and auditory feedback for actions like matching pairs, incorrect guesses,
and winning the game.

## Author
- Brigham Baker

## Date
- 2024-03-28

## Features
- showcases animation by flipping the cards
- 3 difficulty levels with additional cards to match with increased difficulty level
- Feedback sounds with correct matches, incorrect guesses, and game wins

## Application Structure
The main logic of the Soundboard App, including audio recording, playback, and database handling, is implemented in the `HomeScreen.js` file.
- **`App.js`**: Sets up the application's root component
- **`GameBoard.js`**: Contains the core functionality and logic for the gameplay.
- **`Card.js`**: Contains the core functionality and logic for the Cards.

## Dependencies
This project relies on the following Expo and React Native libraries:

expo: The framework and platform for universal React applications.
expo-av: Provides audio and video playback and recording functionalities.
react-native-reanimated: Library used to generate Animation functionality.
react-native: The library used to develop the mobile application's UI.

Ensure all dependencies are installed using npm/npx

## How to Play
1. Start the Game: Launch the application using expo and select the difficulty level (Easy, Medium, Hard) to start the game.
2. Match Cards: Tap on the cards to flip them, and try to match the pairs of cards with the same image.
3. Winning the Game: When all pairs are matched, a "You Win!" game screen will appear with an option to return to main menu!

Enjoy Playing this simple Memory Match Game!
