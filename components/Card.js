import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Card = ({ image, onFlip, cardId, isFlipped }) => {
    const [flipped, setFlipped] = useState(isFlipped);

    const handlePress = () => {
        setFlipped(!flipped);
        onFlip(cardId);
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.card}>
                {flipped ? (
                    <Image source={image} style={styles.image} resizeMode="contain" />
                ) : (
                    <View style={styles.cardBack} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 100,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.3,
        elevation: 8,
    },
    image: {
        width: 90,
        height: 140,
        borderRadius: 10,
    },
    cardBack: {
        width: 90,
        height: 140,
        backgroundColor: '#0d47a1',
        borderRadius: 10,
    },
});

export default Card;
