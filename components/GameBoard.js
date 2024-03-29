import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, Text, Vibration } from 'react-native';
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

            if (!feedbackGiven && firstCard && secondCard) {
                if (firstCard.image === secondCard.image) {
                    // Correct match
                    playSound(sounds.successDing);
                    Vibration.vibrate(500);  // Short vibration for correct match
                    setMatchedIndices(prev => [...prev, firstIndex, secondIndex]);

                    // Check for game win condition
                    if (matchedIndices.length + 2 === cards.length) {
                        playSound(sounds.gameWin);
                        Vibration.vibrate(1000);  // Longer vibration for game win
                    }

                    setFlippedIndices([]);
                    setFeedbackGiven(true);

                    // Reset feedbackGiven for the next action
                    setTimeout(() => {
                        setFeedbackGiven(false);
                    }, 500);  // Reset after the same duration as the vibration

                } else {
                    // Incorrect match
                    playSound(sounds.wrongBuzzer);
                    Vibration.vibrate(500);  // Vibration for incorrect match
                    setFeedbackGiven(true);

                    setTimeout(() => {
                        setCards(currentCards =>
                            currentCards.map((card, index) =>
                                index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
                            )
                        );
                        setFlippedIndices([]);
                        setFeedbackGiven(false);  // Reset feedbackGiven for the next action
                    }, 1000);  // Wait for 1 second before allowing the next action
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

    // Render the game board, difficulty selection buttons, and the cards
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Memory Match</Text>
            {!gameStarted && (
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
            <View style={styles.board}>
                {gameStarted && cards.map((card, index) => (
                    <Card
                        key={index}
                        cardId={index}
                        image={card.image}
                        isFlipped={card.isFlipped || matchedIndices.includes(index)}
                        onFlip={() => handleFlip(index)}
                    />
                ))}
            </View>
            {gameStarted && <Button title="Reset Game" onPress={resetGame} />}
        </View>
    );
};

// Styles for the game board layout
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
});

export default GameBoard;
