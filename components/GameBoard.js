import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, Text } from 'react-native';
import Card from './Card';

const GameBoard = ({ images }) => {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            const [firstIndex, secondIndex] = flippedIndices;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard && secondCard && firstCard.image === secondCard.image) {
                Alert.alert("Match found!");
                setMatchedIndices(prev => [...prev, firstIndex, secondIndex]);
                setFlippedIndices([]);
            } else if (firstCard && secondCard) {
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
    }, [flippedIndices, cards]);

    const initializeGame = () => {
        const doubledImages = [...images, ...images];
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
        initializeGame();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Memory Match</Text>
            {!gameStarted && <Button title="Start Game" onPress={initializeGame} />}
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
    board: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});

export default GameBoard;
