# Eggs And Basket Game
A fun, accelerometer-based mobile game built with React Native + Expo.
You can tilt your phone to move the basket and catch the falling eggs.
Golden eggs give bonus points, but miss one, and it’s GAME OVER!

## Features
- Motion-controlled basket using accelerometer
- Falling eggs with increasing speed
- Golden egg bonus (+5 points)
- Sound on catch/miss
- Game Over & Restart screen
- Responsive for all phone sizes

## Tech Stack
| Tool | Purpose |
|------|---------|
| **React Native** | UI & game logic |
| **Expo** | Easy mobile deployment |
| **expo-sensors** | Accelerometer |
| **expo-av** | Sound effects |
| **JavaScript (ES6)** | Core language |


## Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/eggsAndBasketGame

cd eggsAndBasketGame

# Install dependencies
npm install

# Install sensor & sound libraries
expo install expo-sensors expo-av

# Run the game
npx expo start
```


## How to Play?
- Install the Expo Go app on your phone
- Run the game using the command below
- Tilt your phone → move basket
- Catch eggs → earn points
- Golden egg = +5 points
- Miss one = GAME OVER!

## Here’s what I learned:
- How to use **Expo + React Native** to build a full app
- How phone sensors work using **expo-sensors**
- How to play sounds in a game using **expo-av**
- How to control UI with **motion (accelerometer input)**
- How to update UI using **state + useEffect + game loops**
- How to detect **collisions in a game**
- How to split code and make it cleaner

## Made By
Riddhi Khera :)

For exploring the Expo accelerometer and such features.
