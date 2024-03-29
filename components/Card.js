import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolate } from 'react-native-reanimated';

// Card component receives properties from its parent, including the image to display, the flip function, and the flipped state.
const Card = ({ image, onFlip, cardId, isFlipped }) => {
    // rotateY is an animated value used for flipping the card around the Y axis.
    const rotateY = useSharedValue(0);

    // useEffect will run when the isFlipped state changes. It animates rotateY to 180 degrees for a flip effect.
    useEffect(() => {
        rotateY.value = withSpring(isFlipped ? 180 : 0);
    }, [isFlipped, rotateY]);

    // Animated style for the front of the card. It interpolates the rotateY value to rotate between 180 and 360 degrees.
    const frontAnimatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            rotateY.value,
            [0, 180],
            [180, 360],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ rotateY: `${rotate}deg` }],
            opacity: rotateY.value <= 90 ? 0 : 1,
        };
    });

    // Animated style for the back of the card. It interpolates the rotateY value to rotate between 0 and 180 degrees.
    const backAnimatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            rotateY.value,
            [0, 180],
            [0, 180],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ rotateY: `${rotate}deg` }],
            opacity: rotateY.value <= 90 ? 1 : 0,
        };
    });

    // handlePress is called when the card is pressed. It triggers the onFlip function passed from the parent.
    const handlePress = () => {
        onFlip(cardId);
    };

    // The card component layout, showing either the front or back of the card based on the flip state.
    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.card}>
                {/* The back of the card */}
                <Animated.View style={[styles.face, backAnimatedStyle, styles.cardBack]}>
                    <View style={styles.cardBackContent} />
                </Animated.View>
                {/* The front of the card, showing the image */}
                <Animated.View style={[styles.face, frontAnimatedStyle, styles.front]}>
                    <Image source={image} style={styles.image} resizeMode="contain" />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};

// StyleSheet for the card component
const styles = StyleSheet.create({
    card: {
        width: 100,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20, // Rounded corners for the card
        overflow: 'hidden', // Ensures the content respects the rounded corners
    },
    face: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
    },
    front: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 90,
        height: 140,
        borderRadius: 15, // Rounded corners for the image
    },
    cardBack: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0d47a1',
    },
    cardBackContent: {
        width: 90,
        height: 140,
        borderRadius: 15, // Rounded corners for the back content
    },
});

export default Card;
