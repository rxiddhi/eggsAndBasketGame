import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import { Audio } from "expo-av";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const BASKET_WIDTH = 90;
const BASKET_HEIGHT = 50;
const EGG_SIZE = 40;
const EGG_START_Y = screenHeight - 80;

export default function App() {
  const [basketX, setBasketX] = useState((screenWidth - BASKET_WIDTH) / 2);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(4);
  const [gameOver, setGameOver] = useState(false);

  const [egg, setEgg] = useState({
    x: Math.random() * (screenWidth - EGG_SIZE),
    y: EGG_START_Y,
    isGolden: false,
  });

  const [catchSound, setCatchSound] = useState(null);
  const [missSound, setMissSound] = useState(null);

  useEffect(() => {
    let catchSoundObj;
    let missSoundObj;

    const loadSounds = async () => {
      try {
        const catchResult = await Audio.Sound.createAsync(
          require("./assets/catch.mp3")
        );
        catchSoundObj = catchResult.sound;
        setCatchSound(catchResult.sound);

        const missResult = await Audio.Sound.createAsync(
          require("./assets/miss.mp3")
        );
        missSoundObj = missResult.sound;
        setMissSound(missResult.sound);
      } catch (e) {}
    };

    loadSounds();

    return () => {
      catchSoundObj?.unloadAsync();
      missSoundObj?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    Accelerometer.setUpdateInterval(20);

    const subscription = Accelerometer.addListener(({ x }) => {
      setBasketX((prevX) => {
        const move = prevX - x * 30;
        return Math.max(0, Math.min(move, screenWidth - BASKET_WIDTH));
      });
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setEgg((prev) => {
        const newY = prev.y - speed;
        if (newY < 0) {
          handleMiss();
          return prev;
        }
        return { ...prev, y: newY };
      });
    }, 30);

    return () => clearInterval(interval);
  }, [speed, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const basketTop = BASKET_HEIGHT + 20;
    const eggBottom = egg.y;
    const isVerticallyAligned = eggBottom <= basketTop + EGG_SIZE / 2;

    const eggCenterX = egg.x + EGG_SIZE / 2;
    const inBasketRange =
      eggCenterX >= basketX && eggCenterX <= basketX + BASKET_WIDTH;

    if (isVerticallyAligned && inBasketRange) handleCatch();
  }, [egg.y, egg.x, basketX, gameOver]);

  const handleCatch = async () => {
    setScore((prev) => prev + (egg.isGolden ? 5 : 1));
    setSpeed((prev) => prev + 0.3);
    try {
      await catchSound?.replayAsync();
    } catch (e) {}
    resetEgg();
  };

  const handleMiss = async () => {
    setGameOver(true);
    try {
      await missSound?.replayAsync();
    } catch (e) {}
  };

  const resetEgg = () => {
    setEgg({
      x: Math.random() * (screenWidth - EGG_SIZE),
      y: EGG_START_Y,
      isGolden: Math.random() < 0.15,
    });
  };

  const handleRestart = () => {
    setScore(0);
    setSpeed(4);
    setGameOver(false);
    resetEgg();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.infoText}>Tilt your phone to move the basket</Text>

      {!gameOver && (
        <View
          style={[
            styles.egg,
            {
              left: egg.x,
              bottom: egg.y,
              backgroundColor: egg.isGolden ? "#FFD700" : "white",
              borderColor: egg.isGolden ? "#FFD700" : "#000",
              shadowColor: egg.isGolden ? "#FFD700" : "#000",
              shadowOpacity: egg.isGolden ? 0.9 : 0,
              shadowRadius: egg.isGolden ? 10 : 0,
            },
          ]}
        />
      )}

      <View style={[styles.basket, { left: basketX }]} />

      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.finalScoreText}>Final Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  basket: {
    position: "absolute",
    bottom: 20,
    width: BASKET_WIDTH,
    height: BASKET_HEIGHT,
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
  },
  egg: {
    position: "absolute",
    width: EGG_SIZE,
    height: EGG_SIZE * 1.2,
    borderRadius: EGG_SIZE,
    borderWidth: 2,
  },
  scoreText: {
    position: "absolute",
    top: 50,
    left: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  infoText: {
    position: "absolute",
    top: 50,
    right: 20,
    fontSize: 12,
    color: "#ccc",
    textAlign: "right",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#FFD700",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});
