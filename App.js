import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GameBoard from './components/GameBoard';

// Import the card images to be used in the game
const images = [
    require('./assets/images/ace.png'),
    require('./assets/images/jack.png'),
    require('./assets/images/king.png'),
    require('./assets/images/queen.png'),
    require('./assets/images/ten.png')
];
// Import the sound files for game events
const sounds = {
    gameWin: require('./assets/sounds/gameWin.mp3'), // Sound played when a game is won
    successDing: require('./assets/sounds/successDing.mp3'), // Sound played when a match is made
    wrongBuzzer: require('./assets/sounds/wrongBuzzer.mp3') // Sound played when an incorrect guess is made
};

// The main App component that renders the game board
export default function App() {
    return (
        <View style={styles.container}>
            <GameBoard images={images} sounds={sounds} />
        </View>
    );
};

// StyleSheet for the App component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});
