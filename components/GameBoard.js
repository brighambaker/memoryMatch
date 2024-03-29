import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import Card from './Card';

const GameBoard = ({ images, sounds }) => {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);

    const difficultyLevels = {
        easy: 3,
        medium: 4,
        hard: 5
    };

    useEffect(() => {
        if (flippedIndices.length === 2) {
            Haptics.selectionAsync(); // Trigger haptic feedback on guess
            const [firstIndex, secondIndex] = flippedIndices;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard && secondCard && firstCard.image === secondCard.image) {
                playSound(sounds.successDing);
                setMatchedIndices(prev => [...prev, firstIndex, secondIndex]);
                setFlippedIndices([]);
                if (matchedIndices.length + 2 === cards.length) {
                    playSound(sounds.gameWin);
                }
            } else if (firstCard && secondCard) {
                playSound(sounds.wrongBuzzer);
                setTimeout(() => {
                    setCards(currentCards =>
                        currentCards.map((card, index) =>
                            index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
                        )
                    );
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    }, [flippedIndices, cards, matchedIndices, sounds]);

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

    const resetGame = () => {
        setGameStarted(false);
        setCards([]);
        setFlippedIndices([]);
        setMatchedIndices([]);
    };

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
            {!gameStarted && (
                <View style={styles.difficultyButtons}>
                    <View style={{ marginBottom: 10 }}>
                        <Button title="Easy" onPress={() => initializeGame('easy')} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Button title="Medium" onPress={() => initializeGame('medium')} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
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
        marginBottom: 20,
    },
    board: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});

export default GameBoard;
