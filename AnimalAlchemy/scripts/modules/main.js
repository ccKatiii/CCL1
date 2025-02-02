import { global } from "./global.js";
import { mainCharacter } from "../gameObjects/mainCharacter.js";
import { boarder } from "../gameObjects/boarder.js";
import { breedingM } from "../gameObjects/breedingM.js";
import { animals } from "../gameObjects/animals.js";
import { popUp } from "../gameObjects/popUp.js";

function gameLoop(totalRunningTime) {
    global.deltaTime = totalRunningTime - global.prevTotalRunningTime; // Time in milliseconds between frames
    global.deltaTime /= 1000; // Convert milliseconds to seconds for consistency in calculations
    global.prevTotalRunningTime = totalRunningTime; // Save the current state of "totalRunningTime", so at the next call of gameLoop (== next frame) to calculate deltaTime again for that next frame.

    if (!global.gamePaused) {
        global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height); // Completely clear the canvas for the next graphical output 

        for (var i = 0; i < global.allGameObjects.length; i++) { //loop in the (game)loop -> the gameloop is continous anyways.. and on every cylce we do now loop through all objects to execute several operations (functions) on each of them: update, draw, collision detection, ...

            if (global.allGameObjects[i].active === true) {
                global.allGameObjects[i].storePositionOfPreviousFrame();
                global.allGameObjects[i].update();
                global.checkCollisionWithAnyOther(global.allGameObjects[i]);
                global.allGameObjects[i].draw();
            };
        };
    };

    requestAnimationFrame(gameLoop); // This keeps the gameLoop running indefinitely
        
  // Check if all base and bred animals have been collected
    const baseAnimals = ['chicken', 'cat', 'fish'];
    const mixedAnimalPairs = [
        ['cat', 'fish'],
        ['chicken', 'cat'],
        ['fish', 'chicken'],
    ];

    // console.log("Collected Animals List:", global.animalCollectionList);

    const hasAllBaseAnimals = baseAnimals.every((type) => {
        const collected = global.animalCollectionList.includes(type);
        // if (collected) console.log(type);
        return collected;
    });

    const hasAllMixedAnimals = mixedAnimalPairs.every((pair) => {
        const collected = global.animalCollectionList.includes(`${pair[0]}-${pair[1]}`) ||  
                        global.animalCollectionList.includes(`${pair[1]}-${pair[0]}`);
        // if (collected) console.log(`${pair[0]}-${pair[1]}`);
        return collected;
    });

    // if (hasAllBaseAnimals) {
    //     console.log("Player has collected all base animals.");
    // };

    // if (hasAllMixedAnimals) {
    //     console.log("Player has collected all mixed animals.");
    // };

    if (hasAllBaseAnimals && hasAllMixedAnimals) {
        // console.log('Collected all required animals!');
        global.collectedAnimals = [];
        endGame('win');
    };
};

function setupGame() {
    let map = [
        [1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025,1025,1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 0, 0, 1025, 1025, 1025, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025],
        [1025, 0, 1025, 1025, 1025, 1025, 1025, 1025, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 1025, 0, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 1025, 1025],
        [1025, 0, 1025, 0, 0, 0, 0, 1025, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 1025, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, ],
        [1025, 0, 1025, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0,0 , 0, 1025, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0,0 , 1025, 1025, 0, 1025, 1025, 1025, 1025, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0,0 , 0, 0, 1025, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0,0, 1025, 1025, 0, 1025, 1025, 1025, 1025, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 1025, 1025, 1025, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  1025, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,  1025, 1025, 1025, 1025, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,  1025, 1025, 1025, 1025, 0, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0 ,0, 1025, 1025],
        [1025, 1025, 1025, 0, 0, 0, 0, 0,0,  0, 0, 0, 1025, 1025, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0,  1025, 1025],
        [1025, 1025, 1025, 0, 0, 0, 0, 0,0,  0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025,0,  0,0 , 1025, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 1025, 1025, 0, 0,0,  0, 1025, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,  0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, , 0, 1025, 1025, 0, 0, , 1025, 1025, 0,0, 0,0, 0, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 1025],
        [1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,    0,  1025],
        [1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0,0, 0, 0, 1025],
        [1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0,0, 0, 0,0, 1025, 1025, 1025],
        [1025, 0, 1025, 1025, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,  0, 1025, 1025, 1025],
        [1025, 0, 0, 1025, 1025, 1025, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025,0, 0, 0, 0, 0, 0,0, 0, 1025],
        [1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025,1025, 1025, 1025, 1025, 1025, 1025, 1025,1025],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0 , 0, 0],
    ];

    for (let i = 0; i < map.length; i++) {
        let innerArray = map[i];
        for (let j = 0; j < innerArray.length; j++) {
            if (innerArray[j] === 1025) {
                new boarder(j * 32 + 0, 64 + i * 32, 32, 32, "../../images/redblock.png");    
            };
        };
    };

    global.breedingM.push(new breedingM(380, 420, 230, 130, "../../images/machine.png"));

    global.animals.push(new animals(990, 110, 100, 100,  "chicken"));
    global.animals.push(new animals(700, 290, 90, 90, "cat", "spooky"));
    global.animals.push(new animals(400, 640, 90, 75,  "cat", "ferrox"));
    global.animals.push(new animals(110, 175, 80, 70,  "fish"));

    global.allAnimalsImages.push("../../images/ferrox.png", "../../images/fishChicken.png", "../../images/spooky.png",  "../../images/chickenCat.png", "../../images/chicken.png",  "../../images/Catfish.png",  "../../images/fish.png",)

    global.playerObject = new mainCharacter(170, 350, 72, 72);
    global.popUp = new popUp(0, 0, 600, 600);
};

function showStartScreen() {
    const startScreen = document.getElementById("startScreen");
    const startButton = document.getElementById("startButton");
    const gameCanvas = document.getElementById("canvas");

    // Show the start screen initially
    startScreen.style.display = 'flex';
    gameCanvas.style.display = 'none';


    // When the "Start Game" button is clicked
    startButton.addEventListener('click', () => {
        // Hide the start screen
        startScreen.style.display = 'none';

        // Show the game canvas
        gameCanvas.style.display = 'block';

        // Set up and start the game
        setupGame();
        requestAnimationFrame(gameLoop);
    });
};

export function endGame(outcome) {
    const endScreen = document.getElementById("endScreen");
    const gameCanvas = document.getElementById("canvas");
    const startAgainButton = document.getElementById("retryButton");

    if (outcome === 'win') {
        console.log("You win!");
        gameCanvas.style.display = "none";
        endScreen.style.display = "block";
    }

    startAgainButton.removeEventListener('click', resetGame); // Prevent duplicate listeners
    startAgainButton.addEventListener('click', resetGame);
}



function resetGame() {
    const endScreen = document.getElementById("endScreen");
    const gameCanvas = document.getElementById("canvas");

    // Hide the end screen and show the canvas
    endScreen.style.display = "none";
    gameCanvas.style.display = "block";

    // Reset all global states and restart the game
    global.allGameObjects = [];
    global.animalCollectionList = [];
    global.collectedAnimals = [];
    global.prevTotalRunningTime = 0;
    global.breedingM = [];
    global.animals = [];
    global.allAnimalsImages = [];
    global.playerObject = null;
    global.popUp = null;


    // Clear any lingering intervals or timeouts if they exist
    cancelAnimationFrame(global.animationFrameId);

    setupGame(); // Reinitialize game setup
    requestAnimationFrame(gameLoop); // Restart game loop
}



/* this is a fix that makes your game still runable after you left the tab/browser for some time: */
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        global.deltaTime = performance.now();
    };
});

// Show the start screen when the page loads
document.addEventListener("DOMContentLoaded", showStartScreen);
