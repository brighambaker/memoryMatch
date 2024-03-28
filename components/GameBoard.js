import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Card from './Card';

const GameBoard = ({ images }) => {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        let cardArray = images.map((image, index) => ({
            id: index,
            image: image,
            isFlipped: false
        }));
        cardArray = [...cardArray, ...cardArray]; // Duplicate cards for pairs
        cardArray = shuffleArray(cardArray); // Shuffle the cards
        setCards(cardArray);
        setFlippedIndices([]);
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleFlip = (index) => {
        let tempCards = [...cards];
        tempCards[index].isFlipped = true;

        let flippedCards = tempCards.filter(card => card.isFlipped);

        if (flippedCards.length === 2) {
            if (flippedCards[0].image === flippedCards[1].image) {
                // Match found
                Alert.alert("Match found!");
                setFlippedIndices([...flippedIndices, flippedCards[0].id, flippedCards[1].id]);
            } else {
                // No match, flip back after a short delay
                setTimeout(() => {
                    tempCards[flippedCards[0].id].isFlipped = false;
                    tempCards[flippedCards[1].id].isFlipped = false;
                    setCards(tempCards);
                }, 1000);
            }
        }

        if (flippedIndices.length + 2 === cards.length) {
            Alert.alert("Game Over", "You have matched all cards!");
        }

        setCards(tempCards);
    };

    return (
        <View style={styles.board}>
            {cards.map((card, index) => (
                <Card
                    key={index}
                    cardId={index}
                    image={card.image}
                    isFlipped={card.isFlipped || flippedIndices.includes(card.id)}
                    onFlip={handleFlip}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    board: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default GameBoard;
