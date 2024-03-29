import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import Card from './Card';

// The GameBoard component manages the state and logic of the memory match game.
const GameBoard = ({ images, sounds }) => {
    // State hooks for managing the cards, their flipped state, and matched pairs
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    // Defines the number of cards to use for each difficulty level
    const difficultyLevels = {
        easy: 3,
        medium: 4,
        hard: 5
    };

    // useEffect hook to handle the game logic when two cards are flipped
    useEffect(() => {
        if (flippedIndices.length === 2) {
            const [firstIndex, secondIndex] = flippedIndices;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            // Prevents additional feedback if already given for the current pair
            if (!feedbackGiven && firstCard && secondCard) {
                setFeedbackGiven(true);

                if (firstCard.image === secondCard.image) {
                    // Play sound and vibrate for correct match
                    playSound(sounds.successDing);
                    Vibration.vibrate(500);
                    setMatchedIndices(prev => [...prev, firstIndex, secondIndex]);

                    // Check if all cards are matched to trigger game win
                    if (matchedIndices.length + 2 === cards.length && cards.length > 0) {
                        playSound(sounds.gameWin);
                        Vibration.vibrate(1000); // Long vibration for game win
                        setGameWon(true);
                    }

                    setFlippedIndices([]);

                    // Reset feedbackGiven after a short delay
                    setTimeout(() => {
                        setFeedbackGiven(false);
                    }, 500);

                } else {
                    // Play sound and vibrate for incorrect match
                    playSound(sounds.wrongBuzzer);
                    Vibration.vibrate(500);

                    setTimeout(() => {
                        // Flip the cards back over and reset feedbackGiven
                        setCards(currentCards =>
                            currentCards.map((card, index) =>
                                index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
                            )
                        );
                        setFlippedIndices([]);
                        setFeedbackGiven(false);
                    }, 1000);
                }
            }
        } else if (feedbackGiven) {
            setFeedbackGiven(false);
        }
    }, [flippedIndices, cards, matchedIndices, sounds, feedbackGiven]);

    // Initializes the game with the selected difficulty
    const initializeGame = (difficulty) => {
        let selectedImages = images.slice(0, difficultyLevels[difficulty]);
        const doubledImages = [...selectedImages, ...selectedImages];
        const shuffledCards = doubledImages.map((image, index) => ({
            id: index,
            image,
            isFlipped: false
        })).sort(() => Math.random() - 0.5);

        setCards(shuffledCards);
        setFlippedIndices([]);
        setMatchedIndices([]);
        setGameStarted(true);
        setGameWon(false);  // Reset game won state for new game
    };

    // Handles the card flip action
    const handleFlip = (index) => {
        if (!gameStarted || cards[index].isFlipped || flippedIndices.length >= 2 || matchedIndices.includes(index)) {
            return;
        }

        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        const newCards = cards.map((card, idx) =>
            idx === index ? { ...card, isFlipped: true } : card
        );
        setCards(newCards);
    };

    // Resets the game to the initial state
    const resetGame = () => {
        setGameStarted(false);
        setCards([]);
        setFlippedIndices([]);
        setMatchedIndices([]);
        setGameWon(false);  // Ensure game won state is reset
    };

    // Function to load and play a sound
    const playSound = async (soundFile) => {
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync(soundFile);
            await soundObject.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Memory Match</Text>
            {!gameStarted && !gameWon && (
                <View style={styles.difficultyButtons}>
                    <View style={styles.buttonContainer}>
                        <Button title="Easy" onPress={() => initializeGame('easy')} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Medium" onPress={() => initializeGame('medium')} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Hard" onPress={() => initializeGame('hard')} />
                    </View>
                </View>
            )}
            {gameStarted && !gameWon && (
                <View style={styles.board}>
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            cardId={index}
                            image={card.image}
                            isFlipped={card.isFlipped || matchedIndices.includes(index)}
                            onFlip={() => handleFlip(index)}
                        />
                    ))}
                </View>
            )}
            {gameWon && (
                <View style={styles.winMessageContainer}>
                    <Text style={styles.winMessage}>You Win!</Text>
                    <Button title="Back to Main Menu" onPress={resetGame} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    difficultyButtons: {
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        marginBottom: 10,
    },
    board: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    winMessageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    winMessage: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default GameBoard;
