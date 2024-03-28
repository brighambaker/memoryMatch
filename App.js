import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GameBoard from './components/GameBoard';

// Import images
const images = [
    require('./assets/images/ace.png'),
    require('./assets/images/jack.png'),
    require('./assets/images/king.png'),
    require('./assets/images/queen.png'),
    //require('./assets/images/ten.png')
];

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}> </Text>
            <GameBoard images={images} />
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
