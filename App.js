import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GameBoard from './components/GameBoard';

// Import images
const images = [
    require('./assets/images/ace.png'),
    require('./assets/images/jack.png'),
    require('./assets/images/king.png'),
    require('./assets/images/queen.png'),
    require('./assets/images/ten.png')
];
// Import sounds
const sounds = {
    gameWin: require('./assets/sounds/gameWin.mp3'),
    successDing: require('./assets/sounds/successDing.mp3'),
    wrongBuzzer: require('./assets/sounds/wrongBuzzer.mp3')
};

export default function App() {
    return (
        <View style={styles.container}>
            <GameBoard images={images} sounds={sounds} />
        </View>
    );
};

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
